import { formatPrice } from "@/lib/utils";
import type { ComboDefinition } from "@/lib/combo/combo-config";
import type { ComboPricingMetrics } from "@/lib/combo/combo-pricing";

type ComboSummaryProps = {
  combo: ComboDefinition;
  metrics: ComboPricingMetrics;
  selectedCount: number;
  requiredCount: number;
  complete: boolean;
};

export default function ComboSummary({ combo, metrics, selectedCount, requiredCount, complete }: ComboSummaryProps) {
  return (
    <div className="rounded-3xl border border-stone-200 bg-stone-50 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm uppercase tracking-[0.14em] text-stone-500">Combo summary</p>
        <span className="rounded-full bg-[#eef6ff] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#06c]">
          {complete ? "Combo Ready" : `${selectedCount} selected`}
        </span>
      </div>

      <div className="mt-4 space-y-3 text-sm text-stone-700">
        <div className="flex items-center justify-between">
          <span>Reference price</span>
          <span className="font-semibold text-stone-900">{formatPrice(metrics.referencePrice)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Discount</span>
          <span className="font-semibold text-[#0a7a40]">-{formatPrice(metrics.discountAmount)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Combo price</span>
          <span className="font-semibold text-stone-900">{formatPrice(metrics.comboPrice)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>You save</span>
          <span className="font-semibold text-[#0a7a40]">{formatPrice(metrics.savings)}</span>
        </div>
      </div>

      <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-stone-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#06c] to-[#0a7a40] transition-all duration-300"
          style={{ width: `${Math.min(100, (selectedCount / requiredCount) * 100 || 0)}%` }}
        />
      </div>

      <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-stone-500">
        Selected {selectedCount} / {requiredCount}
      </p>

      <div className="mt-5 rounded-2xl bg-white p-3 text-sm text-stone-600">
        {complete ? (
          <span className="font-semibold text-[#0a7a40]">Combo Ready</span>
        ) : (
          <span>
            Select {Math.max(0, requiredCount - selectedCount)} more perfume{requiredCount - selectedCount === 1 ? "" : "s"}
          </span>
        )}
      </div>

      <div className="mt-4 text-sm text-stone-600">
        <span className="font-medium text-stone-800">{combo.badge || "Combo"}</span>
        <span className="mx-2">•</span>
        <span>{combo.quantity} × {combo.bottleSize}ml</span>
      </div>
    </div>
  );
}
