import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HeroBanner from "@/components/home/HeroBanner";
import ProductSection from "@/components/home/ProductSection";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";
import ComboSection from "@/components/combo/ComboSection";
import { getProductPrimaryImage, products } from "@/lib/data";
import { getSiteImage } from "@/lib/siteImages";

const moodVisual = getSiteImage("homeMood");
const finderVisual = getSiteImage("fragranceFinder");
const mensCampaignVisual = getSiteImage("mensCampaign");

const bestSellers = products
  .filter((product) => product.isBestSeller)
  .concat(products.filter((product) => !product.isBestSeller))
  .slice(0, 4);

const moodOptions = [
  "🔥 BOLD",
  "🌊 FRESH",
  "🌙 MYSTERIOUS",
  "🍯 SWEET",
  "🌿 CLEAN",
];

const menProducts = products.filter((product) => product.category === "men").slice(0, 3);
const womenProducts = products.filter((product) => product.category === "women").slice(0, 3);

const brandPillars = [
  {
    title: "Premium by design",
    text: "Signature blends with clean structure, warm woods, and memorable finishing notes.",
  },
  {
    title: "Made for your mood",
    text: "Choose the energy you want to wear, from fresh and crisp to deep and intoxicating.",
  },
  {
    title: "Easy to love",
    text: "Luxury-inspired fragrances shaped for Indian lifestyles, daily rituals, and special nights.",
  },
];

