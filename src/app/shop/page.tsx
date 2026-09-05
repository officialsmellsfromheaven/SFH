"use client";
import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { SlidersHorizontal, X, ChevronDown, ChevronUp, Search, Sparkles, Heart } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import {
  products,
  fragranceFamilies,
  occasions,
  mainAccordOptions,
  getProductFragranceFamilies,
  getProductGender,
  getProductMainAccords,
  matchesFragranceSearch,
} from "@/lib/data";

const categories = [
  { id: "attar", label: "Attars" },
  { id: "luxury", label: "Luxury Collection" },
  { id: "inspired", label: "Inspired by Designer" },
];

const longevityOptions = ["4–6 hours", "6–8 hours", "8–12 hours", "12+ hours"];
const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "new", label: "New Arrivals" },
];

function FilterBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="mb-4 border-b border-dashed border-[#ddd0bc] pb-4">
      <button
        className="mb-3 flex w-full items-center justify-between text-left font-semibold text-[#1c2540]"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {title}
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>
      {open && children}
    </div>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") ?? "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("category") ? [searchParams.get("category")!] : []
  );
  const [selectedGenders, setSelectedGenders] = useState<string[]>(
    searchParams.get("gender") ? [searchParams.get("gender")!.toLowerCase()] : []
  );
  const [selectedFamilies, setSelectedFamilies] = useState<string[]>([]);
  const maxPrice = Math.max(...products.map((product) => product.price), 10000);
  const [selectedMainAccords, setSelectedMainAccords] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);
  const [sortBy, setSortBy] = useState("featured");
  const activeFragrances = products.filter((product) => product.available !== false);
  const displayedFragranceCount = Math.max(1, Math.floor(activeFragrances.length / 5) * 5 - 5);

  const toggleFilter = (
    value: string,
    arr: string[],
    setArr: (v: string[]) => void
  ) => {
    setArr(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
  };

  const filtered = useMemo(() => {
    let result = [...products];

    if (searchTerm.trim()) {
      result = result.filter((product) => matchesFragranceSearch(product, searchTerm));
    }
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }
    if (selectedGenders.length > 0) {
      result = result.filter((p) => selectedGenders.includes(getProductGender(p)));
    }
    if (selectedFamilies.length > 0) {
      result = result.filter((p) =>
        selectedFamilies.some((family) => getProductFragranceFamilies(p).includes(family))
      );
    }
    if (selectedMainAccords.length > 0) {
      result = result.filter((p) =>
        selectedMainAccords.some((accord) => getProductMainAccords(p).includes(accord))
      );
    }
    if (selectedOccasions.length > 0) {
      result = result.filter((p) =>
        p.occasion.some((o) => selectedOccasions.includes(o))
      );
    }
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // sort
    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "new")
      result = result.filter((p) => p.isNew).concat(result.filter((p) => !p.isNew));

    return result;
  }, [searchTerm, selectedCategories, selectedGenders, selectedFamilies, selectedMainAccords, selectedOccasions, priceRange, sortBy]);

  const activeFilterCount =
    selectedCategories.length + selectedGenders.length + selectedFamilies.length + selectedMainAccords.length + selectedOccasions.length + (searchTerm.trim() ? 1 : 0);

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedGenders([]);
    setSelectedFamilies([]);
    setSelectedMainAccords([]);
    setSelectedOccasions([]);
    setSearchTerm("");
    setPriceRange([0, 10000]);
  };

  const Sidebar = () => (
    <aside className="w-full space-y-0">
      {activeFilterCount > 0 && (
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-[#71675d]">
            {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
          </span>
          <button
            onClick={clearAll}
            className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8c6d3e] hover:underline"
          >
            Clear All
          </button>
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="fragrance-search" className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7d6d5d]">
          Search
        </label>
        <div className="relative">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            id="fragrance-search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Vanilla, Woody, Rose..."
            className="w-full border border-[#d9cdbb] bg-[#f8f3ea] py-2.5 pl-9 pr-3 text-sm text-[#4d4a47] shadow-[2px_3px_0_rgba(28,37,64,0.025)] focus:border-[#b88932] focus:outline-none"
            aria-label="Search fragrances"
          />
        </div>
      </div>

      <FilterBlock title="Gender">
        {['men', 'women', 'unisex'].map((gender) => (
          <label key={gender} className="flex items-center gap-2 mb-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={selectedGenders.includes(gender)}
              onChange={() => toggleFilter(gender, selectedGenders, setSelectedGenders)}
              className="accent-[#8c6d3e] h-4 w-4 rounded-sm"
              aria-label={gender}
            />
            <span className="text-[#5f5a55] text-sm group-hover:text-[#8c6d3e] transition-colors">
              {gender.charAt(0).toUpperCase() + gender.slice(1)}
            </span>
          </label>
        ))}
      </FilterBlock>

      <FilterBlock title="Category">
        {categories.map((cat) => (
          <label key={cat.id} className="flex items-center gap-2 mb-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={selectedCategories.includes(cat.id)}
              onChange={() => toggleFilter(cat.id, selectedCategories, setSelectedCategories)}
              className="accent-[#8c6d3e] h-4 w-4 rounded-sm"
              aria-label={cat.label}
            />
            <span className="text-[#5f5a55] text-sm group-hover:text-[#8c6d3e] transition-colors">
              {cat.label}
            </span>
          </label>
        ))}
      </FilterBlock>

      <FilterBlock title="Price Range">
        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={maxPrice}
            step={100}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, Number(e.target.value)])}
            className="w-full accent-[#8c6d3e]"
            aria-label="Maximum price"
          />
          <div className="flex justify-between text-xs text-stone-500">
            <span>₹0</span>
            <span>Up to ₹{priceRange[1].toLocaleString("en-IN")}</span>
          </div>
        </div>
      </FilterBlock>

      <FilterBlock title="Fragrance Family">
        {fragranceFamilies.map((f) => (
          <label key={f} className="flex items-center gap-2 mb-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={selectedFamilies.includes(f)}
              onChange={() => toggleFilter(f, selectedFamilies, setSelectedFamilies)}
              className="accent-[#8c6d3e] h-4 w-4 rounded-sm"
              aria-label={f}
            />
            <span className="text-[#5f5a55] text-sm group-hover:text-[#8c6d3e] transition-colors">
              {f}
            </span>
          </label>
        ))}
      </FilterBlock>

      <FilterBlock title="Main Accord">
        {mainAccordOptions.map((accord) => (
          <label key={accord} className="flex items-center gap-2 mb-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={selectedMainAccords.includes(accord)}
              onChange={() => toggleFilter(accord, selectedMainAccords, setSelectedMainAccords)}
              className="accent-[#8c6d3e] h-4 w-4 rounded-sm"
              aria-label={accord}
            />
            <span className="text-[#5f5a55] text-sm group-hover:text-[#8c6d3e] transition-colors">
              {accord}
            </span>
          </label>
        ))}
      </FilterBlock>

      <FilterBlock title="Occasion">
        {occasions.map((o) => (
          <label key={o} className="flex items-center gap-2 mb-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={selectedOccasions.includes(o)}
              onChange={() => toggleFilter(o, selectedOccasions, setSelectedOccasions)}
              className="accent-[#8c6d3e] h-4 w-4 rounded-sm"
              aria-label={o}
            />
            <span className="text-[#5f5a55] text-sm group-hover:text-[#8c6d3e] transition-colors">
              {o}
            </span>
          </label>
        ))}
      </FilterBlock>

      <FilterBlock title="Longevity">
        {longevityOptions.map((l) => (
          <label key={l} className="flex items-center gap-2 mb-2 cursor-pointer">
            <input type="checkbox" className="accent-[#8c6d3e] h-4 w-4 rounded-sm" aria-label={l} />
            <span className="text-[#5f5a55] text-sm">{l}</span>
          </label>
        ))}
      </FilterBlock>
    </aside>
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f0e4] text-[#1c2540]">
      {/* Soft Heaven scrapbook atmosphere */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-24 h-80 w-80 rounded-full bg-[#bfe1ec]/40 blur-3xl" />
        <div className="absolute right-[-120px] top-10 h-96 w-96 rounded-full bg-[#f3c7d3]/35 blur-3xl" />
        <div className="absolute bottom-[-180px] left-1/3 h-96 w-96 rounded-full bg-[#d9cdec]/35 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(#9d8d77_0.55px,transparent_0.55px)] [background-size:14px_14px]" />
      </div>

      {/* Scrapbook header / hero paper */}
      <section className="relative mx-auto max-w-[1500px] px-4 pb-7 pt-5 sm:px-6 lg:px-8">
        <div className="relative overflow-visible border border-[#dfd2bd] bg-[#fffdf7] px-5 py-8 shadow-[6px_8px_0_rgba(28,37,64,0.035),0_20px_50px_rgba(70,50,30,0.07)] sm:px-10 sm:py-10">
          <span className="pointer-events-none absolute -left-2 top-8 h-8 w-24 -rotate-[7deg] bg-[#f3c7d3]/75" />
          <span className="pointer-events-none absolute right-8 -top-3 h-8 w-24 rotate-[4deg] bg-[#fff0a8]/80" />

          <div className="absolute left-4 top-4 hidden rotate-[-8deg] sm:block">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#d7c9b2] bg-[#edf6f7] shadow-[3px_4px_0_rgba(28,37,64,0.05)]">
              <Heart size={24} strokeWidth={1.5} className="text-[#6b7187]" />
            </div>
          </div>

          <div className="absolute right-5 top-5 hidden max-w-[145px] rotate-[5deg] border border-[#e2d3b9] bg-[#fff6c9] px-4 py-3 text-center shadow-[4px_5px_0_rgba(28,37,64,0.05)] sm:block">
            <p className="text-[18px] leading-[1.05] text-[#1c2540]" style={{ fontFamily: "CaveatLocal, cursive" }}>
              good scents
              <br />
              better moods ♡
            </p>
          </div>

          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[16px] tracking-[0.18em] text-[#806f5a]" style={{ fontFamily: "CaveatLocal, cursive" }}>
              SCENTS FOR EVERY YOU
            </p>
            <h1 className="mt-2 font-[var(--font-playfair)] text-4xl font-semibold leading-[0.95] tracking-[-0.055em] text-[#111827] sm:text-6xl lg:text-7xl">
              Find Your Fragrance
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-[21px] leading-7 text-[#665d55]" style={{ fontFamily: "CaveatLocal, cursive" }}>
              A little closer to your next best memory ♡
            </p>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {["ALL", "ATTARS", "LUXURY COLLECTION", "INSPIRED BY DESIGNER"].map((item, index) => (
              <span
                key={item}
                className={`border px-3 py-1.5 text-[9px] font-semibold tracking-[0.14em] shadow-[2px_3px_0_rgba(28,37,64,0.04)] ${
                  index === 0
                    ? "border-[#b88932] bg-[#fff6c9] text-[#6e5b2f]"
                    : "border-[#e2d6c4] bg-[#fffdf7] text-[#665d55]"
                }`}
                style={{ transform: `rotate(${index % 2 ? 1.5 : -1}deg)` }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="relative mx-auto max-w-[1500px] px-4 pb-12 sm:px-6 lg:px-8">
        <div className="flex gap-6 lg:gap-8">
          {/* Desktop scrapbook filter sheet */}
          <div className="hidden w-[270px] flex-shrink-0 lg:block">
            <div className="sticky top-24 overflow-visible border border-[#ded1bc] bg-[#fffdf7] p-5 shadow-[5px_7px_0_rgba(28,37,64,0.035),0_18px_35px_rgba(70,50,30,0.06)]">
              <span className="pointer-events-none absolute -right-3 top-10 h-7 w-20 rotate-[8deg] bg-[#bfe1ec]/75" />
              <span className="pointer-events-none absolute -left-3 bottom-28 h-7 w-20 rotate-[-6deg] bg-[#d9cdec]/75" />

              <div className="mb-5 border-b border-dashed border-[#d8cbb8] pb-4">
                <p className="text-[18px] text-[#7c6a57]" style={{ fontFamily: "CaveatLocal, cursive" }}>
                  find what feels like you
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-[#1c2540]">
                  Filter Your Scent
                </h2>
              </div>

              {Sidebar()}

              <p className="mt-5 text-center text-[16px] text-[#7c6a57]" style={{ fontFamily: "CaveatLocal, cursive" }}>
                same energy, different scents ♡
              </p>
            </div>
          </div>

          {/* Product scrapbook area */}
          <div className="min-w-0 flex-1">
            <div className="relative mb-5 border-b border-dashed border-[#d7c9b6] pb-4">
              <span className="absolute -top-2 left-16 h-5 w-16 rotate-[2deg] bg-[#cfe6cf]/75" />
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[19px] text-[#6d6256]" style={{ fontFamily: "CaveatLocal, cursive" }}>
                    a little collection of memories ✦
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-[#1c2540]">
                    {filtered.length} Fragrances
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="inline-flex items-center gap-2 border border-[#d9cdbb] bg-[#fffdf7] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#1c2540] shadow-[3px_4px_0_rgba(28,37,64,0.04)] transition-transform hover:-rotate-1 lg:hidden"
                    aria-label="Open filters"
                  >
                    <SlidersHorizontal size={14} />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1c2540] text-[9px] text-white">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  <label className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none border border-[#d9cdbb] bg-[#fffdf7] px-4 py-2 pr-8 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#1c2540] shadow-[3px_4px_0_rgba(28,37,64,0.04)] focus:outline-none focus:ring-1 focus:ring-[#b88932]"
                      aria-label="Sort products"
                    >
                      {sortOptions.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#806f5a]" />
                  </label>
                </div>
              </div>
            </div>

            {/* Active scrapbook chips */}
            {activeFilterCount > 0 && (
              <div className="mb-5 flex flex-wrap gap-2">
                {[
                  ...selectedCategories,
                  ...selectedGenders,
                  ...selectedFamilies,
                  ...selectedMainAccords,
                  ...selectedOccasions,
                  ...(searchTerm.trim() ? [searchTerm.trim()] : []),
                ].map((f, index) => (
                  <span
                    key={f}
                    className={`inline-flex items-center gap-1.5 border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#1c2540] shadow-[2px_3px_0_rgba(28,37,64,0.04)] ${
                      index % 3 === 0
                        ? "rotate-[-1deg] border-[#e5ccd5] bg-[#fae9ef]"
                        : index % 3 === 1
                          ? "rotate-[1deg] border-[#cddfe4] bg-[#e9f4f5]"
                          : "rotate-[-0.5deg] border-[#e5d9b5] bg-[#fff6c9]"
                    }`}
                  >
                    {f}
                    <button
                      onClick={() => {
                        setSelectedCategories((v) => v.filter((x) => x !== f));
                        setSelectedGenders((v) => v.filter((x) => x !== f));
                        setSelectedFamilies((v) => v.filter((x) => x !== f));
                        setSelectedMainAccords((v) => v.filter((x) => x !== f));
                        setSelectedOccasions((v) => v.filter((x) => x !== f));
                        if (f === searchTerm.trim()) setSearchTerm("");
                      }}
                      aria-label={`Remove filter ${f}`}
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="relative border border-dashed border-[#d9cdbb] bg-[#fffdf7] py-24 text-center shadow-[4px_5px_0_rgba(28,37,64,0.04)]">
                <p className="text-5xl">🌸</p>
                <p className="mt-4 text-xl text-[#1c2540]" style={{ fontFamily: "CaveatLocal, cursive" }}>
                  no scent found in this little corner of heaven
                </p>
                <button onClick={clearAll} className="mt-4 border border-[#1c2540] bg-[#1c2540] px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white shadow-[3px_4px_0_rgba(28,37,64,0.1)]">
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Product scrapbook rows.
                    Each visual row is its own layout group. This is important:
                    when one card opens, only that card grows; the other cards in
                    the same row keep their natural height, while the next row
                    moves down normally. */}
                {Array.from({ length: Math.ceil(filtered.length / 4) }).map((_, rowIndex) => {
                  const rowProducts = filtered.slice(rowIndex * 4, rowIndex * 4 + 4);

                  return (
                    <div
                      key={`product-row-${rowIndex}`}
                      className="grid grid-cols-2 items-start gap-4 sm:grid-cols-3 xl:grid-cols-4 xl:gap-5"
                    >
                      {rowProducts.map((product) => (
                        <div key={product.id} className="min-w-0 self-start">
                          <ProductCard product={product} />
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-8 flex items-center justify-center gap-3 text-center">
              <Sparkles size={15} className="text-[#b88932]" />
              <p className="text-[18px] text-[#71675d]" style={{ fontFamily: "CaveatLocal, cursive" }}>
                every bottle carries a little piece of heaven
              </p>
              <Sparkles size={15} className="text-[#b88932]" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile filter drawer — scrapbook paper */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-[#1c2540]/45 backdrop-blur-[2px] lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 z-50 w-[min(88vw,360px)] overflow-y-auto border-r border-[#d9cdbb] bg-[#f7f0e4] p-5 shadow-[10px_0_30px_rgba(28,37,64,0.12)] lg:hidden">
            <div className="relative border border-[#ded1bc] bg-[#fffdf7] p-5 shadow-[4px_5px_0_rgba(28,37,64,0.05)]">
              <span className="pointer-events-none absolute -right-2 top-8 h-7 w-20 rotate-[5deg] bg-[#f3c7d3]/80" />
              <div className="mb-5 flex items-center justify-between border-b border-dashed border-[#d8cbb8] pb-4">
                <div>
                  <p className="text-[18px] text-[#7c6a57]" style={{ fontFamily: "CaveatLocal, cursive" }}>
                    choose your mood
                  </p>
                  <h2 className="text-2xl font-semibold text-[#1c2540]">Filter Your Scent</h2>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close filters"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d9cdbb] bg-[#fffaf0]"
                >
                  <X size={18} />
                </button>
              </div>

              {Sidebar()}

              <button
                onClick={() => setSidebarOpen(false)}
                className="mt-5 w-full border border-[#1c2540] bg-[#1c2540] py-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-white shadow-[4px_5px_0_rgba(28,37,64,0.1)] transition-transform hover:-rotate-1"
              >
                Show {filtered.length} Results
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-50 flex items-center justify-center"><div className="text-stone-400">Loading...</div></div>}>
      <ShopContent />
    </Suspense>
  );
}
