"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, X } from "lucide-react";
import toast from "react-hot-toast";
import ComboProductSelector from "@/components/combo/ComboProductSelector";
import ComboSummary from "@/components/combo/ComboSummary";
import { getEligibleProducts, type ComboDefinition } from "@/lib/combo/combo-config";
import { calculateComboMetrics } from "@/lib/combo/combo-pricing";
import { buildComboCartItem } from "@/lib/combo/combo-utils";
import { products } from "@/lib/data";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

type ComboBuilderProps = {
  combo: ComboDefinition;
  onClose?: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
};

export default function ComboBuilder({ combo, onClose, triggerRef }: ComboBuilderProps) {
  const { addComboItem } = useCartStore();
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const eligibleProducts = useMemo(() => getEligibleProducts(combo, products), [combo]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    closeButtonRef.current?.focus();
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      triggerRef?.current?.focus();
    };
  }, [onClose, triggerRef]);

  const selectedProducts = useMemo(
    () => eligibleProducts.filter((product) => selectedIds.includes(product.id)),
    [eligibleProducts, selectedIds]
  );

  const metrics = useMemo(
    () => calculateComboMetrics({ combo, selectedProducts }),
    [combo, selectedProducts]
  );

  const requiredCount = combo.quantity;
  const complete = selectedProducts.length >= requiredCount;

  const toggleProduct = (productId: string) => {
    setSelectedIds((current) => {
      if (current.includes(productId)) {
        return current.filter((id) => id !== productId);
      }

      if (current.length >= requiredCount) {
        return current;
      }

      return [...current, productId];
    });
  };

  const handleAddCombo = () => {
    if (!complete) {
      toast.error(`Select ${Math.max(0, requiredCount - selectedProducts.length)} more perfumes`);
      return;
    }

    const cartItem = buildComboCartItem({ combo, selectedProducts, metrics });
    addComboItem(cartItem);
    toast.success(`${combo.name} added to cart`);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/50 p-0 sm:items-center sm:p-4 sfh-combo-content" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="combo-builder-title"
        className="relative flex h-[95vh] max-h-[95vh] w-full max-w-6xl min-h-0 flex-col overflow-hidden rounded-t-[28px] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.18)] sm:rounded-[28px]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-stone-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#bf4800]">Build your combo</p>
            <h2 id="combo-builder-title" className="mt-1 truncate text-lg font-semibold text-stone-900 sm:text-2xl">
              {combo.name}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-600 sm:px-3">
              {selectedProducts.length} / {requiredCount}
            </div>
            {onClose ? (
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-600 transition-colors hover:border-stone-300 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06c] focus-visible:ring-offset-2"
                aria-label="Close combo builder"
              >
                <X size={18} />
              </button>
            ) : null}
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden xl:flex-row">
          <div className="min-h-0 flex-1 overflow-hidden xl:h-full">
            <div className="border-b border-stone-200 bg-white px-4 py-3 sm:px-6">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-stone-600">Choose your perfumes</p>
                  <p className="mt-1 text-lg font-semibold text-stone-900">
                    Selected {selectedProducts.length} / {requiredCount}
                  </p>
                </div>
                <div className="rounded-full border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-stone-600">
                  {complete ? "Ready to build" : `${Math.max(0, requiredCount - selectedProducts.length)} left`}
                </div>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-stone-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#06c] to-[#0a7a40] transition-all duration-300"
                  style={{ width: `${Math.min(100, (selectedProducts.length / requiredCount) * 100)}%` }}
                />
              </div>
            </div>

            <div className="min-h-0 max-h-[calc(95vh-210px)] flex-1 overflow-y-auto p-4 sm:p-6">
              {eligibleProducts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-6 text-sm text-stone-600">
                  No eligible perfumes are available for this combo.
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {eligibleProducts.map((product) => (
                    <ComboProductSelector
                      key={product.id}
                      product={product}
                      selected={selectedIds.includes(product.id)}
                      disabled={selectedProducts.length >= requiredCount && !selectedIds.includes(product.id)}
                      onToggle={toggleProduct}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="sfh-combo-summary-scroll min-h-0 flex-shrink-0 border-t border-stone-200 bg-stone-50 p-4 sm:p-6 xl:h-full xl:max-h-full xl:w-[340px] xl:overflow-y-auto xl:overflow-x-hidden xl:border-l xl:border-t-0">
            <div className="space-y-4">
              <ComboSummary
                combo={combo}
                metrics={metrics}
                selectedCount={selectedProducts.length}
                requiredCount={requiredCount}
                complete={complete}
              />

              <div className="rounded-3xl border border-stone-200 bg-white p-5">
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
              </div>

              <button
                type="button"
                onClick={handleAddCombo}
                disabled={!complete}
                className={[
                  "inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-colors",
                  complete
                    ? "bg-[#0071e3] text-white hover:bg-[#0067d3]"
                    : "cursor-not-allowed bg-stone-200 text-stone-500",
                ].join(" ")}
              >
                {complete ? (
                  <>
                    <CheckCircle2 size={18} />
                    Add Combo to Cart
                  </>
                ) : (
                  <>
                    <ArrowRight size={18} />
                    Select {Math.max(0, requiredCount - selectedProducts.length)} more perfumes
                  </>
                )}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
