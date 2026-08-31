import SafeImage from "@/components/ui/SafeImage";
import { getProductPrimaryImage, type Product } from "@/lib/data";
import { getLowestProductPrice } from "@/lib/pricing";
import { formatPrice } from "@/lib/utils";

type ComboProductSelectorProps = {
  product: Product;
  selected: boolean;
  disabled: boolean;
  onToggle: (productId: string) => void;
};

export default function ComboProductSelector({
  product,
  selected,
  disabled,
  onToggle,
}: ComboProductSelectorProps) {
  const fragranceFamily = product.fragranceFamily?.trim() || "Signature";
  const accords = Array.isArray(product.mainAccords) && product.mainAccords.length > 0
    ? product.mainAccords.slice(0, 3).join(" • ")
    : product.notes?.top?.slice(0, 3).join(" • ") || "Warm, elegant, long-lasting";

  return (
    <button
      type="button"
      onClick={() => onToggle(product.id)}
      disabled={disabled && !selected}
      aria-pressed={selected}
      aria-label={`${selected ? "Remove" : "Select"} ${product.name}`}
      className={[
        "group flex w-full flex-col overflow-hidden rounded-2xl border text-left transition-all duration-200",
        selected
          ? "border-[#06c] bg-[#eef6ff] shadow-[0_10px_30px_rgba(0,102,204,0.12)]"
          : "border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm",
        disabled && !selected ? "cursor-not-allowed opacity-60" : "cursor-pointer",
      ].join(" ")}
    >
      <div className="relative h-40 overflow-hidden bg-stone-100">
        <SafeImage
          src={getProductPrimaryImage(product)}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 240px"
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {selected ? (
          <span className="absolute right-3 top-3 rounded-full bg-[#06c] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
            Selected
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#bf4800]">{product.brand}</p>
            <h3 className="mt-1 text-lg font-semibold text-stone-900">{product.name}</h3>
          </div>
          <span className="text-sm font-semibold text-stone-800">{formatPrice(getLowestProductPrice(product))}</span>
        </div>

        <div className="space-y-1 text-sm text-stone-600">
          <p><span className="font-medium text-stone-700">Family:</span> {fragranceFamily}</p>
          <p><span className="font-medium text-stone-700">Accords:</span> {accords}</p>
        </div>
      </div>
    </button>
  );
}
