"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { faqs } from "@/lib/data";

const categories = ["All", "Shipping", "Returns", "WhatsApp Orders", "Products", "Account"];

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <section className="pt-10 sm:pt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#bf4800]">
              Help Centre
            </p>
            <h1 className="mt-3 font-[var(--font-playfair)] text-4xl font-bold tracking-[-0.05em] text-[#1d1d1f] sm:text-5xl">
              Frequently Asked Questions
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#6e6e73] sm:text-lg">
              Everything you need to know about our products, orders and support.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="relative mx-auto max-w-xl">
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8c8c90]" />
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-[#e5e5e5] bg-[#f5f5f7] py-3 pl-12 pr-4 text-sm text-[#1d1d1f] placeholder:text-[#8c8c90] transition-colors focus:border-[#0066cc] focus:outline-none"
            aria-label="Search FAQs"
          />
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "border-[#0066cc] bg-[#0066cc] text-white"
                  : "border-[#e5e5e5] bg-white text-[#4b4b4f] hover:border-[#0066cc] hover:text-[#0066cc]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-[#e5e5e5] bg-[#f5f5f7] py-12 text-center text-[#6e6e73]">
              <Search size={36} className="mx-auto mb-3 text-[#8c8c90]" />
              <p className="text-base text-[#1d1d1f]">No questions found for &quot;{search}&quot;</p>
            </div>
          ) : (
            filtered.map((faq, i) => (
              <div
                key={i}
                className={`overflow-hidden rounded-xl border bg-[#f5f5f7] transition-all duration-200 ${
                  openIndex === i ? "border-[#d9d9dc] shadow-[0_10px_22px_rgba(0,0,0,0.03)]" : "border-[#e5e5e5]"
                }`}
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  aria-expanded={openIndex === i}
                >
                  <span className="pr-4 text-sm font-semibold text-[#1d1d1f] sm:text-base">
                    {faq.question}
                  </span>
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white text-[#0066cc] ring-1 ring-[#e5e5e5]">
                    {openIndex === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </button>
                {openIndex === i && (
                  <div className="border-t border-[#e5e5e5] px-5 pb-5 pt-4">
                    <p className="text-sm leading-7 text-[#6e6e73]">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="mt-12 rounded-2xl border border-[#e5e5e5] bg-[#f5f5f7] p-6 text-center">
          <p className="text-base font-bold text-[#1d1d1f]">Still have questions?</p>
          <p className="mt-1 text-sm text-[#6e6e73]">Our support team is available Mon–Sat, 9 AM – 7 PM IST</p>
          <a
            href="/contact"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0066cc] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0077ed]"
          >
            Contact Support
            <ChevronDown size={16} className="rotate-[-90deg]" />
          </a>
        </div>
      </div>
    </div>
  );
}
