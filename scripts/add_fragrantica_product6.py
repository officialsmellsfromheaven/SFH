#!/usr/bin/env python3
"""
Smells From Heaven — Fragrantica Product Importer

Interactive usage:
    python scripts\add_fragrantica_product.py

Paste an exact Fragrantica perfume URL one by one.
Type EXIT, Q, or QUIT to stop.

WHAT THIS VERSION IMPORTS
- Perfume Name
- Brand
- Gender
- Fragrance Family
- Main Accords
- Top Notes
- Middle / Heart Notes
- Base Notes
- Performance data — only when available on the page
- When-to-Wear / Season data — only when structured/readable data is available
- Product Image
- Original Fragrantica URL

SAFE BEHAVIOUR
- Fetches ONLY the exact Fragrantica URL supplied.
- Never performs search-engine discovery.
- Never silently switches to another perfume.
- Existing SFH price, sizes, IDs, slugs, inventory, collections and local images are preserved.
- Existing local product images are never replaced by the Fragrantica image.
- Existing product.json is backed up before update.
- Missing source data is never invented.
- If required fragrance data is missing, the product is not created/updated.
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
# FRAGRANCE METADATA
# ============================================================

def _normalise_note(value: str) -> str:
    value = clean_text(value)
    value = re.sub(r"^[•·|:]+", "", value).strip()
    value = re.sub(r"\s+", " ", value)
    return value.strip(" .,:;|-–—")


def _unique_strings(values: list[str]) -> list[str]:
    result: list[str] = []
    seen: set[str] = set()

    for value in values:
        value = _normalise_note(value)
        key = normalize_identity(value)

        if not key or key in seen:
            continue

        seen.add(key)
        result.append(value)

    return result


def _split_list(value: str) -> list[str]:
    value = clean_text(value)
    if not value:
        return []

    value = re.sub(
        r"^(?:top|middle|heart|base)\s+notes?\s*(?:are|:)\s*",
        "",
        value,
        flags=re.I,
    )

    # Fragrantica prose normally uses commas and "and".
    value = re.sub(r"\s+\band\b\s+", ", ", value, flags=re.I)
    parts = re.split(r"\s*,\s*|[•·|]", value)

    return _unique_strings(parts)


def _extract_heading_section_links(
    soup: BeautifulSoup,
    heading_patterns: list[str],
) -> list[str]:
    """
    Find a note heading and collect short links/elements belonging to that
    section without spilling into the next note section.
    """
    heading_regex = re.compile(
        r"^(?:" + "|".join(heading_patterns) + r")$",
        re.I,
    )

    heading = None

    for node in soup.find_all(
        ["h1", "h2", "h3", "h4", "h5", "h6", "strong", "b", "div", "span"]
    ):
        text = clean_text(node.get_text(" ", strip=True))
        if heading_regex.fullmatch(text):
            heading = node
            break

    if not heading:
        return []

    results: list[str] = []

    # First try the heading's parent/container. This is usually the most
    # stable structure on Fragrantica.
    containers = []
    current = heading
    for _ in range(5):
        current = current.parent if current else None
        if current:
            containers.append(current)

    stop_heading = re.compile(
        r"^(?:top|middle|heart|base)\s+notes?$",
        re.I,
    )

    for container in containers:
        direct_nodes = list(container.find_all(["a", "span"], recursive=True))

        for node in direct_nodes:
            text = _normalise_note(node.get_text(" ", strip=True))
            if not text or len(text) > 80:
                continue

            # Skip UI text and obvious non-note labels.
            if re.search(
                r"^(top|middle|heart|base)\s+notes?$|"
                r"fragrance composition|perfume pyramid|"
                r"main accords|read more|show more|"
                r"search by notes|search by accords$",
                text,
                re.I,
            ):
                continue

            href = str(node.get("href", ""))
            # Note links on Fragrantica point to /notes/ or contain note ids.
            # Plain spans are accepted only when they are short.
            if href and (
                "/notes/" in href.casefold()
                or "note" in href.casefold()
            ):
                results.append(text)

        if results:
            return _unique_strings(results)

        # Fallback: inspect text between this heading and the next note
        # heading in document order.
        try:
            cursor = heading
            collected: list[str] = []

            for _ in range(80):
                cursor = cursor.find_next()
                if not cursor:
                    break

                if cursor.name in {
                    "h1", "h2", "h3", "h4", "h5", "h6",
                    "strong", "b"
                }:
                    marker = clean_text(cursor.get_text(" ", strip=True))
                    if stop_heading.fullmatch(marker):
                        break

                if cursor.name in {"a", "span"}:
                    item = _normalise_note(
                        cursor.get_text(" ", strip=True)
                    )
                    if 1 < len(item) <= 80:
                        collected.append(item)

            collected = _unique_strings(collected)

            if collected:
                return collected
        except Exception:
            pass

    return []


def extract_note_pyramid(
    soup: BeautifulSoup,
) -> tuple[list[str], list[str], list[str]]:
    """
    Extract Top / Middle / Base Notes.

    Primary source:
      - explicit Fragrantica note headings and note links

    Fallback:
      - Fragrantica's description sentence:
        "Top notes are ...; middle notes are ...; base notes are ..."
    """
    # First use the standard Fragrantica description because it is the most
    # stable representation of the exact published note pyramid.
    candidates: list[str] = []

    description = extract_description(soup)
    if description:
        candidates.append(description)

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
        paragraph_text = clean_text(
            paragraph.get_text(" ", strip=True)
        )
        if (
            re.search(r"\btop\s+notes?\s+are\b", paragraph_text, re.I)
            and re.search(r"\bbase\s+notes?\s+are\b", paragraph_text, re.I)
        ):
            candidates.append(paragraph_text)

    prose_pattern = re.compile(
        r"top\s+notes?\s+(?:are|:)\s*(.+?);"
        r"\s*(?:middle|heart)\s+notes?\s+(?:are|:)\s*(.+?);"
        r"\s*base\s+notes?\s+(?:are|:)\s*(.+?)(?:\.|$)",
        re.I,
    )

    for text_value in candidates:
        match = prose_pattern.search(text_value)
        if not match:
            continue

        parsed_top = _split_list(match.group(1))
        parsed_heart = _split_list(match.group(2))
        parsed_base = _split_list(match.group(3))

        if parsed_top and parsed_heart and parsed_base:
            return parsed_top, parsed_heart, parsed_base

    # DOM fallback for pages where the prose description is absent.
    top = _extract_heading_section_links(
        soup,
        [r"top\s+notes?"],
    )
    heart = _extract_heading_section_links(
        soup,
        [r"middle\s+notes?", r"heart\s+notes?"],
    )
    base = _extract_heading_section_links(
        soup,
        [r"base\s+notes?"],
    )

    return top, heart, base


def extract_description(soup: BeautifulSoup) -> str:
    product = find_json_ld_product(soup)

    json_description = clean_text(
        str(product.get("description", ""))
    )
    if json_description:
        return json_description

    value = first_meta(
        soup,
        ("name", "description"),
        ("property", "og:description"),
        ("name", "twitter:description"),
    )

    if value:
        return value

    # Prefer the paragraph that contains the standard Fragrantica perfume
    # description instead of arbitrary review text.
    for paragraph in soup.find_all("p"):
        text = clean_text(paragraph.get_text(" ", strip=True))

        if (
            len(text) >= 80
            and re.search(r"\bwas launched in\b", text, re.I)
            and re.search(r"\bnotes?\s+(?:are|is)\b", text, re.I)
        ):
            return text

    return ""


def extract_family(soup: BeautifulSoup) -> str:
    """
    Extract the olfactive/fragrance family from the supplied page.
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

    description = extract_description(soup)

    patterns = [
        r"\bis\s+(?:an?|the)\s+(.+?)\s+fragrance\s+for\s+",
        r"\bis\s+(?:an?|the)\s+(.+?)\s+fragrance(?:\.|,|\s)",
    ]

    for pattern in patterns:
        match = re.search(pattern, description, re.I)
        if match:
            value = clean_text(match.group(1))
            if 2 <= len(value) <= 100:
                return value

    for selector in [
        '[class*="fragrance-family"]',
        '[id*="fragrance-family"]',
    ]:
        node = soup.select_one(selector)
        if node:
            value = clean_text(node.get_text(" ", strip=True))
            if value and len(value) < 160:
                return value

    return ""


