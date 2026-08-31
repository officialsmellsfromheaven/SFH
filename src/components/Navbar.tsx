"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock3, Heart, Menu, MessageCircle, Search, ShoppingBag, Sparkles, X } from "lucide-react";
import { orderConfig } from "@/lib/orderConfig";
import { getProductSlug, products } from "@/lib/data";
import { getFeaturedSearchSuggestions, popularSearches, searchProducts } from "@/lib/search";
import { useCartStore } from "@/lib/store";

const navLinks = [
  { label: "Store", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "Finder", href: "/fragrance-finder" },
  { label: "Offers", href: "/offers" },
  { label: "About", href: "/about" },
  { label: "Support", href: "/faq" },
];

const recentSearchKey = "smells-recent-searches";

export default function Navbar() {
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];

    try {
      const saved = JSON.parse(localStorage.getItem(recentSearchKey) ?? "[]");
      return Array.isArray(saved) ? saved.slice(0, 6) : [];
    } catch {
      return [];
    }
  });
  const panelRef = useRef<HTMLDivElement | null>(null);
  const searchButtonRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const whatsappMessage = encodeURIComponent(
    "Hello! I would like to order on WhatsApp."
  );

  useEffect(() => {
    if (!searchOpen) return;

    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 80);

    return () => clearTimeout(timer);
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;

    const handleKeydown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        setSearchOpen(false);
        return;
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedOutsidePanel = panelRef.current && !panelRef.current.contains(target);
      const clickedTrigger = searchButtonRef.current && searchButtonRef.current.contains(target);

      if (clickedOutsidePanel && !clickedTrigger) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [searchOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const shouldLock = searchOpen && window.innerWidth < 768;
    document.body.style.overflow = shouldLock ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  const trimmedQuery = query.trim();
  const liveResults = useMemo(() => {
    if (!trimmedQuery) return [];
    return searchProducts(trimmedQuery, products).slice(0, 5);
  }, [trimmedQuery]);

  const featuredSuggestions = useMemo(() => getFeaturedSearchSuggestions(products).slice(0, 4), []);

  const persistRecentSearches = (nextSearches: string[]) => {
    setRecentSearches(nextSearches);
    if (typeof window !== "undefined") {
      localStorage.setItem(recentSearchKey, JSON.stringify(nextSearches));
    }
  };

  const addRecentSearch = (term: string) => {
    const value = term.trim();
    if (!value) return;

    persistRecentSearches([
      value,
      ...recentSearches.filter((item) => item.toLowerCase() !== value.toLowerCase()),
    ].slice(0, 6));
  };

  const handleSubmitSearch = (value: string) => {
    const nextQuery = value.trim();
    if (!nextQuery) return;

    addRecentSearch(nextQuery);
    setQuery(nextQuery);
    setSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(nextQuery)}`);
  };

  const handleSelectProduct = (productId: string, productName: string) => {
    const selectedProduct = products.find((product) => product.id === productId || getProductSlug(product) === productId);
    addRecentSearch(productName);
    setSearchOpen(false);
    router.push(`/product/${selectedProduct ? getProductSlug(selectedProduct) : productId}`);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (liveResults.length === 0) return;
      setHighlightedIndex((current) => Math.min(current + 1, liveResults.length - 1));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (liveResults.length === 0) return;
      setHighlightedIndex((current) => Math.max(current - 1, 0));
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();

      if (liveResults.length > 0 && highlightedIndex >= 0 && highlightedIndex < liveResults.length) {
        const selectedProduct = liveResults[highlightedIndex];
        handleSelectProduct(getProductSlug(selectedProduct), selectedProduct.name);
        return;
      }

      handleSubmitSearch(query);
    }
  };

  const handlePopularSearchClick = (term: string) => {
    addRecentSearch(term);
    setQuery(term);
    setHighlightedIndex(-1);
  };

  const viewAllHref = trimmedQuery ? `/search?q=${encodeURIComponent(trimmedQuery)}` : "/shop";

  const handleViewAll = () => {
    if (trimmedQuery) {
      addRecentSearch(trimmedQuery);
      setSearchOpen(false);
      router.push(viewAllHref);
      return;
    }

    setSearchOpen(false);
    router.push("/shop");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#e9dfcf] bg-[#faf8f3]/80 text-[#1d1d1f] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" onClick={() => setSearchOpen(false)} className="flex items-center gap-2" aria-label="Smells From Heaven home">
          <span className="relative h-7 w-7 overflow-hidden rounded-md border border-[#eadfc5] bg-white shadow-[0_6px_16px_rgba(17,17,17,0.04)]">
            <Image src="/logo.png" alt="" fill sizes="28px" className="object-cover" priority />
          </span>
          <span className="hidden text-[11px] font-semibold uppercase tracking-[0.14em] text-[#111111] sm:inline">Smells From Heaven</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setSearchOpen(false)}
              className="luxury-link text-[11px] font-medium uppercase tracking-[0.16em] text-[#4d4d4d] transition-colors hover:text-[#b88932]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1" aria-label="Global search and shopping actions">
          <button
            ref={searchButtonRef}
            type="button"
            aria-label="Search perfumes"
            aria-expanded={searchOpen}
            aria-controls="global-search-panel"
            onClick={() => setSearchOpen((value) => !value)}
            className={[
              "flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-[#4d4d4d] transition-all hover:border-[#eadfc5] hover:bg-[#fffdf9] hover:text-[#111111]",
              searchOpen ? "border-[#eadfc5] bg-[#fffdf9] text-[#111111]" : "",
            ].join(" ")}
          >
            <Search size={17} />
          </button>
          <Link
            href="/wishlist"
            onClick={() => setSearchOpen(false)}
            aria-label="Wishlist"
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-transparent text-[#4d4d4d] transition-all hover:border-[#eadfc5] hover:bg-[#fffdf9] hover:text-[#111111] sm:flex"
          >
            <Heart size={17} />
          </Link>
          <Link
            href="/cart"
            onClick={() => setSearchOpen(false)}
            aria-label={`Cart${cartCount > 0 ? `, ${cartCount} item${cartCount === 1 ? "" : "s"}` : ""}`}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-[#4d4d4d] transition-all hover:border-[#eadfc5] hover:bg-[#fffdf9] hover:text-[#111111]"
          >
            <ShoppingBag size={17} />
            {cartCount > 0 && (
              <span className="absolute right-0 top-0 flex min-w-[16px] translate-x-1/4 -translate-y-1/4 items-center justify-center rounded-full bg-[#111111] px-1 text-[9px] font-semibold leading-4 text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
          <a
            aria-label="Order on WhatsApp"
            href={`https://wa.me/${orderConfig.whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-[#4d4d4d] transition-all hover:border-[#eadfc5] hover:bg-[#fffdf9] hover:text-[#111111]"
          >
            <MessageCircle size={17} />
          </a>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen((value) => !value)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-[#4d4d4d] transition-all hover:border-[#eadfc5] hover:bg-[#fffdf9] hover:text-[#111111] lg:hidden"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-black/10 bg-white lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-1 px-4 py-4" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-2 py-3 text-2xl font-semibold text-[#1d1d1f] hover:bg-[#f5f5f7]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {searchOpen && (
        <div className="pointer-events-none absolute inset-x-0 top-full z-[60] flex justify-center px-3 pb-4 pt-2 sm:px-4">
          <div
            id="global-search-panel"
            ref={panelRef}
            className="search-panel-enter pointer-events-auto w-full max-w-[760px] overflow-hidden rounded-[28px] border border-[#eae0d1] bg-[#fffdf9] shadow-[0_24px_80px_rgba(17,17,17,0.08)]"
          >
            <div className="flex items-center gap-3 border-b border-[#efe5d2] bg-[#fffdf9] px-4 py-3 sm:px-5">
              <Search size={18} className="text-[#6e6e73]" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setHighlightedIndex(-1);
                }}
                onKeyDown={handleInputKeyDown}
                placeholder="Search perfumes, notes, collections..."
                aria-label="Search perfumes, notes, and collections"
                className="w-full border-0 bg-transparent text-sm text-[#1d1d1f] placeholder:text-[#6e6e73] focus:outline-none sm:text-base"
              />
              <button
                type="button"
                aria-label="Close search"
                onClick={() => setSearchOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#6e6e73] transition-colors hover:bg-black/5 hover:text-[#1d1d1f]"
              >
                <X size={17} />
              </button>
            </div>

            {!trimmedQuery ? (
              <div className="space-y-5 px-4 py-4 sm:px-5 sm:py-5">
                {recentSearches.length > 0 && (
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6e6e73]">
                        Recent Searches
                      </p>
                      <button
                        type="button"
                        onClick={() => persistRecentSearches([])}
                        className="text-[11px] font-medium text-[#1d1d1f]/75 hover:text-[#1d1d1f]"
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => handlePopularSearchClick(term)}
                          className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-[#f5f5f7] px-3 py-1.5 text-sm text-[#1d1d1f] transition-colors hover:border-black/20 hover:bg-white"
                        >
                          <Clock3 size={13} className="text-[#6e6e73]" />
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6e6e73]">
                    Popular Searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.slice(0, 8).map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => handlePopularSearchClick(term)}
                        className="rounded-full border border-black/10 bg-[#f5f5f7] px-3 py-1.5 text-sm text-[#1d1d1f] transition-colors hover:border-black/20 hover:bg-white"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <Sparkles size={15} className="text-[#bf4800]" />
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6e6e73]">
                      Top Suggestions
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {featuredSuggestions.map((product) => (
                      <button
                        type="button"
                        key={product.id}
                        onClick={() => handleSelectProduct(product.id, product.name)}
                        className="flex items-center gap-3 rounded-2xl border border-black/10 bg-[#f5f5f7] p-2 text-left transition-colors hover:bg-white"
                      >
                        <div className="relative h-18 w-16 overflow-hidden rounded-xl bg-white">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            sizes="64px"
                            className="object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium text-[#1d1d1f]">{product.name}</div>
                          <div className="mt-1 truncate text-xs text-[#6e6e73]">
                            Inspired by {product.brand}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-h-[70vh] overflow-y-auto px-4 py-3 sm:px-5">
                {liveResults.length > 0 ? (
                  <div className="space-y-2">
                    {liveResults.map((product, index) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => handleSelectProduct(product.id, product.name)}
                        className={[
                          "flex w-full items-center gap-3 rounded-2xl border px-2 py-2 text-left transition-colors",
                          index === highlightedIndex
                            ? "border-[#b88a3b]/25 bg-[#f8f1e6]"
                            : "border-transparent bg-transparent hover:bg-[#f8f1e6]",
                        ].join(" ")}
                        aria-label={`View product ${product.name}`}
                      >
                        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-[#f5f5f7]">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            sizes="56px"
                            className="object-contain"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium text-[#1d1d1f]">{product.name}</div>
                          <div className="truncate text-xs text-[#6e6e73]">
                            Inspired by {product.brand}
                          </div>
                          <div className="mt-1 flex flex-wrap gap-1 text-[10px] uppercase tracking-[0.12em] text-[#6e6e73]">
                            {product.fragranceFamily && <span>{product.fragranceFamily}</span>}
                            {product.mainAccords?.slice(0, 2).map((accord) => (
                              <span key={accord.name}>· {accord.name}</span>
                            ))}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-black/10 bg-[#f5f5f7] p-5 text-center">
                    <h3 className="text-xl font-semibold text-[#1d1d1f]">No fragrances found</h3>
                    <p className="mt-2 text-sm text-[#6e6e73]">
                      Try searching for: Oud, Vanilla, Woody, Fresh, Floral
                    </p>
                    <button
                      type="button"
                      onClick={() => handleSubmitSearch(trimmedQuery)}
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#1d1d1f] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2e2e2e]"
                    >
                      View all fragrances <ArrowRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="border-t border-black/10 px-4 py-3 sm:px-5">
              <button
                type="button"
                onClick={handleViewAll}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-black/10 bg-[#1d1d1f] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#2e2e2e]"
              >
                View all results <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
