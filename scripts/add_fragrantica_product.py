#!/usr/bin/env python3
"""
Smells From Heaven — Fragrantica Product Importer

Interactive usage:
    python scripts\add_fragrantica_product_v4.py

Then paste Fragrantica URLs one by one.
Type EXIT, Q, or QUIT to stop.

Single URL usage is also supported:
    python scripts\add_fragrantica_product_v4.py "https://www.fragrantica.com/perfume/Tom-Ford/Oud-Wood-1826.html"

Multiple URL usage is supported:
    python scripts\add_fragrantica_product_v4.py "URL1" "URL2"

The script:
- fetches ONLY the exact Fragrantica URL supplied
- extracts product name and brand from the exact URL
- extracts Fragrance Family
- extracts Main Accords only
- extracts the primary product image
- downloads the image into public/products/<slug>/
- creates or safely updates product.json
- preserves existing product data and images
- does not perform search-engine discovery
"""

from __future__ import annotations

import argparse
import json
import mimetypes
import re
import shutil
import sys
import time
from pathlib import Path
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup


# ============================================================
# PATHS / CONFIG
# ============================================================

ROOT = Path(__file__).resolve().parents[1]
PRODUCTS_DIR = ROOT / "public" / "products"

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/151.0.0.0 Safari/537.36"
)