def extract_accords(soup: BeautifulSoup) -> list[str]:
    """
    Extract ONLY Main Accord labels, preserving Fragrantica page order.
    """
    values: list[str] = []

    known_accords = {
        "woody", "oud", "warm spicy", "aromatic", "vanilla", "balsamic",
        "fresh spicy", "amber", "powdery", "sweet", "citrus", "fruity",
        "floral", "aquatic", "green", "earthy", "musky", "rose",
        "white floral", "yellow floral", "iris", "violet", "herbal",
        "tobacco", "leather", "smoky", "marine", "salty", "nutty", "coffee",
        "chocolate", "caramel", "beeswax", "cannabis", "mineral", "ozonic",
        "metallic", "savory", "soapy", "animalic", "aldehydic", "lavender",
        "mossy", "conifer", "coconut", "lactonic", "bitter", "camphor",
        "tuberose", "tropical", "fruity", "fresh", "ozonic", "metallic",
        "cinnamon", "coffee", "cocoa", "nutty", "citrus", "marine",
    }

    def valid(value: str) -> bool:
        value = clean_text(value)
        if not value:
            return False

        lower = value.casefold()
        return (
            lower in known_accords
            or lower.replace("-", " ") in known_accords
        )

    heading = None

    for node in soup.find_all(
        [
            "h1", "h2", "h3", "h4", "h5", "h6",
            "strong", "b", "div", "span"
        ]
    ):
        text_value = clean_text(node.get_text(" ", strip=True))
        if re.fullmatch(r"main\s+accords?", text_value, re.I):
            heading = node
            break

    if not heading:
        return []

    containers = []
    current = heading
    for _ in range(6):
        current = current.parent if current else None
        if current:
            containers.append(current)

    for container in containers:
        # Strongest signal: explicit accord classes/data attributes.
        accord_nodes = container.select(
            '[class*="accord"], '
            '[class*="accord-name"], '
            '[class*="accordName"], '
            '[data-accord], '
            '[data-accord-name]'
        )

        for node in accord_nodes:
            candidates = [
                str(node.get(attr))
                for attr in [
                    "data-accord",
                    "data-accord-name",
                    "title",
                    "aria-label",
                ]
                if node.get(attr)
            ]
            candidates.append(
                node.get_text(" ", strip=True)
            )

            for candidate in candidates:
                if valid(candidate):
                    values.append(clean_text(candidate))

        if values:
            break

    if not values:
        for container in containers:
            for node in container.find_all(["a", "span", "div"]):
                value = clean_text(
                    node.get_text(" ", strip=True)
                )

                if len(value) > 40:
                    continue

                if valid(value):
                    values.append(value)

            if values:
                break

    return _unique_strings(values)[:20]


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

    description = extract_description(soup)

    match = re.search(
        r"(?:for|gender)\s*[:\-]?\s*"
        r"(women and men|men and women|women|men|unisex)",
        description,
        re.I,
    )

    if match:
        return clean_text(match.group(1))

    text = clean_text(
        soup.get_text(" ", strip=True)
    )

    match = re.search(
        r"(?:for|gender)\s*[:\-]?\s*"
        r"(women and men|men and women|women|men|unisex)",
        text,
        re.I,
    )

    return clean_text(match.group(1)) if match else ""


