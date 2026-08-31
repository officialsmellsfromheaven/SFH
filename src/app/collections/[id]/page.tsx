import { collections, products } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const col = collections.find((c) => c.id === id);
  return {
    title: col?.name ?? "Collection",
    description: col?.description,
  };
}

export default async function CollectionDetailPage({ params }: Props) {
  const { id } = await params;
  const col = collections.find((c) => c.id === id);
  const colProducts = products.filter((p) => p.collections.some((c) => c.toLowerCase().includes(id)));

  if (!col) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-2xl font-bold text-stone-400">Collection not found</p>
        <Link href="/collections" className="mt-4 text-amber-600 font-semibold hover:underline">
          Back to Collections
        </Link>
      </div>
    );
  }

  const displayProducts = colProducts.length > 0 ? colProducts : products.slice(0, 6);

  return (
    <div className="min-h-screen bg-stone-50">
      <PageHero
        eyebrow={col.name}
        title={col.name}
        subtitle={col.description}
        showLogo
      >
        <Link href="/collections" className="inline-flex items-center gap-2 text-stone-400 hover:text-amber-400 text-sm transition-colors">
          <ArrowLeft size={14} /> Back to Collections
        </Link>
      </PageHero>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
