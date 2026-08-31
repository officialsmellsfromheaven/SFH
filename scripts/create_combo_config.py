#!/usr/bin/env python3
"""Create/edit data-driven combo configuration for Smells From Heaven.

Run from frontend:
    python scripts/create_combo_config.py

Creates:
    config/combos.json

This script is independent of the Fragrantica importer.
It never changes product.json or UI files.
"""

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PRODUCTS = ROOT / "public" / "products"
CONFIG_DIR = ROOT / "config"
CONFIG = CONFIG_DIR / "combos.json"

DEFAULT = {
    "version": 1,
    "currency": "INR",
    "pricing": {
        "mode": "percentageBelowReference",
        "targetPercentage": None,
        "rounding": {"mode": "none", "value": None}
    },
    "combos": []
}


def read_json(path, default):
    if not path.exists():
        return default
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as e:
        print(f"Invalid JSON: {path}\n{e}")
        sys.exit(1)


def products():
    result = []
    if not PRODUCTS.exists():
        return result
    for folder in sorted(PRODUCTS.iterdir()):
        f = folder / "product.json"
        if not folder.is_dir() or not f.exists():
            continue
        data = read_json(f, {})
        pid = str(data.get("id") or data.get("slug") or folder.name).strip()
        if pid:
            result.append({
                "id": pid,
                "name": str(data.get("name", "")).strip(),
                "brand": str(data.get("brand", "")).strip()
            })
    return result


def save(data):
    CONFIG_DIR.mkdir(parents=True, exist_ok=True)
    CONFIG.write_text(
        json.dumps(data, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8"
    )


def ask(text, default=""):
    value = input(f"{text}" + (f" [{default}]" if default else "") + ": ").strip()
    return value or default


def integer(text, minimum=1):
    while True:
        try:
            n = int(input(f"{text}: ").strip())
            if n >= minimum:
                return n
        except ValueError:
            pass
        print(f"Enter an integer >= {minimum}.")


def number_or_none(text):
    while True:
        value = input(f"{text} (blank = configure later): ").strip()
        if not value:
            return None
        try:
            n = float(value)
            if n >= 0:
                return n
        except ValueError:
            pass
        print("Enter a valid non-negative number.")


def create_combo(items):
    print("\n" + "=" * 56)
    print("CREATE DYNAMIC PERFUME COMBO")
    print("=" * 56)

    combo_id = ask("Combo ID")
    name = ask("Combo name")
    size = integer("Bottle size (ml)")
    quantity = integer("Number of bottles")
    badge = ask("Badge", "")
    description = ask("Description", "")
    order = integer("Display order", 0)

    print("\nEligibility:")
    print("1. All active products (new perfumes automatically included)")
    print("2. Selected products only")
    choice = input("Choose [1/2]: ").strip()

    if choice == "2":
        print("\nAvailable products:")
        for i, p in enumerate(items, 1):
            label = f"{p['brand']} — {p['name']}" if p["brand"] else p["name"]
            print(f"{i}. {label} [{p['id']}]")
        raw = input("Product numbers, comma separated: ").strip()
        ids = []
        for x in raw.split(","):
            try:
                i = int(x.strip()) - 1
                if 0 <= i < len(items):
                    ids.append(items[i]["id"])
            except ValueError:
                pass
        ids = list(dict.fromkeys(ids))
        eligibility = {"mode": "selectedProducts", "productIds": ids}
    else:
        eligibility = {"mode": "allActiveProducts", "productIds": []}

    pricing_mode = ask("Pricing mode", "percentageBelowReference")
    target = number_or_none("Target percentage below reference")
    reference_mode = ask(
        "Reference pricing basis",
        "sumOfSelectedProductPrices"
    )
    rounding_mode = ask("Rounding mode", "none")
    rounding_value = None if rounding_mode == "none" else integer("Rounding value")

    return {
        "id": combo_id,
        "name": name,
        "bottleSize": size,
        "quantity": quantity,
        "eligibility": eligibility,
        "referencePricing": {"mode": reference_mode},
        "pricingRule": {
            "mode": pricing_mode,
            "targetPercentage": target
        },
        "rounding": {
            "mode": rounding_mode,
            "value": rounding_value
        },
        "badge": badge,
        "description": description,
        "active": True,
        "sortOrder": order
    }


def main():
    print("=" * 56)
    print("SMELLS FROM HEAVEN — DYNAMIC COMBO CONFIG")
    print("=" * 56)
    print("Independent of the Fragrantica importer.")
    print("No product.json or UI files are modified.")

    data = read_json(CONFIG, DEFAULT)
    data.setdefault("combos", [])
    items = products()

    print(f"\nFilesystem products detected: {len(items)}")

    while True:
        print("\n1. Create / update combo")
        print("2. List combos")
        print("3. Delete combo")
        print("4. Exit")
        choice = input("> ").strip()

        if choice == "1":
            combo = create_combo(items)
            data["combos"] = [
                x for x in data["combos"]
                if x.get("id") != combo["id"]
            ]
            data["combos"].append(combo)
            save(data)
            print(f"\nSaved: {CONFIG}")

        elif choice == "2":
            if not data["combos"]:
                print("No combos configured.")
            for c in data["combos"]:
                print(
                    f"- {c.get('name')} [{c.get('id')}] "
                    f"({c.get('quantity')} x {c.get('bottleSize')}ml)"
                )

        elif choice == "3":
            combos = data["combos"]
            if not combos:
                print("No combos configured.")
                continue
            for i, c in enumerate(combos, 1):
                print(f"{i}. {c.get('name')} [{c.get('id')}]")
            try:
                i = int(input("Number: ").strip()) - 1
                removed = combos.pop(i)
                save(data)
                print(f"Deleted: {removed.get('name')}")
            except (ValueError, IndexError):
                print("Invalid selection.")

        elif choice == "4":
            print("Combo configuration stopped.")
            return
        else:
            print("Choose 1, 2, 3 or 4.")


if __name__ == "__main__":
    main()