def extract_launch_year(soup: BeautifulSoup) -> int | None:
    description = extract_description(soup)

    patterns = [
        r"\b(?:was\s+)?launched\s+in\s+(19\d{2}|20\d{2})\b",
        r"\breleased\s+in\s+(19\d{2}|20\d{2})\b",
        r"\b(?:year|release\s+year)\s*[:\-]\s*(19\d{2}|20\d{2})\b",
    ]

    for pattern in patterns:
        match = re.search(pattern, description, re.I)
        if match:
            return int(match.group(1))

    # Page title fallback.
    title = first_meta(
        soup,
        ("property", "og:title"),
        ("name", "twitter:title"),
    )

    match = re.search(r"\b(19\d{2}|20\d{2})\b", title)
    return int(match.group(1)) if match else None


def extract_perfumer(soup: BeautifulSoup) -> list[str]:
    """
    Fragrantica commonly uses:
    "The nose behind this fragrance is X."
    Some pages publish multiple perfumers.
    """
    description = extract_description(soup)

    patterns = [
        r"the\s+nose\s+behind\s+this\s+fragrance\s+is\s+(.+?)(?:\.|;|$)",
        r"the\s+perfumer(?:s)?\s+(?:behind|of)\s+this\s+fragrance\s+(?:is|are)\s+(.+?)(?:\.|;|$)",
        r"perfumer(?:s)?\s*[:\-]\s*(.+?)(?:\.|;|$)",
    ]

    for pattern in patterns:
        match = re.search(pattern, description, re.I)
        if match:
            names = re.split(
                r"\s*,\s*|\s+\band\b\s+|\s*&\s*",
                match.group(1),
                flags=re.I,
            )
            return _unique_strings(names)

    # Search page text, but only around a perfumer/nose label.
    text = clean_text(soup.get_text(" ", strip=True))

    for pattern in patterns:
        match = re.search(pattern, text, re.I)
        if match:
            names = re.split(
                r"\s*,\s*|\s+\band\b\s+|\s*&\s*",
                match.group(1),
                flags=re.I,
            )
            return _unique_strings(names)

    return []