export default function HomePage() {
  return (
    <>
      <HeroBanner />

      <section className="border-y border-[#e9dfcf] bg-[#ffffff]/80">
        <div className="mx-auto flex max-w-7xl snap-x gap-6 overflow-x-auto px-4 py-5 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-[#4d4d4d] sm:justify-center sm:px-6">
          {["EDP sprays", "Attars", "Oud blends", "Gift sets", "Free shipping over 999"].map((item, index) => (
            <Link
              key={item}
              href="/shop"
              className="luxury-link group relative shrink-0 px-2 py-2 transition-colors hover:text-[#b88932]"
            >
              <span>{item}</span>
              {index < 4 ? <span className="pointer-events-none absolute -right-3 top-1/2 hidden h-4 w-px -translate-y-1/2 bg-[#e9dfcf] sm:block" /> : null}
            </Link>
          ))}
        </div>
      </section>

      <ComboSection />

      <ProductSection
        title="Best sellers"
        subtitle="Loved for their depth and character"
        products={bestSellers}
        viewAllHref="/shop?filter=bestseller"
        viewAllLabel="Shop best sellers"
        tone="light"
      />

      <section className="bg-[#faf8f3] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-8 lg:grid-cols-[0.96fr_1.04fr]">
            <div className="relative overflow-hidden rounded-[2rem] border border-[#eadfc5] bg-[#f5efe3] p-3 shadow-[0_18px_42px_rgba(17,17,17,0.04)]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
                <Image
                  src={moodVisual?.src ?? "/logo.png"}
                  alt={moodVisual?.alt ?? "Smells From Heaven Gen-Z lifestyle brand visual"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 620px"
                  className="object-cover transition-transform duration-500 hover:scale-[1.02]"
                />
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b88932]">
                WEAR YOUR MOOD.
              </p>
              <h2 className="mt-4 font-[var(--font-playfair)] text-4xl font-semibold leading-[0.92] tracking-[-0.06em] text-[#111111] sm:text-5xl lg:text-[4rem]">
                Your fragrance.
                <span className="block">Your vibe.</span>
                <span className="block">Your rules.</span>
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-[#4d4d4d]">
                Discover a fragrance mood that matches the way you move through the world.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {moodOptions.map((option) => (
                  <span
                    key={option}
                    className="inline-flex items-center rounded-full border border-[#e7d9b3] bg-white px-4 py-2 text-sm font-medium text-[#111111]"
                  >
                    {option}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/fragrance-finder"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111111] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1d1d1d]"
                >
                  FIND MY SCENT
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/shop?filter=bestseller"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d9c8a2] bg-transparent px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#111111] transition-all duration-200 hover:border-[#b88932] hover:text-[#b88932]"
                >
                  SHOP BESTSELLERS
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 text-center sm:mb-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b88932]">
              NOT SURE WHAT TO WEAR?
            </p>
            <h2 className="mt-3 font-[var(--font-playfair)] text-4xl font-semibold leading-[0.96] tracking-[-0.06em] text-[#111111] sm:text-5xl">
              LET YOUR VIBE
              <span className="block">CHOOSE YOUR FRAGRANCE.</span>
            </h2>
          </div>

          <div className="grid items-center gap-8 rounded-[2rem] border border-[#efe5d2] bg-[#faf7f1] p-4 sm:p-6 lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
            <div className="relative overflow-hidden rounded-[1.6rem] bg-[#efe7d9]">
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={finderVisual?.src ?? "/logo.png"}
                  alt={finderVisual?.alt ?? "Smells From Heaven fragrance finder character visual"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 520px"
                  className="object-cover transition-transform duration-500 hover:scale-[1.02]"
                />
              </div>
            </div>

            <div>
              <div className="grid gap-3 sm:grid-cols-2">
                {moodOptions.map((option) => (
                  <Link
                    key={option}
                    href="/fragrance-finder"
                    className="rounded-[1.2rem] border border-[#e8d9b9] bg-white px-5 py-4 text-left text-lg font-medium text-[#111111] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#b88932] hover:shadow-[0_12px_26px_rgba(17,17,17,0.04)]"
                  >
                    {option}
                  </Link>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <Link
                  href="/fragrance-finder"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111111] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1d1d1d]"
                >
                  START MATCHING
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d9c8a2] bg-white px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#111111] transition-all duration-200 hover:border-[#b88932] hover:text-[#b88932]"
                >
                  SHOP ALL
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f3ee] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b88932]">
                COLLECTIONS
              </p>
              <h2 className="mt-3 font-[var(--font-playfair)] text-4xl font-semibold leading-[0.96] tracking-[-0.06em] text-[#111111] sm:text-5xl">
                Fragrance for every mood.
              </h2>
            </div>
            <Link href="/shop" className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#111111] transition-colors hover:text-[#b88932]">
              Explore all
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <CollectionColumn title="MEN'S" products={menProducts} href="/shop?filter=men" />
            <CollectionColumn title="WOMEN'S" products={womenProducts} href="/shop?filter=women" />
          </div>
        </div>
      </section>

      <section className="bg-[#efe5d5] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative overflow-hidden rounded-[2rem] border border-[#e6d8ba] bg-[#f6f0e7] p-3 shadow-[0_18px_42px_rgba(17,17,17,0.04)]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
                <Image
                  src={mensCampaignVisual?.src ?? "/logo.png"}
                  alt={mensCampaignVisual?.alt ?? "Smells From Heaven men's fragrance campaign visual"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 620px"
                  className="object-cover transition-transform duration-500 hover:scale-[1.02]"
                />
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8a6a2a]">
                MEN&apos;S CAMPAIGN
              </p>
              <h2 className="mt-4 font-[var(--font-playfair)] text-4xl font-semibold leading-[0.96] tracking-[-0.06em] text-[#111111] sm:text-5xl">
                DRESS SHARP.
                <span className="block">SMELL SHARPER.</span>
              </h2>
              <p className="mt-5 max-w-lg text-lg leading-8 text-[#4d4d4d]">
                Discover fragrances made for moments that matter.
              </p>
              <Link
                href="/shop?filter=men"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#111111] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1d1d1d]"
              >
                SHOP MEN&apos;S COLLECTION
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b88932]">
              WHY SFH
            </p>
            <h2 className="mt-3 font-[var(--font-playfair)] text-4xl font-semibold leading-[0.96] tracking-[-0.06em] text-[#111111] sm:text-5xl">
              Premium scent, personal energy.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {brandPillars.map((pillar) => (
              <article key={pillar.title} className="rounded-[1.6rem] border border-[#efe5d5] bg-[#faf8f3] p-6 shadow-[0_12px_28px_rgba(17,17,17,0.02)]">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#ead8a8] bg-[#f3e7ca]" aria-hidden="true">
                  <div className="h-3 w-3 rounded-full bg-[#b88932]" />
                </div>
                <h3 className="text-2xl font-semibold text-[#111111]">{pillar.title}</h3>
                <p className="mt-3 text-base leading-7 text-[#4d4d4d]">{pillar.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <WhyChooseUsSection />

      <section className="bg-[#111111] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d9bf7f]">
            CRAFTED IN HEAVEN. WORN BY LEGENDS.
          </p>
          <h2 className="mt-4 font-[var(--font-playfair)] text-4xl font-semibold leading-[0.96] tracking-[-0.06em] text-white sm:text-5xl">
            Your next signature scent is waiting.
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#faf8f3] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#111111] transition-all duration-200 hover:-translate-y-0.5"
            >
              SHOP NOW
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/fragrance-finder"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-transparent px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-200 hover:border-[#d9bf7f] hover:text-[#d9bf7f]"
            >
              FIND MY SCENT
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

type CollectionColumnProps = {
  title: string;
  products: Array<{ id: string; name: string; category?: string; image?: string }>;
  href: string;
};

function CollectionColumn({ title, products, href }: CollectionColumnProps) {
  return (
    <div className="rounded-[1.8rem] border border-[#eae0d1] bg-white p-5 shadow-[0_18px_40px_rgba(17,17,17,0.03)] sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h3 className="text-3xl font-semibold text-[#111111]">{title}</h3>
        <Link href={href} className="text-sm font-semibold uppercase tracking-[0.12em] text-[#111111] hover:text-[#b88932]">
          VIEW ALL
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-3">
        {products.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`} className="luxury-card group block rounded-[1.4rem] border border-[#efe5d5] bg-[#faf7f1] p-3 text-left hover:border-[#d8bf8b]">
            <div className="relative h-52 overflow-hidden rounded-[1rem] bg-[#f0eadf]">
              <Image
                src={getProductPrimaryImage(product as Parameters<typeof getProductPrimaryImage>[0])}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, 240px"
                className="object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="mt-4">
              <p className="text-lg font-medium text-[#111111]">{product.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
