"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import ComboBuilder from "@/components/combo/ComboBuilder";
import { getEligibleProducts, type ComboDefinition } from "@/lib/combo/combo-config";
import { calculateComboMetrics } from "@/lib/combo/combo-pricing";
import { products } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

type ComboCardProps = {
  combo: ComboDefinition;
};

export default function ComboCard({ combo }: ComboCardProps) {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const eligibleProducts = useMemo(() => getEligibleProducts(combo, products), [combo]);
  const previewProducts = useMemo(() => {
    const sorted = [...eligibleProducts].sort((a, b) => b.price - a.price);
    return sorted.slice(0, Math.max(combo.quantity, 1));
  }, [combo.quantity, eligibleProducts]);
  const metrics = useMemo(
    () => calculateComboMetrics({ combo, selectedProducts: previewProducts }),
    [combo, previewProducts]
  );

  const discountLabel = `${Number(combo.pricingRule?.targetPercentage ?? 0)}% OFF`;

  return (
    <>
      <article className="luxury-card group flex h-full flex-col rounded-[1.75rem] border border-[#e9dfcf] bg-[#ffffff] p-5 shadow-[0_10px_26px_rgba(17,17,17,0.02)] hover:border-[#d8bf8b] hover:shadow-[0_18px_36px_rgba(17,17,17,0.05)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            {combo.badge ? (
              <span className="inline-flex rounded-full border border-[#e6cd9d] bg-[#f8efe1] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8b6726]">
                {combo.badge}
              </span>
            ) : null}
            <h3 className="mt-3 font-[var(--font-playfair)] text-[2.1rem] font-semibold leading-none tracking-[-0.05em] text-[#111111]">{combo.name}</h3>
          </div>
          <div className="rounded-full border border-[#e9dfcf] bg-[#faf8f3] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#4d4d4d]">
            {combo.bottleSize}ml
          </div>
        </div>

        <p className="mt-3 text-sm leading-6 text-[#4d4d4d]">{combo.description || "Choose your favourite fragrances and build your own combo."}</p>

        <div className="mt-5 rounded-[1.25rem] border border-[#efe6d7] bg-[#faf8f3] p-4">
          <div className="flex items-center justify-between text-sm text-[#4d4d4d]">
            <span>Reference price</span>
            <span className="font-medium text-[#111111]">{formatPrice(metrics.referencePrice)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-[#4d4d4d]">
            <span>Combo price</span>
            <span className="font-medium text-[#111111]">{formatPrice(metrics.comboPrice)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-[#4d4d4d]">
            <span>You save</span>
            <span className="font-medium text-[#8b6726]">{formatPrice(metrics.savings)}</span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 rounded-[1.15rem] border border-[#efe6d7] bg-[#fffdf9] px-4 py-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#6e6e73]">Bundle</p>
            <p className="mt-1 text-lg font-medium text-[#111111]">{combo.quantity} × {combo.bottleSize}ml</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#6e6e73]">Savings</p>
            <p className="mt-1 text-lg font-medium text-[#8b6726]">{discountLabel}</p>
          </div>
        </div>

        <div className="mt-auto pt-5">
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#111111] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1b1b1b] hover:shadow-[0_12px_22px_rgba(17,17,17,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b88932] focus-visible:ring-offset-2"
          >
            <Sparkles size={16} />
            Build Your Combo
            <ArrowRight size={16} />
          </button>
        </div>
      </article>

      {open ? (
        <ComboBuilder combo={combo} onClose={() => setOpen(false)} triggerRef={triggerRef} />
      ) : null}
    </>
  );
}