def extract_rating_and_counts(
    soup: BeautifulSoup,
) -> tuple[float | None, int | None, int | None]:
    """
    Returns:
      rating, rating_votes, review_count

    Fragrantica exposes rating as:
      "Perfume rating 4.07 out of 5 with 28,416 votes"

    Review count can appear as:
      "Reviews (4.4K)"
    """
    text = clean_text(soup.get_text(" ", strip=True))

    rating: float | None = None
    rating_votes: int | None = None
    review_count: int | None = None

    rating_match = re.search(
        r"perfume\s+rating\s+([0-5](?:\.\d+)?)\s+out\s+of\s+5"
        r"\s+with\s+([\d,]+)\s+votes",
        text,
        re.I,
    )

    if rating_match:
        rating = float(rating_match.group(1))
        rating_votes = int(
            rating_match.group(2).replace(",", "")
        )

    # Review count is not always a plain integer. Handle K/M suffixes.
    review_match = re.search(
        r"reviews?\s*\(\s*([\d,.]+)\s*([km])?\s*\)",
        text,
        re.I,
    )

    if review_match:
        raw = float(review_match.group(1).replace(",", ""))
        suffix = (review_match.group(2) or "").casefold()

        if suffix == "k":
            raw *= 1000
        elif suffix == "m":
            raw *= 1_000_000

        review_count = int(round(raw))

    return rating, rating_votes, review_count


def _extract_near_label_value(
    soup: BeautifulSoup,
    labels: list[str],
) -> str:
    regex = re.compile(
        r"^(?:" + "|".join(labels) + r")$",
        re.I,
    )

    for node in soup.find_all(
        ["dt", "th", "strong", "b", "span", "div"]
    ):
        label = clean_text(node.get_text(" ", strip=True))

        if not regex.fullmatch(label):
            continue

        candidates = [
            node.find_next_sibling(),
            node.parent.find_next_sibling() if node.parent else None,
        ]

        for candidate in candidates:
            if not candidate:
                continue

            value = clean_text(
                candidate.get_text(" ", strip=True)
            )

            if value and not regex.fullmatch(value):
                return value

        # Attribute-based value fallback.
        for attr in [
            "data-value",
            "data-rating",
            "aria-label",
            "title",
        ]:
            raw = node.get(attr)
            if raw:
                value = clean_text(str(raw))
                if value and not regex.fullmatch(value):
                    return value

    return ""


def extract_performance(soup: BeautifulSoup) -> dict:
    """
    Capture performance information only when Fragrantica exposes it as
    readable text/attributes. No invented scores are generated.
    """
    result: dict[str, str] = {}

    longevity = _extract_near_label_value(
        soup,
        [r"longevity", r"how long does it last"],
    )
    sillage = _extract_near_label_value(
        soup,
        [r"sillage", r"projection"],
    )
    concentration = _extract_near_label_value(
        soup,
        [r"concentration"],
    )

    if longevity:
        result["longevity"] = longevity
    if sillage:
        result["sillage"] = sillage
    if concentration:
        result["concentration"] = concentration

    return result


