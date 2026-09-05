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
  { label: "About", href: "/about" },
  { label: "Support", href: "/faq" },
];

const recentSearchKey = "smells-recent-searches";

export default function Navbar() {
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce(
  (total, item) =>
    total +
    Number(
      (item as unknown as { quantity?: number | string }).quantity ?? 0
    ),
  0
);
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
    <header className="sticky top-0 z-50 border-b border-[#1c2540]/[0.08] bg-[#fffdf7]/90 text-[#1c2540] backdrop-blur-xl shadow-[0_4px_24px_rgba(28,37,64,0.035)]">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 sm:px-7 lg:px-8">
        <Link
          href="/"
          onClick={() => setSearchOpen(false)}
          className="group flex shrink-0 items-center gap-2.5 pr-3 transition-transform duration-300 hover:scale-[1.01] sm:gap-3 lg:pr-6"
          aria-label="Smells From Heaven home"
        >
          <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[#d9bf7d]/80 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.98),rgba(250,248,243,0.97)_38%,rgba(232,214,180,0.92)_100%)] shadow-[0_8px_22px_rgba(17,17,17,0.06)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-[1.06] group-hover:shadow-[0_12px_28px_rgba(184,138,59,0.18)] sm:h-12 sm:w-12">
            <span className="absolute inset-[10%] rounded-full border border-white/60" aria-hidden="true" />
            <span className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,rgba(255,255,255,0.8),transparent_42%,rgba(184,138,59,0.18)_100%)]" aria-hidden="true" />
            <Image src="/logo.png" alt="" fill sizes="44px" className="relative z-10 object-cover transition-transform duration-300 group-hover:scale-[1.04]" priority />
          </span>
          <span className="brand-wordmark-shell hidden xs:block">
            <span className="navbar-brand-wordmark whitespace-nowrap text-[0.68rem] font-semibold tracking-[0.18em] text-[#b88932] sm:text-[0.76rem] lg:text-[0.84rem]">
              SMELLS FROM HEAVEN
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-9 lg:flex xl:gap-11" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setSearchOpen(false)}
              className="luxury-link relative py-2 text-[11px] font-semibold uppercase tracking-[0.19em] text-[#1c2540]/65 transition-colors duration-300 hover:text-[#b88932] after:absolute after:bottom-0 after:left-1/2 after:h-px after:w-0 after:-translate-x-1/2 after:bg-[#b88932] after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-0.5 sm:gap-1" aria-label="Global search and shopping actions">
          <button
            ref={searchButtonRef}
            type="button"
            aria-label="Search perfumes"
            aria-expanded={searchOpen}
            aria-controls="global-search-panel"
            onClick={() => setSearchOpen((value) => !value)}
            className={[
              "flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-[#1c2540]/65 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#1c2540]/10 hover:bg-[#fffdf7] hover:text-[#b88932] hover:shadow-[0_5px_14px_rgba(28,37,64,0.07)]",
              searchOpen ? "border-[#eadfc5] bg-[#fffdf9] text-[#111111]" : "",
            ].join(" ")}
          >
            <Search size={17} />
          </button>
          <Link
            href="/wishlist"
            onClick={() => setSearchOpen(false)}
            aria-label="Wishlist"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-transparent text-[#1c2540]/65 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#1c2540]/10 hover:bg-[#fffdf7] hover:text-[#b88932] hover:shadow-[0_5px_14px_rgba(28,37,64,0.07)] sm:flex"
          >
            <Heart size={17} />
          </Link>
          <Link
            href="/cart"
            onClick={() => setSearchOpen(false)}
            aria-label={`Cart${cartCount > 0 ? `, ${cartCount} item${cartCount === 1 ? "" : "s"}` : ""}`}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-[#1c2540]/65 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#1c2540]/10 hover:bg-[#fffdf7] hover:text-[#b88932] hover:shadow-[0_5px_14px_rgba(28,37,64,0.07)]"
          >
            <ShoppingBag size={17} />
            {cartCount > 0 && (
              <span className="absolute right-0 top-0 flex min-w-[17px] translate-x-1/4 -translate-y-1/4 items-center justify-center rounded-full bg-[#b88932] px-1 text-[9px] font-bold leading-4 text-white shadow-sm">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
          <a
            aria-label="Order on WhatsApp"
            href={`https://wa.me/${orderConfig.whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-[#1c2540]/65 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#1c2540]/10 hover:bg-[#fffdf7] hover:text-[#b88932] hover:shadow-[0_5px_14px_rgba(28,37,64,0.07)]"
          >
            <MessageCircle size={17} />
          </a>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-[#1c2540]/65 transition-all duration-300 hover:border-[#1c2540]/10 hover:bg-[#fffdf7] hover:text-[#b88932] lg:hidden"
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
        <div className="pointer-events-none absolute inset-x-0 top-full z-[60] flex justify-center px-2 pb-5 pt-3 sm:px-4">
          <div
            id="global-search-panel"
            ref={panelRef}
            className="search-panel-enter pointer-events-auto relative w-full max-w-[920px] overflow-hidden border border-[#1c2540]/10 bg-[#f7f0e4] shadow-[10px_12px_0_rgba(28,37,64,0.10),0_28px_70px_rgba(17,17,17,0.14)]"
          >
            {/* Scrapbook atmosphere */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -left-20 top-16 h-44 w-44 rounded-full bg-[#bfe1ec]/55 blur-3xl" />
              <div className="absolute right-[-30px] top-[-30px] h-52 w-52 rounded-full bg-[#f3c7d3]/45 blur-3xl" />
              <div
                className="absolute inset-0 opacity-[0.045]"
                style={{
                  backgroundImage:
                    "radial-gradient(#1c2540 0.65px, transparent 0.65px)",
                  backgroundSize: "16px 16px",
                }}
              />
            </div>

            <div className="relative">
              {/* Search input */}
              <div className="relative border-b border-[#1c2540]/10 bg-[#fffdf7] px-4 py-4 sm:px-6 sm:py-5">
                <div className="absolute -top-2 left-[12%] h-5 w-24 rotate-[-2deg] bg-[#f3c7d3]/80" />
                <div className="absolute -top-2 right-[16%] hidden h-5 w-20 rotate-[3deg] bg-[#bfe1ec]/75 sm:block" />

                <div className="flex items-center gap-3 border-2 border-[#b88932]/60 bg-[#fffdf7] px-3 py-2 shadow-[3px_4px_0_rgba(184,137,50,0.10)]">
                  <Search size={20} className="shrink-0 text-[#1c2540]/55" />
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
                    className="w-full border-0 bg-transparent py-1 text-base text-[#1c2540] placeholder:text-[#1c2540]/40 focus:outline-none sm:text-lg"
                  />
                  <button
                    type="button"
                    aria-label="Close search"
                    onClick={() => setSearchOpen(false)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#1c2540]/50 transition-all hover:rotate-90 hover:bg-[#f7f0e4] hover:text-[#1c2540]"
                  >
                    <X size={19} />
                  </button>
                </div>

                <div className="mt-2 flex items-center justify-between px-1">
                  <span className="font-[Caveat,cursive] text-sm text-[#1c2540]/50">
                    type a note, mood, name or memory...
                  </span>
                  <span className="hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1c2540]/35 sm:block">
                    press enter ↵
                  </span>
                </div>
              </div>

              {!trimmedQuery ? (
                <div className="relative space-y-7 px-4 py-5 sm:px-7 sm:py-6">
                  {/* Recent */}
                  {recentSearches.length > 0 && (
                    <div>
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="font-[Caveat,cursive] text-lg text-[#1c2540]/55">
                            little things you searched for...
                          </p>
                          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1c2540]/60">
                            Recent Searches
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => persistRecentSearches([])}
                          className="rounded-full border border-[#1c2540]/10 bg-[#fffdf7] px-3 py-1.5 text-[11px] font-semibold text-[#1c2540]/60 transition-colors hover:bg-[#fff6c9]"
                        >
                          Clear all
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2.5">
                        {recentSearches.map((term, index) => {
                          const papers = ["#fffdf7", "#fff6c9", "#d9cdec", "#f3c7d3", "#cfe6cf", "#bfe1ec"];
                          const rotations = ["-rotate-1", "rotate-1", "-rotate-2", "rotate-2", "-rotate-1", "rotate-1"];

                          return (
                            <button
                              key={term}
                              type="button"
                              onClick={() => handlePopularSearchClick(term)}
                              className={`relative inline-flex items-center gap-2 border border-[#1c2540]/10 px-3.5 py-2 text-sm text-[#1c2540] shadow-[3px_4px_0_rgba(28,37,64,0.07)] transition-all hover:-translate-y-1 hover:rotate-0 ${rotations[index % rotations.length]}`}
                              style={{ backgroundColor: papers[index % papers.length] }}
                            >
                              <span className="absolute -top-1.5 left-4 h-3 w-9 rotate-[-2deg] bg-[#fffdf7]/70" />
                              <Clock3 size={13} className="relative text-[#1c2540]/50" />
                              <span className="relative">{term}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Popular */}
                  <div>
                    <div className="mb-3">
                      <p className="font-[Caveat,cursive] text-lg text-[#1c2540]/55">
                        everyone is sniffing these lately ✦
                      </p>
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1c2540]/60">
                        Popular Searches
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      {popularSearches.slice(0, 8).map((term, index) => {
                        const papers = ["#bfe1ec", "#fff6c9", "#f3c7d3", "#cfe6cf", "#d9cdec", "#fffdf7", "#f3c7d3", "#bfe1ec"];
                        const rotations = ["rotate-1", "-rotate-1", "rotate-2", "-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "-rotate-1"];

                        return (
                          <button
                            key={term}
                            type="button"
                            onClick={() => handlePopularSearchClick(term)}
                            className={`relative border border-[#1c2540]/10 px-4 py-2 text-sm text-[#1c2540] shadow-[2px_3px_0_rgba(28,37,64,0.06)] transition-all hover:-translate-y-1 hover:rotate-0 ${rotations[index]}`}
                            style={{ backgroundColor: papers[index] }}
                          >
                            {term}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Top suggestions */}
                  <div>
                    <div className="mb-4 flex items-end justify-between gap-4">
                      <div>
                        <p className="font-[Caveat,cursive] text-xl text-[#b88932]">
                          picked for you ♡
                        </p>
                        <div className="flex items-center gap-2">
                          <Sparkles size={15} className="text-[#b88932]" />
                          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1c2540]/60">
                            Top Suggestions
                          </p>
                        </div>
                      </div>
                      <span className="hidden rotate-2 rounded-sm bg-[#fff6c9] px-3 py-1 font-[Caveat,cursive] text-sm text-[#1c2540]/65 shadow-[2px_3px_0_rgba(28,37,64,0.06)] sm:block">
                        a tiny shelf of heaven ✦
                      </span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {featuredSuggestions.map((product, index) => {
                        const papers = ["#fffdf7", "#fff6c9", "#d9cdec", "#cfe6cf"];

                        return (
                          <button
                            type="button"
                            key={product.id}
                            onClick={() => handleSelectProduct(product.id, product.name)}
                            className={`group relative flex items-center gap-3 border border-[#1c2540]/10 p-2.5 text-left shadow-[4px_5px_0_rgba(28,37,64,0.07)] transition-all hover:-translate-y-1 hover:rotate-0 ${
                              index % 2 === 0 ? "-rotate-1" : "rotate-1"
                            }`}
                            style={{ backgroundColor: papers[index % papers.length] }}
                          >
                            <div className="absolute -top-2 left-8 h-4 w-12 rotate-[-2deg] bg-[#f3c7d3]/75" />
                            <div className="relative h-20 w-16 shrink-0 overflow-hidden border border-[#1c2540]/10 bg-white shadow-[2px_3px_0_rgba(28,37,64,0.05)]">
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                sizes="64px"
                                className="object-contain p-1"
                              />
                            </div>

                            <div className="min-w-0 flex-1 py-1">
                              <div className="truncate font-serif text-base text-[#1c2540]">
                                {product.name}
                              </div>
                              <div className="mt-1 truncate font-[Caveat,cursive] text-base text-[#1c2540]/55">
                                inspired by {product.brand}
                              </div>
                              <div className="mt-2 flex flex-wrap gap-1 text-[9px] font-semibold uppercase tracking-[0.10em] text-[#1c2540]/45">
                                {product.fragranceFamily && <span>{product.fragranceFamily}</span>}
                                {product.mainAccords?.slice(0, 2).map((accord) => (
                                  <span key={accord.name}>· {accord.name}</span>
                                ))}
                              </div>
                            </div>

                            <ArrowRight className="mr-1 h-4 w-4 shrink-0 text-[#1c2540]/35 transition-transform group-hover:translate-x-1" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative max-h-[62vh] overflow-y-auto px-4 py-4 sm:px-7">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-[Caveat,cursive] text-lg text-[#1c2540]/55">
                      matching memories for “{trimmedQuery}” ✦
                    </p>
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#1c2540]/35">
                      {liveResults.length} matches
                    </span>
                  </div>

                  {liveResults.length > 0 ? (
                    <div className="space-y-2.5">
                      {liveResults.map((product, index) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => handleSelectProduct(product.id, product.name)}
                          className={[
                            "group relative flex w-full items-center gap-3 border p-2.5 text-left shadow-[3px_4px_0_rgba(28,37,64,0.05)] transition-all hover:-translate-y-0.5",
                            index === highlightedIndex
                              ? "border-[#b88932]/45 bg-[#fff6c9]"
                              : "border-[#1c2540]/10 bg-[#fffdf7] hover:bg-[#fff6c9]",
                          ].join(" ")}
                          aria-label={`View product ${product.name}`}
                        >
                          <div className="absolute -top-1.5 left-8 h-3 w-10 rotate-[-2deg] bg-[#bfe1ec]/65" />
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden border border-[#1c2540]/10 bg-white">
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              sizes="56px"
                              className="object-contain p-1"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="truncate font-serif text-base text-[#1c2540]">
                              {product.name}
                            </div>
                            <div className="truncate font-[Caveat,cursive] text-sm text-[#1c2540]/55">
                              inspired by {product.brand}
                            </div>
                            <div className="mt-1 flex flex-wrap gap-1 text-[9px] font-semibold uppercase tracking-[0.11em] text-[#1c2540]/45">
                              {product.fragranceFamily && <span>{product.fragranceFamily}</span>}
                              {product.mainAccords?.slice(0, 2).map((accord) => (
                                <span key={accord.name}>· {accord.name}</span>
                              ))}
                            </div>
                          </div>

                          <ArrowRight className="mr-1 h-4 w-4 shrink-0 text-[#1c2540]/30 transition-transform group-hover:translate-x-1" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="border border-[#1c2540]/10 bg-[#fffdf7] p-7 text-center shadow-[4px_5px_0_rgba(28,37,64,0.06)]">
                      <div className="mx-auto mb-3 flex h-12 w-12 rotate-[-4deg] items-center justify-center bg-[#f3c7d3]">
                        <Search size={20} />
                      </div>
                      <p className="font-[Caveat,cursive] text-xl text-[#1c2540]/55">
                        this scent is playing hide & seek...
                      </p>
                      <h3 className="mt-1 font-serif text-xl text-[#1c2540]">
                        No fragrances found
                      </h3>
                      <p className="mt-2 text-xs leading-5 text-[#1c2540]/55">
                        Try Oud, Vanilla, Woody, Fresh, or Floral.
                      </p>
                      <button
                        type="button"
                        onClick={() => handleSubmitSearch(trimmedQuery)}
                        className="mt-4 inline-flex items-center gap-2 bg-[#1c2540] px-5 py-2.5 text-xs font-semibold text-white transition-transform hover:-translate-y-0.5"
                      >
                        Search this anyway <ArrowRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="relative border-t border-[#1c2540]/10 bg-[#fffdf7] px-4 py-4 sm:px-7">
                <button
                  type="button"
                  onClick={handleViewAll}
                  className="group flex w-full items-center justify-center gap-3 bg-[#1c2540] px-5 py-3.5 text-sm font-semibold text-white shadow-[4px_4px_0_rgba(28,37,64,0.16)] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_rgba(28,37,64,0.16)]"
                >
                  {trimmedQuery ? "View all search results" : "Explore all fragrances"}
                  <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                </button>
                <p className="mt-2 text-center font-[Caveat,cursive] text-sm text-[#1c2540]/40">
                  every search is a little step closer to your signature scent ♡
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
