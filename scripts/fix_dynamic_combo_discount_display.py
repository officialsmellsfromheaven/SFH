from pathlib import Path
import shutil
from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]
FILE = ROOT / "src" / "components" / "combo" / "ComboBuilder.tsx"

def backup(p):
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    b = p.with_name(f"{p.name}.combo-price-display-backup-{stamp}")
    shutil.copy2(p, b)
    return b

if not FILE.exists():
    raise SystemExit(f"ERROR: {FILE} not found")

src = FILE.read_text(encoding="utf-8")

old = """<div className="rounded-3xl border border-stone-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone-600">Estimated pricing</span>
                  <span className="text-lg font-semibold text-stone-900">{formatPrice(metrics.comboPrice)}</span>
                </div>
                <div className="mt-3 text-sm text-stone-600">
                  <span className="font-medium text-stone-800">{combo.badge || "Combo offer"}</span>
                  <span className="mx-2">•</span>
                  {metrics.targetPercentage}% off reference price
                </div>
              </div>"""

new = """<div className="rounded-3xl border border-stone-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone-600">Combo price</span>
                  <div className="flex items-baseline gap-2">
                    {metrics.referencePrice > metrics.comboPrice && (
                      <span className="text-sm font-medium text-stone-400 line-through">
                        {formatPrice(metrics.referencePrice)}
                      </span>
                    )}
                    <span className="text-xl font-bold text-stone-900">
                      {formatPrice(metrics.comboPrice)}
                    </span>
                  </div>
                </div>

                {metrics.referencePrice > metrics.comboPrice && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                      Save {formatPrice(metrics.referencePrice - metrics.comboPrice)}
                    </span>
                    <span className="text-xs font-semibold text-green-700">
                      {Math.round(((metrics.referencePrice - metrics.comboPrice) / metrics.referencePrice) * 100)}% OFF
                    </span>
                  </div>
                )}

                <div className="mt-3 text-sm text-stone-600">
                  <span className="font-medium text-stone-800">{combo.badge || "Combo offer"}</span>
                  <span className="mx-2">•</span>
                  {metrics.targetPercentage}% below reference price
                </div>
              </div>"""

if old not in src:
    print("ERROR: Expected Estimated pricing block was not found.")
    print("No files changed.")
    raise SystemExit(2)

backup_path = backup(FILE)
FILE.write_text(src.replace(old, new, 1), encoding="utf-8")

print("=" * 64)
print("SMELLS FROM HEAVEN — DYNAMIC COMBO DISCOUNT DISPLAY")
print("=" * 64)
print(f"Updated: {FILE}")
print(f"Backup:  {backup_path}")
print()
print("Added:")
print("- Reference price with strikethrough")
print("- Current combo price")
print("- Dynamic Save ₹X")
print("- Dynamic X% OFF")
print("- No hardcoded prices")
print()
print("Run:")
print("  npm run build")
print("Then hard refresh: Ctrl + Shift + R")