HEADERS = {
    "User-Agent": USER_AGENT,
    "Accept": (
        "text/html,application/xhtml+xml,application/xml;q=0.9,"
        "image/avif,image/webp,*/*;q=0.8"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}

CURRENT_URL = ""


# ============================================================
# BASIC HELPERS
# ============================================================

def clean_text(value: str | None) -> str:
    if not value:
        return ""
    return re.sub(r"\s+", " ", value).strip()


def normalize_identity(value: str) -> str:
    value = value.casefold()
    value = value.replace("’", "'")
    return re.sub(r"[^a-z0-9]+", "", value)


def slugify(value: str) -> str:
    value = value.casefold()
    value = value.replace("’", "'")
    value = value.replace("&", " and ")
    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = re.sub(r"-+", "-", value).strip("-")
    return value


def is_valid_fragrantica_url(url: str) -> bool:
    try:
        parsed = urlparse(url.strip())
        host = parsed.netloc.casefold().split(":")[0]
        path = parsed.path.casefold()

        return (
            host in {"fragrantica.com", "www.fragrantica.com"}
            and path.startswith("/perfume/")
            and path.endswith(".html")
        )
    except Exception:
        return False


def stop_error(message: str) -> None:
    """
    Raise an exception that can be caught by interactive mode.

    This is intentionally NOT SystemExit because interactive mode should
    continue and allow the user to paste another URL.
    """
    raise RuntimeError(message)


# ============================================================
# HTTP
# ============================================================

def fetch_page(url: str) -> tuple[str, str]:
    try:
        response = requests.get(
            url,
            headers=HEADERS,
            timeout=30,
            allow_redirects=True,
        )
    except requests.RequestException as exc:
        stop_error(f"Could not fetch the supplied Fragrantica URL: {exc}")

    if response.status_code != 200:
        stop_error(
            f"Fragrantica returned HTTP {response.status_code} "
            "for the supplied URL."
        )

    content_type = response.headers.get("content-type", "").casefold()

    if (
        "text/html" not in content_type
        and not response.text.lstrip().startswith("<")
    ):
        stop_error("The supplied URL did not return an HTML page.")

    return response.text, response.url


# ============================================================
# HTML / JSON-LD HELPERS
# ============================================================

def first_meta(soup: BeautifulSoup, *keys: tuple[str, str]) -> str:
    for attr, value in keys:
        node = soup.find("meta", attrs={attr: value})

        if node and node.get("content"):
            text = clean_text(node["content"])

            if text:
                return text

    return ""


def extract_json_ld(soup: BeautifulSoup) -> list[dict]:
    results: list[dict] = []

    for node in soup.find_all(
        "script",
        attrs={"type": re.compile(r"ld\+json", re.I)},
    ):
        raw = node.string or node.get_text()

        if not raw:
            continue

        try:
            data = json.loads(raw)
        except Exception:
            continue

        if isinstance(data, dict):
            results.append(data)

        elif isinstance(data, list):
            results.extend(
                item for item in data if isinstance(item, dict)
            )

    return results


def find_json_ld_product(soup: BeautifulSoup) -> dict:
    for data in extract_json_ld(soup):
        dtype = data.get("@type")
        types = dtype if isinstance(dtype, list) else [dtype]

        if any(
            str(item).casefold() == "product"
            for item in types
        ):
            return data

    return {}


# ============================================================
# PRODUCT NAME / BRAND
# ============================================================

def extract_name_brand(soup: BeautifulSoup) -> tuple[str, str]:
    """
    Prefer the exact Fragrantica URL.

    Example:
        /perfume/Tom-Ford/Oud-Wood-1826.html

    becomes:
        Brand = Tom Ford
        Name  = Oud Wood
    """

    parsed = urlparse(CURRENT_URL)
    parts = [part for part in parsed.path.split("/") if part]

    if len(parts) >= 3 and parts[0].casefold() == "perfume":
        brand_slug = parts[1]
        product_slug = parts[2]

        product_slug = re.sub(
            r"-\d+\.html$",
            "",
            product_slug,
            flags=re.I,
        )

        brand = clean_text(brand_slug.replace("-", " "))
        name = clean_text(product_slug.replace("-", " "))

        if brand and name:
            return name, brand

    # Conservative structured-data fallback.
    product = find_json_ld_product(soup)

    name = clean_text(product.get("name"))

    brand_value = product.get("brand")

    if isinstance(brand_value, dict):
        brand = clean_text(brand_value.get("name"))
    else:
        brand = (
            clean_text(str(brand_value))
            if brand_value
            else ""
        )

    if not name:
        title = first_meta(
            soup,
            ("property", "og:title"),
            ("name", "twitter:title"),
        )
        name = clean_text(title)

    if name and " - " in name:
        possible_brand, possible_name = name.split(
            " - ",
            1,
        )

        if not brand:
            brand = clean_text(possible_brand)

        name = clean_text(possible_name)

    if not name:
        stop_error(
            "Could not reliably extract the perfume name."
        )

    return name, brand


# ============================================================
# GENERIC LABEL EXTRACTION
# ============================================================

def find_label_value(
    soup: BeautifulSoup,
    patterns: list[str],
) -> str:

    regex = re.compile(
        "|".join(patterns),
        re.I,
    )

    for node in soup.find_all(
        ["dt", "th", "strong", "b", "span", "div"]
    ):
        label = clean_text(
            node.get_text(" ", strip=True)
        )

        if not label:
            continue

        if len(label) > 80:
            continue

        if not regex.search(label):
            continue

        candidates = [
            node.find_next_sibling(),
            (
                node.parent.find_next_sibling()
                if node.parent
                else None
            ),
        ]

        for candidate in candidates:
            if candidate:
                text = clean_text(
                    candidate.get_text(
                        " ",
                        strip=True,
                    )
                )

                if text and not regex.search(text):
                    return text

        parent = node.parent

        if parent:
            text = clean_text(
                parent.get_text(
                    " ",
                    strip=True,
                )
            )

            text = regex.sub(
                "",
                text,
            ).strip(" :-–—")

            if text and len(text) < 160:
                return text

    return ""


# ============================================================
# FRAGRANCE FAMILY
# ============================================================

def extract_family(soup: BeautifulSoup) -> str:
    """
    Fragrantica pages may not expose a literal
    "Fragrance Family" label.

    Prefer explicit family labels.
    Otherwise inspect the perfume description sentence.
    """

    family = find_label_value(
        soup,
        [
            r"fragrance\s*family",
            r"fragrance\s*type",
            r"olfactive\s*family",
        ],
    )

    if family:
        return family

    candidates = []

    meta_description = first_meta(
        soup,
        ("name", "description"),
        ("property", "og:description"),
    )

    if meta_description:
        candidates.append(meta_description)

    product = find_json_ld_product(soup)

    json_description = clean_text(
        str(product.get("description", ""))
    )

    if json_description:
        candidates.append(json_description)

    for paragraph in soup.find_all("p"):
        text = clean_text(
            paragraph.get_text(
                " ",
                strip=True,
            )
        )

        if (
            "is a " in text.casefold()
            and " fragrance" in text.casefold()
        ):
            candidates.append(text)

    family_pattern = re.compile(
        r"\bis\s+(?:an?|the)\s+(.+?)\s+fragrance\s+for\s+",
        re.I,
    )

    family_pattern_without_gender = re.compile(
        r"\bis\s+(?:an?|the)\s+(.+?)\s+fragrance(?:\.|,|\s)",
        re.I,
    )

    for text in candidates:

        match = family_pattern.search(text)

        if match:
            value = clean_text(match.group(1))

            if 2 <= len(value) <= 80:
                return value

        match = family_pattern_without_gender.search(text)

        if match:
            value = clean_text(match.group(1))

            if 2 <= len(value) <= 80:
                return value

    # Conservative selector fallback.
    for selector in [
        '[class*="fragrance-family"]',
        '[id*="fragrance-family"]',
    ]:
        node = soup.select_one(selector)

        if node:
            text = clean_text(
                node.get_text(
                    " ",
                    strip=True,
                )
            )

            if text and len(text) < 160:
                return text

    return ""


# ============================================================
# MAIN ACCORDS
# ============================================================

def extract_accords(soup: BeautifulSoup) -> list[str]:
    """
    Extract ONLY Main Accord labels.

    Do NOT confuse perfume notes such as:
    Cardamom, Sandalwood, Vanilla, etc.
    with Main Accords.
    """

    values: list[str] = []

    known_accords = {
        "woody",
        "oud",
        "warm spicy",
        "aromatic",
        "vanilla",
        "balsamic",
        "fresh spicy",
        "amber",
        "powdery",
        "sweet",
        "citrus",
        "fruity",
        "floral",
        "aquatic",
        "green",
        "earthy",
        "musky",
        "rose",
        "white floral",
        "yellow floral",
        "iris",
        "violet",
        "herbal",
        "tobacco",
        "leather",
        "smoky",
        "marine",
        "salty",
        "nutty",
        "coffee",
        "chocolate",
        "caramel",
        "beeswax",
        "cannabis",
        "mineral",
        "ozonic",
        "metallic",
        "savory",
        "soapy",
        "animalic",
        "aldehydic",
        "lavender",
        "mossy",
        "conifer",
        "coconut",
        "lactonic",
        "bitter",
        "camphor",
        "tuberose",
        "tropical",
    }

    def clean_accord(value: str) -> str:
        value = clean_text(value)
        value = re.sub(
            r"\s+",
            " ",
            value,
        )
        return value.strip("•·|:-–—")

    def valid(value: str) -> bool:
        value = clean_accord(value)

        if not value:
            return False

        lower = value.casefold()

        if lower in known_accords:
            return True

        if lower.replace("-", " ") in known_accords:
            return True

        return False

    # Locate exact Main Accords heading.
    heading = None

    for node in soup.find_all(
        [
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "strong",
            "b",
            "div",
            "span",
        ]
    ):
        text = clean_text(
            node.get_text(
                " ",
                strip=True,
            )
        )

        if re.fullmatch(
            r"main\s+accords?",
            text,
            re.I,
        ):
            heading = node
            break

    if not heading:
        return []

    # Nearby containers only.
    containers = []

    current = heading

    for _ in range(5):
        current = (
            current.parent
            if current
            else None
        )

        if current:
            containers.append(current)

    # Priority 1: explicit accord attributes/classes.
    for container in containers:

        accord_nodes = container.select(
            '[class*="accord"], '
            '[class*="accord-name"], '
            '[class*="accordName"], '
            '[data-accord], '
            '[data-accord-name]'
        )

        for node in accord_nodes:

            candidates = []

            for attr in [
                "data-accord",
                "data-accord-name",
                "title",
                "aria-label",
            ]:
                raw = node.get(attr)

                if raw:
                    candidates.append(str(raw))

            candidates.append(
                node.get_text(
                    " ",
                    strip=True,
                )
            )

            for candidate in candidates:

                if valid(candidate):
                    values.append(
                        clean_accord(candidate)
                    )

        if values:
            break

    # Priority 2: nearby short elements.
    if not values:

        for container in containers:

            for node in container.find_all(
                ["a", "span", "div"]
            ):
                value = clean_accord(
                    node.get_text(
                        " ",
                        strip=True,
                    )
                )

                if valid(value):
                    values.append(value)

            if values:
                break

    # Deduplicate while preserving page order.
    result = []
    seen = set()

    for value in values:

        key = normalize_identity(value)

        if not key or key in seen:
            continue

        seen.add(key)
        result.append(value)

    return result[:20]


# ============================================================
# GENDER
# ============================================================

def extract_gender(soup: BeautifulSoup) -> str:

    product = find_json_ld_product(soup)

    category = clean_text(
        str(product.get("category", ""))
    )

    if category and any(
        x in category.casefold()
        for x in ["men", "women", "unisex"]
    ):
        return category

    text = clean_text(
        soup.get_text(
            " ",
            strip=True,
        )
    )

    match = re.search(
        r"(?:for|gender)\s*[:\-]?\s*"
        r"(women and men|men and women|women|men|unisex)",
        text,
        re.I,
    )

    return (
        clean_text(match.group(1))
        if match
        else ""
    )


# ============================================================
# IMAGE
# ============================================================

def extract_image_url(
    soup: BeautifulSoup,
    base_url: str,
) -> str:

    product = find_json_ld_product(soup)

    image = product.get("image")

    candidates: list[str] = []

    if isinstance(image, str):
        candidates.append(image)

    elif isinstance(image, list):
        candidates.extend(
            str(x)
            for x in image
            if x
        )

    # OpenGraph / Twitter.
    for attr, value in [
        ("property", "og:image"),
        ("property", "og:image:url"),
        ("name", "twitter:image"),
    ]:
        meta = soup.find(
            "meta",
            attrs={attr: value},
        )

        if meta and meta.get("content"):
            candidates.append(
                meta["content"]
            )

    # Page images.
    for node in soup.find_all(
        ["img", "source"]
    ):

        for attr in [
            "src",
            "data-src",
            "data-original",
            "srcset",
        ]:

            raw = node.get(attr)

            if not raw:
                continue

            if attr == "srcset":
                raw = (
                    raw.split(",")[0]
                    .strip()
                    .split(" ")[0]
                )

            candidates.append(raw)

    # Prefer actual product images.
    for raw in candidates:

        url = urljoin(
            base_url,
            raw.strip(),
        )

        parsed = urlparse(url)

        if parsed.scheme not in {
            "http",
            "https",
        }:
            continue

        path = parsed.path.casefold()

        if not re.search(
            r"\.(jpg|jpeg|png|webp|avif)(?:$|\?)",
            path,
        ):
            continue

        lower = url.casefold()

        if any(
            x in lower
            for x in [
                "logo",
                "favicon",
                "banner",
                "avatar",
                "sprite",
            ]
        ):
            continue

        if "perfume-social-cards" in lower:
            continue

        return url

    # Social card fallback.
    for raw in candidates:

        url = urljoin(
            base_url,
            raw.strip(),
        )

        parsed = urlparse(url)
        lower = url.casefold()

        if (
            parsed.scheme in {"http", "https"}
            and re.search(
                r"\.(jpg|jpeg|png|webp|avif)(?:$|\?)",
                parsed.path.casefold(),
            )
            and "perfume-social-cards" in lower
        ):
            return url

    return ""


# ============================================================
# IMAGE DOWNLOAD
# ============================================================

def image_extension(
    response: requests.Response,
    image_url: str,
) -> str:

    content_type = (
        response.headers
        .get("content-type", "")
        .split(";")[0]
        .strip()
        .casefold()
    )

    mapping = {
        "image/jpeg": ".jpg",
        "image/jpg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp",
        "image/avif": ".avif",
    }

    if content_type in mapping:
        return mapping[content_type]

    suffix = Path(
        urlparse(image_url).path
    ).suffix.casefold()

    if suffix in {".jpg", ".jpeg"}:
        return ".jpg"

    if suffix in {
        ".png",
        ".webp",
        ".avif",
    }:
        return suffix

    guessed = mimetypes.guess_extension(
        content_type
    )

    return (
        guessed
        if guessed in {
            ".jpg",
            ".png",
            ".webp",
            ".avif",
        }
        else ".jpg"
    )


def download_image(
    image_url: str,
    destination_stem: Path,
) -> Path:

    try:
        response = requests.get(
            image_url,
            headers={
                **HEADERS,
                "Referer": CURRENT_URL,
            },
            timeout=30,
            stream=True,
        )

    except requests.RequestException as exc:
        stop_error(
            f"Could not download the product image: {exc}"
        )

    if response.status_code != 200:
        stop_error(
            f"Product image returned HTTP "
            f"{response.status_code}."
        )

    content_type = (
        response.headers
        .get("content-type", "")
        .split(";")[0]
        .strip()
        .casefold()
    )

    if (
        content_type
        and not content_type.startswith("image/")
    ):
        stop_error(
            "The extracted product image URL "
            "did not return an image."
        )

    extension = image_extension(
        response,
        image_url,
    )

    destination = destination_stem.with_suffix(
        extension
    )

    with destination.open("wb") as handle:

        total = 0

        for chunk in response.iter_content(
            chunk_size=64 * 1024
        ):

            if not chunk:
                continue

            total += len(chunk)

            if total > 20 * 1024 * 1024:

                handle.close()

                destination.unlink(
                    missing_ok=True
                )

                stop_error(
                    "Product image is unexpectedly "
                    "larger than 20 MB."
                )

            handle.write(chunk)

    if (
        not destination.exists()
        or destination.stat().st_size < 1024
    ):

        destination.unlink(
            missing_ok=True
        )

        stop_error(
            "Downloaded product image is "
            "empty or invalid."
        )

    return destination


# ============================================================
# PRODUCT FILE HELPERS
# ============================================================

def load_json(path: Path) -> dict:

    if not path.exists():
        return {}

    try:
        return json.loads(
            path.read_text(
                encoding="utf-8"
            )
        )

    except json.JSONDecodeError as exc:
        stop_error(
            f"Invalid JSON in {path}: {exc}"
        )


def find_existing_product(
    name: str,
    brand: str,
) -> Path | None:

    target = normalize_identity(
        f"{brand}{name}"
    )

    if not PRODUCTS_DIR.exists():
        return None

    for folder in PRODUCTS_DIR.iterdir():

        if not folder.is_dir():
            continue

        product_file = folder / "product.json"

        if not product_file.exists():
            continue

        try:
            data = json.loads(
                product_file.read_text(
                    encoding="utf-8"
                )
            )

        except Exception:
            continue

        existing_name = str(
            data.get("name", "")
        )

        existing_brand = str(
            data.get("brand", "")
        )

        existing_identity = normalize_identity(
            f"{existing_brand}{existing_name}"
        )

        if existing_identity == target:
            return folder

        expected_slug = slugify(
            f"{brand}-{name}"
        )

        if (
            str(data.get("slug", ""))
            .casefold()
            == expected_slug
        ):
            return folder

        if (
            str(data.get("id", ""))
            .casefold()
            == expected_slug
        ):
            return folder

    return None


# ============================================================
# PRODUCT.JSON
# ============================================================

def update_product(
    folder: Path,
    metadata: dict,
    image_url: str,
) -> None:

    folder.mkdir(
        parents=True,
        exist_ok=True,
    )

    product_file = folder / "product.json"

    existing = load_json(product_file)

    # Backup existing product.json.
    if product_file.exists():

        backup = folder / "product.json.bak"

        shutil.copy2(
            product_file,
            backup,
        )

    slug = str(
        existing.get("slug")
        or folder.name
    )

    product_id = str(
        existing.get("id")
        or slug
    )

    merged = dict(existing)

    merged.setdefault(
        "id",
        product_id,
    )

    merged.setdefault(
        "slug",
        slug,
    )

    merged["name"] = metadata["name"]
    merged["brand"] = metadata["brand"]

    if metadata["gender"]:
        merged["gender"] = metadata["gender"]

    if metadata["fragranceFamily"]:
        merged["fragranceFamily"] = (
            metadata["fragranceFamily"]
        )

    if metadata["mainAccords"]:
        merged["mainAccords"] = (
            metadata["mainAccords"]
        )

    merged["fragranticaUrl"] = CURRENT_URL

    # Existing website images always win.
    if not merged.get("images") and image_url:
        merged["images"] = [image_url]

    product_file.write_text(
        json.dumps(
            merged,
            ensure_ascii=False,
            indent=2,
        ) + "\n",
        encoding="utf-8",
    )


# ============================================================
# PROCESS ONE PRODUCT
# ============================================================

def process(url: str) -> bool:

    global CURRENT_URL

    CURRENT_URL = url.strip()

    if not is_valid_fragrantica_url(
        CURRENT_URL
    ):
        stop_error(
            "Invalid Fragrantica perfume URL.\n"
            "Expected:\n"
            "https://www.fragrantica.com/perfume/..."
        )

    print("\n")
    print("=" * 48)
    print("Fetching exact Fragrantica page...")
    print("=" * 48)

    html, final_url = fetch_page(
        CURRENT_URL
    )

    # Never silently switch to another perfume.
    if not is_valid_fragrantica_url(
        final_url
    ):
        stop_error(
            "The supplied URL redirected away "
            "from a Fragrantica perfume page."
        )

    soup = BeautifulSoup(
        html,
        "html.parser",
    )

    name, brand = extract_name_brand(
        soup
    )

    family = extract_family(soup)
    accords = extract_accords(soup)
    gender = extract_gender(soup)

    image_url = extract_image_url(
        soup,
        final_url,
    )

    if not family:
        stop_error(
            "Could not reliably extract "
            "Fragrance Family.\n"
            "No product was created."
        )

    if not accords:
        stop_error(
            "Could not reliably extract "
            "Main Accords.\n"
            "No product was created."
        )

    if not image_url:
        stop_error(
            "Could not reliably extract "
            "the primary product image.\n"
            "No product was created."
        )

    print(f"Name: {name}")
    print(f"Brand: {brand}")
    print(
        f"Fragrance Family: {family}"
    )
    print(
        "Main Accords: "
        + ", ".join(accords)
    )
    print(
        f"Image URL: {image_url}"
    )

    existing_folder = find_existing_product(
        name,
        brand,
    )

    if existing_folder:

        folder = existing_folder

        print(
            "\nExisting product found:"
        )
        print(folder)

    else:

        folder = (
            PRODUCTS_DIR
            / slugify(
                f"{brand}-{name}"
            )
        )

        print(
            "\nCreating new product folder:"
        )
        print(folder)

    folder.mkdir(
        parents=True,
        exist_ok=True,
    )

    # Preserve all existing images.
    existing_image_files = []

    for pattern in [
        "*.jpg",
        "*.jpeg",
        "*.png",
        "*.webp",
        "*.avif",
    ]:
        existing_image_files.extend(
            folder.glob(pattern)
        )

    downloaded_image_url = ""

    if existing_image_files:

        print(
            f"Existing product images found "
            f"({len(existing_image_files)})."
        )

        print(
            "Preserving them; "
            "Fragrantica image will not replace them."
        )

    else:

        image_path = download_image(
            image_url,
            folder / "1",
        )

        downloaded_image_url = (
            "/"
            + image_path.relative_to(
                ROOT / "public"
            ).as_posix()
        )

        print(
            f"Downloaded image: {image_path}"
        )

    metadata = {
        "name": name,
        "brand": brand,
        "gender": gender,
        "fragranceFamily": family,
        "mainAccords": accords,
    }

    update_product(
        folder,
        metadata,
        downloaded_image_url,
    )

    print("\n")
    print("=" * 48)
    print(
        "PRODUCT CREATED / UPDATED SUCCESSFULLY"
    )
    print("=" * 48)
    print(f"Name: {name}")
    print(f"Brand: {brand}")
    print(
        f"Fragrance Family: {family}"
    )
    print(
        "Main Accords: "
        + ", ".join(accords)
    )
    print(
        f"Product Folder: {folder}"
    )
    print(
        f"Fragrantica URL: {CURRENT_URL}"
    )

    if downloaded_image_url:

        print(
            f"Image: {downloaded_image_url}"
        )

    elif existing_image_files:

        print(
            "Image: Existing website "
            "images preserved"
        )

    print("=" * 48)

    return True


# ============================================================
# INTERACTIVE MODE
# ============================================================

def interactive_mode() -> None:

    processed = 0

    print("\n")
    print("=" * 56)
    print("             SMELLS FROM HEAVEN")
    print("             FRAGRANTICA IMPORTER")
    print("=" * 56)
    print(
        "Paste an exact Fragrantica perfume URL."
    )
    print(
        "Type EXIT, Q, or QUIT to stop."
    )
    print("=" * 56)

    while True:

        try:

            raw = input(
                "\nFragrantica URL:\n> "
            ).strip()

        except (
            KeyboardInterrupt,
            EOFError,
        ):

            print("\n")
            print("=" * 48)
            print(
                "Fragrantica importer stopped."
            )
            print(
                f"Products processed this session: "
                f"{processed}"
            )
            print("=" * 48)

            return

        # Empty input.
        if not raw:

            print(
                "Please paste a Fragrantica "
                "perfume URL."
            )

            continue

        # Exit.
        if raw.casefold() in {
            "exit",
            "q",
            "quit",
        }:

            print("\n")
            print("=" * 48)
            print(
                "Fragrantica importer stopped."
            )
            print(
                f"Products processed this session: "
                f"{processed}"
            )
            print("=" * 48)

            return

        # Validate before processing.
        if not is_valid_fragrantica_url(
            raw
        ):

            print("\nInvalid Fragrantica URL.")
            print(
                "Expected:"
            )
            print(
                "https://www.fragrantica.com/"
                "perfume/..."
            )

            continue

        try:

            success = process(raw)

            if success:
                processed += 1

        except Exception as exc:

            print("\n")
            print("=" * 48)
            print("PRODUCT NOT CREATED")
            print("=" * 48)
            print(f"Reason: {exc}")
            print(
                "\nYou can paste another "
                "Fragrantica URL."
            )
            print("=" * 48)

            continue

        # Small pause between requests.
        time.sleep(1)


# ============================================================
# MAIN
# ============================================================

def main() -> None:

    parser = argparse.ArgumentParser(
        description=(
            "Add perfumes from exact "
            "Fragrantica URLs."
        )
    )

    parser.add_argument(
        "urls",
        nargs="*",
        help=(
            "Optional exact Fragrantica "
            "perfume URL(s). "
            "If omitted, interactive mode starts."
        ),
    )

    args = parser.parse_args()

    # --------------------------------------------------------
    # COMMAND-LINE MODE
    # --------------------------------------------------------

    if args.urls:

        for index, url in enumerate(
            args.urls
        ):

            if index:
                time.sleep(2)

            try:

                process(url)

            except Exception as exc:

                print("\n")
                print("=" * 48)
                print(
                    "PRODUCT NOT CREATED"
                )
                print("=" * 48)
                print(f"Reason: {exc}")
                print("=" * 48)

        return

    # --------------------------------------------------------
    # INTERACTIVE MODE
    # --------------------------------------------------------

    interactive_mode()


if __name__ == "__main__":
    main()
