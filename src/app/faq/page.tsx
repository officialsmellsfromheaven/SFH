"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, Search, Sparkles, Package, RotateCcw, MessageCircle, ShieldCheck, UserRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
    <div className="relative min-h-screen overflow-hidden bg-[#f7f0e4] text-[#1c2540]">
      {/* Heaven / scrapbook atmosphere */}
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-[#bfe1ec]/45 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-[34rem] h-96 w-96 rounded-full bg-[#f3c7d3]/40 blur-3xl" />
      <div className="pointer-events-none absolute left-1/3 top-[72rem] h-72 w-72 rounded-full bg-[#d9cdec]/35 blur-3xl" />

      {/* HERO */}
      <section className="relative px-4 pb-10 pt-12 sm:px-6 sm:pb-14 sm:pt-16">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="relative mx-auto max-w-4xl text-center"
          >
            <div className="absolute left-1/2 top-0 h-8 w-28 -translate-x-1/2 rotate-[-3deg] bg-[#fff0a8]/80 shadow-sm" />

            <p
              className="relative text-2xl font-semibold text-[#7d6a4e] sm:text-3xl"
              style={{ fontFamily: '"CaveatLocal", cursive' }}
            >
              need a little help from heaven? ✦
            </p>

            <p className="mt-5 inline-flex rotate-[-1deg] border border-[#e7d9b3] bg-[#fff6c9] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#7b6833] shadow-[3px_4px_0_rgba(28,37,64,0.05)]">
              HELP CENTRE
            </p>

            <h1 className="mt-5 font-[var(--font-playfair)] text-4xl font-semibold leading-[0.92] tracking-[-0.06em] text-[#1c2540] sm:text-6xl">
              Questions?
              <span className="block text-[#b88932]">We&apos;ve got you.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#5e6675] sm:text-lg">
              Everything you need to know about our products, orders and support—kept simple,
              just like finding your perfect scent.
            </p>

            <p
              className="mt-5 text-xl text-[#718095]"
              style={{ fontFamily: '"CaveatLocal", cursive' }}
            >
              no silly questions. only helpful answers. ♡
            </p>
          </motion.div>

          {/* Support scrapbook notes */}
          <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: Package, label: "Orders", tone: "bg-[#e9f4f5] text-[#456875] rotate-[-2deg]" },
              { icon: RotateCcw, label: "Returns", tone: "bg-[#fae9ef] text-[#7a5361] rotate-[2deg]" },
              { icon: MessageCircle, label: "WhatsApp", tone: "bg-[#edf7ed] text-[#55705a] rotate-[-1deg]" },
              { icon: ShieldCheck, label: "Products", tone: "bg-[#f0ebf8] text-[#665878] rotate-[2deg]" },
            ].map(({ icon: Icon, label, tone }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 14, rotate: index % 2 ? 4 : -4 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ delay: 0.12 + index * 0.07, duration: 0.4 }}
                className={`border border-[#d8cdbd] p-4 text-center shadow-[4px_5px_0_rgba(28,37,64,0.05)] ${tone}`}
              >
                <Icon size={20} className="mx-auto mb-2" />
                <span className="text-sm font-semibold">{label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="relative mx-auto max-w-4xl px-4 pb-16 sm:px-6 sm:pb-20">
        {/* SEARCH */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.45 }}
          className="relative mx-auto max-w-2xl"
        >
          <div className="absolute -right-2 -top-4 z-10 rotate-[4deg] border border-[#d8cdbd] bg-[#f3c7d3] px-3 py-1.5 text-base text-[#765966] shadow-[3px_4px_0_rgba(28,37,64,0.05)]" style={{ fontFamily: '"CaveatLocal", cursive' }}>
            type it here ✎
          </div>

          <div className="border border-[#d8cdbd] bg-[#fffdf7] p-3 shadow-[6px_7px_0_rgba(28,37,64,0.06)]">
            <div className="relative">
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8b96a8]" />
              <input
                type="text"
                placeholder="Search questions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-[#ded4c5] bg-[#f5efe4] py-3.5 pl-12 pr-4 text-sm text-[#1c2540] placeholder:text-[#8b96a8] transition-colors focus:border-[#b88932] focus:bg-white focus:outline-none"
                aria-label="Search FAQs"
              />
            </div>
          </div>
        </motion.div>

        {/* CATEGORIES */}
        <div className="mt-9 flex flex-wrap justify-center gap-2.5">
          {categories.map((cat, index) => (
            <motion.button
              key={cat}
              type="button"
              onClick={() => {
                setActiveCategory(cat);
                setOpenIndex(null);
              }}
              whileHover={{ y: -2, rotate: index % 2 ? 1 : -1 }}
              whileTap={{ scale: 0.97 }}
              className={`border px-4 py-2.5 text-sm font-semibold shadow-[3px_4px_0_rgba(28,37,64,0.04)] transition-all ${
                activeCategory === cat
                  ? "rotate-[-1deg] border-[#1c2540] bg-[#1c2540] text-white"
                  : "border-[#d8cdbd] bg-[#fffdf7] text-[#526078] hover:border-[#b88932] hover:text-[#1c2540]"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* FAQ LIST */}
        <div className="mt-9">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xl text-[#7d6a4e]" style={{ fontFamily: '"CaveatLocal", cursive' }}>
                little answers, big peace of mind ✦
              </p>
              <h2 className="mt-1 font-[var(--font-playfair)] text-2xl font-semibold tracking-[-0.04em] text-[#1c2540] sm:text-3xl">
                Frequently asked
              </h2>
            </div>
            <Sparkles size={22} className="mb-1 shrink-0 text-[#b88932]" />
          </div>

          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="border border-[#d8cdbd] bg-[#fffdf7] px-6 py-14 text-center shadow-[5px_6px_0_rgba(28,37,64,0.05)]"
              >
                <Search size={34} className="mx-auto mb-4 text-[#9aa3b1]" />
                <p className="text-base font-semibold text-[#1c2540]">
                  No questions found for &quot;{search}&quot;
                </p>
                <p className="mt-2 text-sm text-[#718095]">
                  Try another keyword or choose a different category.
                </p>
              </motion.div>
            ) : (
              filtered.map((faq, i) => {
                const isOpen = openIndex === i;

                return (
                  <motion.div
                    key={`${faq.question}-${i}`}
                    layout
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className={`mb-4 overflow-hidden border transition-all duration-300 ${
                      isOpen
                        ? "border-[#cbbd9e] bg-[#fffdf7] shadow-[6px_7px_0_rgba(28,37,64,0.07)]"
                        : "border-[#d8cdbd] bg-[#f1eadf] shadow-[3px_4px_0_rgba(28,37,64,0.04)]"
                    } ${i % 3 === 0 ? "rotate-[-0.35deg]" : i % 3 === 1 ? "rotate-[0.25deg]" : ""}`}
                  >
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      aria-expanded={isOpen}
                    >
                      <span className="pr-4 text-sm font-semibold leading-6 text-[#1c2540] sm:text-base">
                        {faq.question}
                      </span>

                      <span
                        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center border transition-all ${
                          isOpen
                            ? "rotate-0 border-[#b88932] bg-[#fff6c9] text-[#8a6a2a]"
                            : "rotate-[-2deg] border-[#d8cdbd] bg-[#fffdf7] text-[#66738a]"
                        }`}
                      >
                        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="border-t border-[#e3d9c9] px-5 pb-6 pt-4 sm:px-6">
                            <div className="border-l-2 border-[#b88932] pl-4">
                              <p className="text-sm leading-7 text-[#5e6675] sm:text-base">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* CONTACT SUPPORT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="relative mt-14 border border-[#d8cdbd] bg-[#fffdf7] p-7 text-center shadow-[7px_8px_0_rgba(28,37,64,0.06)] sm:p-9"
        >
          <div className="absolute -left-2 -top-4 h-8 w-24 rotate-[-4deg] bg-[#bfe1ec]/80 shadow-sm" />
          <div className="absolute -right-2 bottom-5 h-8 w-24 rotate-[4deg] bg-[#cfe6cf]/75 shadow-sm" />

          <div className="mx-auto flex h-12 w-12 rotate-[-3deg] items-center justify-center border border-[#d8cdbd] bg-[#f0ebf8] text-[#665878]">
            <UserRound size={21} />
          </div>

          <p className="mt-5 text-2xl text-[#7d6a4e]" style={{ fontFamily: '"CaveatLocal", cursive' }}>
            still wondering? just say hello ♡
          </p>

          <h3 className="mt-1 font-[var(--font-playfair)] text-3xl font-semibold tracking-[-0.05em] text-[#1c2540]">
            Still have questions?
          </h3>

          <p className="mt-3 text-sm leading-7 text-[#6b7484] sm:text-base">
            Our support team is available Mon–Sat, 9 AM – 7 PM IST.
          </p>

          <a
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 border-2 border-[#1c2540] bg-[#1c2540] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[4px_5px_0_rgba(28,37,64,0.10)] transition-all hover:-translate-y-1 hover:bg-[#27324f]"
          >
            Contact Support
            <ChevronDown size={16} className="rotate-[-90deg]" />
          </a>
        </motion.div>
      </div>
    </div>
  )
};
