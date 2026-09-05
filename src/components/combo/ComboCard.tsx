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
  const eligibleProducts = useMemo(
    () => getEligibleProducts(combo, products),
    [combo],
  );
  const previewProducts = useMemo(() => {
    const sorted = [...eligibleProducts].sort((a, b) => b.price - a.price);
    return sorted.slice(0, Math.max(combo.quantity, 1));
  }, [combo.quantity, eligibleProducts]);
  const metrics = useMemo(
    () => calculateComboMetrics({ combo, selectedProducts: previewProducts }),
    [combo, previewProducts],
  );

  const discountLabel = `${Number(combo.pricingRule?.targetPercentage ?? 0)}% OFF`;

  return (
    <>
      <article className="group relative flex h-full flex-col border border-[#ddd1bf] bg-[#fffdf7] p-5 shadow-[6px_8px_0_rgba(28,37,64,0.06),0_18px_38px_rgba(17,17,17,0.05)] transition-all duration-300 hover:border-[#c9b98f] hover:shadow-[9px_12px_0_rgba(28,37,64,0.07),0_24px_45px_rgba(17,17,17,0.07)] sm:p-6">
        <div className="pointer-events-none absolute inset-[6px] border border-dashed border-[#e8decd]" />

        <div className="relative flex items-start justify-between gap-3">
          <div>
            {combo.badge ? (
              <span className="inline-flex rotate-[-2deg] border border-[#e4cf9d] bg-[#fff6c9] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8b6726] shadow-[2px_3px_0_rgba(28,37,64,0.04)]">
                {combo.badge}
              </span>
            ) : null}

            <h3
              className="mt-4 text-[2.25rem] font-semibold leading-[0.9] tracking-[-0.04em] text-[#1c2540]"
              style={{ fontFamily: "CaveatLocal, cursive" }}
            >
              {combo.name}
            </h3>
          </div>

          <div className="rotate-[3deg] border border-[#dcd0bd] bg-[#f2eadc] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#4d4d4d]">
            {combo.bottleSize}ml
          </div>
        </div>

        <p className="relative mt-4 text-sm leading-6 text-[#5c5860]">
          {combo.description ||
            "Choose your favourite fragrances and build your own combo."}
        </p>

        <div className="relative mt-5 border border-[#e5dac8] bg-[#f5efe4] p-4 shadow-[2px_3px_0_rgba(28,37,64,0.03)]">
          <div className="mb-3 flex items-center justify-between">
            <span
              className="text-xl text-[#1c2540]"
              style={{ fontFamily: "CaveatLocal, cursive" }}
            >
              the little math ✦
            </span>
          </div>

          <div className="space-y-2 text-sm text-[#5c5860]">
            <div className="flex items-center justify-between gap-4">
              <span>Reference price</span>
              <span className="font-medium text-[#1c2540]">
                {formatPrice(metrics.referencePrice)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Combo price</span>
              <span className="font-medium text-[#1c2540]">
                {formatPrice(metrics.comboPrice)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-dashed border-[#d9cdb9] pt-2">
              <span className="font-medium text-[#6f5a35]">You save</span>
              <span className="font-semibold text-[#8b6726]">
                {formatPrice(metrics.savings)}
              </span>
            </div>
          </div>
        </div>

        <div className="relative mt-5 flex items-center justify-between gap-4 border border-[#e3d8c7] bg-[#fff6c9]/45 px-4 py-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#777078]">
              Bundle
            </p>
            <p className="mt-1 text-lg font-medium text-[#1c2540]">
              {combo.quantity} × {combo.bottleSize}ml
            </p>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#777078]">
              Savings
            </p>
            <p
              className="mt-1 text-2xl font-semibold text-[#8b6726]"
              style={{ fontFamily: "CaveatLocal, cursive" }}
            >
              {discountLabel}
            </p>
          </div>
        </div>

        <div className="relative mt-auto pt-6">
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex w-full items-center justify-center gap-2 border-2 border-[#1c2540] bg-[#1c2540] px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2b3656] hover:shadow-[4px_5px_0_rgba(28,37,64,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b88932] focus-visible:ring-offset-2"
          >
            <Sparkles size={16} />
            Build Your Combo
            <ArrowRight size={16} />
          </button>
        </div>
      </article>

      {open ? (
        <ComboBuilder
          combo={combo}
          onClose={() => setOpen(false)}
          triggerRef={triggerRef}
        />
      ) : null}
    </>
  );
}

