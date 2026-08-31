from __future__ import annotations

import argparse
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROJECT_ROOT = ROOT.parent
REPORT = ROOT / "order-invoice-system-report.md"

EXTENSIONS = {".ts", ".tsx", ".js", ".jsx", ".py", ".json", ".css", ".md"}
IGNORE = {"node_modules", ".next", "dist", "build", ".git"}

KEYWORDS = {
    "checkout": ["checkout", "customer", "address", "pincode", "phone", "email"],
    "cart": ["usecartstore", "cartitem", "addcomboitem", "additem"],
    "combo": ["combobuilder", "build your", "combo"],
    "whatsapp": ["whatsapp", "wa.me", "order on whatsapp"],
    "invoice": ["invoice", "pdf", "orders.csv", "order.json"],
    "backend": ["fastapi", "uvicorn", "express", "api"],
}

def all_files():
    for base in (ROOT, PROJECT_ROOT / "backend"):
        if not base.exists():
            continue
        for p in base.rglob("*"):
            if p.is_file() and p.suffix.lower() in EXTENSIONS:
                if not any(part in IGNORE for part in p.parts):
                    yield p

def read_text(p):
    try:
        return p.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return ""

def find_candidates():
    results = {k: [] for k in KEYWORDS}
    for p in all_files():
        low = read_text(p).lower()
        rel = str(p.relative_to(PROJECT_ROOT))
        for category, words in KEYWORDS.items():
            if any(word.lower() in low for word in words):
                results[category].append(rel)
    for k in results:
        results[k] = list(dict.fromkeys(results[k]))
    return results

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true",
                        help="Reserved; this version never modifies application files.")
    parser.parse_args()

    results = find_candidates()

    lines = [
        "# Smells From Heaven — Order & Invoice System Scan",
        "",
        f"Generated: {datetime.now():%Y-%m-%d %H:%M:%S}",
        "",
        "## SAFE SCAN ONLY",
        "",
        "No existing application files were modified.",
        "",
    ]

    for category in ("checkout", "cart", "combo", "whatsapp", "invoice", "backend"):
        lines += [f"## {category.title()} candidates", ""]
        if results[category]:
            lines += [f"- `{x}`" for x in results[category]]
        else:
            lines.append("- None detected")
        lines.append("")

    lines += [
        "## Required final behaviour",
        "",
        "1. Checkout collects Name, Mobile, Email, Address, City, State and Pincode.",
        "2. Product and Combo orders use the same order pipeline.",
        "3. Create one immutable invoice number per order.",
        "4. Invoice format: SFH-DDMMYYYY-XX.",
        "5. XX is a global lifetime sequence and never resets daily.",
        "6. Save order.json.",
        "7. Append orders.csv.",
        "8. Generate invoice.pdf.",
        "9. Generate whatsapp-message.txt.",
        "10. Open WhatsApp only after the order is safely saved.",
        "11. Prevent duplicate orders from repeated clicks.",
        "12. Use existing dynamic pricing; never hard-code prices.",
        "",
    ]

    REPORT.write_text("\n".join(lines), encoding="utf-8")
    print("Scan complete.")
    print(f"Report created: {REPORT}")
    print("No application files were modified.")

if __name__ == "__main__":
    main()