def _extract_score(
    soup: BeautifulSoup,
    labels: list[str],
) -> int | None:
    """
    Best-effort extraction for numeric When-To-Wear scores when exposed
    in aria/data attributes. Values are normalized to 0-100.
    """
    regex = re.compile(
        r"(?:" + "|".join(labels) + r")",
        re.I,
    )

    for node in soup.find_all(
        ["div", "span", "a", "li", "button"]
    ):
        haystack = " ".join(
            clean_text(str(node.get(attr, "")))
            for attr in ["aria-label", "title", "data-value", "data-percent"]
        )

        if not regex.search(haystack):
            continue

        match = re.search(r"(\d{1,3})(?:\s*%|\b)", haystack)
        if match:
            value = int(match.group(1))
            if 0 <= value <= 100:
                return value

    return None


def extract_when_to_wear(soup: BeautifulSoup) -> dict:
    result: dict[str, object] = {}

    day = _extract_score(soup, [r"\bday\b"])
    night = _extract_score(soup, [r"\bnight\b"])
    winter = _extract_score(soup, [r"\bwinter\b"])
    spring = _extract_score(soup, [r"\bspring\b"])
    summer = _extract_score(soup, [r"\bsummer\b"])
    autumn = _extract_score(soup, [r"\bautumn\b", r"\bfall\b"])

    if day is not None or night is not None:
        result["dayNight"] = {
            "day": day if day is not None else 0,
            "night": night if night is not None else 0,
        }

    season_scores = {
        "winter": winter,
        "spring": spring,
        "summer": summer,
        "autumn": autumn,
    }

    if any(value is not None for value in season_scores.values()):
        result["seasons"] = {
            key: value if value is not None else 0
            for key, value in season_scores.items()
        }

    return result


