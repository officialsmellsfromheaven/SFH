"use client";
import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { SlidersHorizontal, X, ChevronDown, ChevronUp, Search } from "lucide-react";
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
  { id: "men", label: "Men" },
  { id: "women", label: "Women" },
  { id: "unisex", label: "Unisex" },
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
    <div className="border-b border-stone-100 pb-4 mb-4">
      <button
        className="flex items-center justify-between w-full font-semibold text-stone-800 mb-3"
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
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-stone-600">
            {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
          </span>
          <button
            onClick={clearAll}
            className="text-xs text-amber-600 font-semibold hover:underline"
          >
            Clear All
          </button>
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="fragrance-search" className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-stone-500">
          Search
        </label>
        <div className="relative">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            id="fragrance-search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Vanilla, Woody, Rose..."
            className="w-full rounded-full border border-stone-200 bg-stone-50 py-2.5 pl-9 pr-3 text-sm text-stone-700 focus:border-amber-400 focus:outline-none"
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
              className="accent-amber-600 w-4 h-4 rounded"
              aria-label={gender}
            />
            <span className="text-stone-600 text-sm group-hover:text-amber-600 transition-colors">
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
              className="accent-amber-600 w-4 h-4 rounded"
              aria-label={cat.label}
            />
            <span className="text-stone-600 text-sm group-hover:text-amber-600 transition-colors">
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
            className="w-full accent-amber-600"
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
              className="accent-amber-600 w-4 h-4 rounded"
              aria-label={f}
            />
            <span className="text-stone-600 text-sm group-hover:text-amber-600 transition-colors">
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
              className="accent-amber-600 w-4 h-4 rounded"
              aria-label={accord}
            />
            <span className="text-stone-600 text-sm group-hover:text-amber-600 transition-colors">
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
              className="accent-amber-600 w-4 h-4 rounded"
              aria-label={o}
            />
            <span className="text-stone-600 text-sm group-hover:text-amber-600 transition-colors">
              {o}
            </span>
          </label>
        ))}
      </FilterBlock>

      <FilterBlock title="Longevity">
        {longevityOptions.map((l) => (
          <label key={l} className="flex items-center gap-2 mb-2 cursor-pointer">
            <input type="checkbox" className="accent-amber-600 w-4 h-4 rounded" aria-label={l} />
            <span className="text-stone-600 text-sm">{l}</span>
          </label>
        ))}
      </FilterBlock>
    </aside>
  );

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-amber-200 shadow-sm flex-shrink-0">
            <Image src="/logo.png" alt="Smells From Heaven" fill className="object-cover" sizes="48px" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-[var(--font-playfair)] text-stone-900">Shop All Fragrances</h1>
            <p className="text-stone-500 mt-0.5">Discover your perfect scent from <span className="font-semibold text-amber-600">{displayedFragranceCount}+</span> premium fragrances</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl p-5 border border-stone-100 sticky top-24">
              <h2 className="font-bold text-stone-800 mb-4 text-lg">Filters</h2>
              {Sidebar()}
            </div>
          </div>

          {/* Products */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-2 border border-stone-200 rounded-full px-4 py-2 text-sm font-medium text-stone-700 hover:border-amber-400"
                  aria-label="Open filters"
                >
                  <SlidersHorizontal size={16} />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="bg-amber-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                <p className="text-stone-500 text-sm">
                  {filtered.length} results
                </p>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-stone-200 rounded-full px-4 py-2 text-sm text-stone-700 focus:outline-none focus:border-amber-400 bg-white"
                aria-label="Sort products"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {[
                  ...selectedCategories,
                  ...selectedGenders,
                  ...selectedFamilies,
                  ...selectedMainAccords,
                  ...selectedOccasions,
                  ...(searchTerm.trim() ? [searchTerm.trim()] : []),
                ].map((f) => (
                  <span
                    key={f}
                    className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full px-3 py-1 border border-amber-200"
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
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="text-center py-20 text-stone-400">
                <p className="text-5xl mb-4">🌸</p>
                <p className="text-lg font-medium">No fragrances match your filters</p>
                <button onClick={clearAll} className="mt-4 text-amber-600 font-semibold hover:underline">
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 w-80 bg-white z-50 p-5 overflow-y-auto shadow-xl lg:hidden">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-stone-800 text-lg">Filters</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Close filters"
                className="p-2 rounded-full hover:bg-stone-100"
              >
                <X size={20} />
              </button>
            </div>
            {Sidebar()}
            <button
              onClick={() => setSidebarOpen(false)}
              className="w-full mt-4 bg-amber-600 text-white py-3 rounded-full font-semibold hover:bg-amber-700 transition-colors"
            >
              Show {filtered.length} Results
            </button>
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
