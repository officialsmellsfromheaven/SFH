import ComboCard from "@/components/combo/ComboCard";
import { getActiveCombos } from "@/lib/combo/combo-config";

export default function ComboSection() {
  const combos = getActiveCombos();

  if (combos.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#f7f3ee] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b88932]">Build your perfect bundle</p>
          <h2 className="mt-4 font-[var(--font-playfair)] text-4xl font-semibold leading-[0.96] tracking-[-0.06em] text-[#111111] sm:text-5xl">
            Custom fragrance combos
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#4d4d4d]">
            Mix your favourite scents, choose the right bottle size, and unlock a smarter, more rewarding price per fragrance.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
          {combos.map((combo) => (
            <ComboCard key={combo.id} combo={combo} />
          ))}
        </div>
      </div>
    </section>
  );
}