# ============================================================
# IMAGE
# ============================================================

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
    folder.mkdir(parents=True, exist_ok=True)

    product_file = folder / "product.json"
    existing = load_json(product_file)

    if product_file.exists():
        shutil.copy2(product_file, folder / "product.json.bak")

    slug = str(existing.get("slug") or folder.name)
    product_id = str(existing.get("id") or slug)

    merged = dict(existing)
    merged.setdefault("id", product_id)
    merged.setdefault("slug", slug)

    # Only the requested Fragrantica product fields.
    merged["name"] = metadata["name"]
    merged["brand"] = metadata["brand"]

    for field in ["gender", "fragranceFamily"]:
        value = metadata.get(field)
        if value not in ("", None, []):
            merged[field] = value

    for field in [
        "topNotes",
        "heartNotes",
        "baseNotes",
        "mainAccordsList",
    ]:
        value = metadata.get(field)
        if isinstance(value, list) and value:
            merged[field] = value

    top = metadata.get("topNotes") or []
    heart = metadata.get("heartNotes") or []
    base = metadata.get("baseNotes") or []

    if top or heart or base:
        merged["notes"] = {
            "top": top,
            "heart": heart,
            "base": base,
        }

    # Optional Performance / When-to-Wear / Season data.
    fragrantica_data = {"url": CURRENT_URL}

    if metadata.get("performance"):
        fragrantica_data["performance"] = metadata["performance"]

    if metadata.get("whenToWear"):
        fragrantica_data["whenToWear"] = metadata["whenToWear"]

    merged["fragrantica"] = fragrantica_data
    merged["fragranticaUrl"] = CURRENT_URL

    # For a new product only, derive the basic SFH category.
    if not merged.get("category") and metadata.get("gender"):
        gender_value = str(metadata["gender"]).casefold()
        if "unisex" in gender_value:
            merged["category"] = "unisex"
        elif "women" in gender_value and "men" in gender_value:
            merged["category"] = "unisex"
        elif "women" in gender_value:
            merged["category"] = "women"
        elif "men" in gender_value:
            merged["category"] = "men"

    # Existing website images always win.
    if not merged.get("images") and image_url:
        merged["images"] = [image_url]

    product_file.write_text(
        json.dumps(merged, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


# ============================================================
# PROCESS ONE PRODUCT
# ============================================================

def process(url: str) -> bool:
    global CURRENT_URL

    CURRENT_URL = url.strip()

    if not is_valid_fragrantica_url(CURRENT_URL):
        stop_error(
            "Invalid Fragrantica perfume URL.\n"
            "Expected:\n"
            "https://www.fragrantica.com/perfume/..."
        )

    print("\n")
    print("=" * 64)
    print("Fetching exact Fragrantica page...")
    print("=" * 64)

    html, final_url = fetch_page(CURRENT_URL)

    # Never silently switch to another perfume.
    if not is_valid_fragrantica_url(final_url):
        stop_error(
            "The supplied URL redirected away "
            "from a Fragrantica perfume page."
        )

    soup = BeautifulSoup(
        html,
        "html.parser",
    )

    name, brand = extract_name_brand(soup)

    family = extract_family(soup)
    accords = extract_accords(soup)
    gender = extract_gender(soup)

    top_notes, heart_notes, base_notes = extract_note_pyramid(soup)

    performance = extract_performance(soup)
    when_to_wear = extract_when_to_wear(soup)
    image_url = extract_image_url(
        soup,
        final_url,
    )

    # --------------------------------------------------------
    # Required source data.
    # --------------------------------------------------------
    if not family:
        stop_error(
            "Could not reliably extract Fragrance Family.\n"
            "No product was created."
        )

    if not accords:
        stop_error(
            "Could not reliably extract Main Accords.\n"
            "No product was created."
        )

    if not top_notes or not heart_notes or not base_notes:
        stop_error(
            "Could not reliably extract the complete "
            "Top / Middle / Base note pyramid.\n"
            "No product was created."
        )

    if not image_url:
        stop_error(
            "Could not reliably extract the primary product image.\n"
            "No product was created."
        )

    # --------------------------------------------------------
    # Console preview — useful for checking exactly what was
    # pulled before looking at the website.
    # --------------------------------------------------------
    print(f"Perfume Name: {name}")
    print(f"Brand: {brand}")
    print(f"Gender: {gender or 'Not published'}")
    print(f"Fragrance Family: {family}")
    print("Main Accords: " + ", ".join(accords))
    print("Top Notes: " + ", ".join(top_notes))
    print("Middle / Heart Notes: " + ", ".join(heart_notes))
    print("Base Notes: " + ", ".join(base_notes))
    print(
        "Performance: "
        + (
            json.dumps(performance, ensure_ascii=False)
            if performance
            else "Not published in readable form"
        )
    )
    print(
        "When To Wear / Season: "
        + (
            json.dumps(when_to_wear, ensure_ascii=False)
            if when_to_wear
            else "Not published in readable/structured form"
        )
    )
    print(f"Image URL: {image_url}")

    # --------------------------------------------------------
    # Locate/create the SFH product folder.
    # --------------------------------------------------------
    existing_folder = find_existing_product(
        name,
        brand,
    )

    if existing_folder:
        folder = existing_folder
        print("\nExisting product found:")
        print(folder)
    else:
        folder = (
            PRODUCTS_DIR
            / slugify(
                f"{brand}-{name}"
            )
        )

        print("\nCreating new product folder:")
        print(folder)

    folder.mkdir(
        parents=True,
        exist_ok=True,
    )

    # --------------------------------------------------------
    # Preserve all existing local images.
    # --------------------------------------------------------
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
        "mainAccordsList": accords,
        "topNotes": top_notes,
        "heartNotes": heart_notes,
        "baseNotes": base_notes,
        "performance": performance,
        "whenToWear": when_to_wear,
    }

    update_product(
        folder,
        metadata,
        downloaded_image_url,
    )

    print("\n")
    print("=" * 64)
    print("PRODUCT CREATED / UPDATED SUCCESSFULLY")
    print("=" * 64)
    print(f"Perfume Name: {name}")
    print(f"Brand: {brand}")
    print(f"Gender: {gender or 'Not published'}")
    print(f"Fragrance Family: {family}")
    print("Main Accords: " + ", ".join(accords))
    print("Top Notes: " + ", ".join(top_notes))
    print("Middle / Heart Notes: " + ", ".join(heart_notes))
    print("Base Notes: " + ", ".join(base_notes))
    print("=" * 64)

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
