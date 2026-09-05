"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, ShieldCheck, MessageCircleMore, Truck, RotateCcw, BadgeDollarSign } from "lucide-react";

const footerLinks = {
  Shop: [
    { label: "Men's Collection", href: "/shop?gender=men" },
    { label: "Women's Collection", href: "/shop?gender=women" },
    { label: "Unisex", href: "/shop?gender=unisex" },
    { label: "Attars", href: "/shop?category=attar" },
    { label: "New Arrivals", href: "/shop?filter=new" },
    { label: "Best Sellers", href: "/shop?filter=bestseller" },
  ],
  Discover: [
    { label: "Collections", href: "/collections" },
    { label: "Fragrance Finder", href: "/fragrance-finder" },
    { label: "Blog", href: "/blog" },
    { label: "About Us", href: "/about" },
    { label: "The Experience", href: "/offers" },
  ],
  Support: [
    { label: "Contact Us", href: "/contact" },
    { label: "FAQs", href: "/faq" },
    { label: "Track Order", href: "/track-order" },
    { label: "Return Policy", href: "/faq" },
    { label: "Shipping Policy", href: "/faq" },
    { label: "Privacy Policy", href: "/faq" },
    { label: "Terms & Conditions", href: "/faq" },
  ],
};

const social = [
  { label: "Instagram", href: "https://instagram.com", svg: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
  { label: "Facebook", href: "https://facebook.com", svg: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
  { label: "Twitter / X", href: "https://twitter.com", svg: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.843L1.254 2.25H8.08l4.259 5.631L18.244 2.25zM17.08 19.77h1.833L7.084 4.126H5.117L17.08 19.77z" },
  { label: "YouTube", href: "https://youtube.com", svg: "M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" },
];

const trustItems = [
  { icon: ShieldCheck, title: "100% Original", desc: "Authentic products only" },
  { icon: MessageCircleMore, title: "WhatsApp Orders", desc: "Human confirmation" },
  { icon: Truck, title: "Fast Shipping", desc: "3–5 business days" },
  { icon: RotateCcw, title: "Easy Returns", desc: "7-day return policy" },
  { icon: BadgeDollarSign, title: "COD Available", desc: "Pay on delivery" },
];

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden border-t border-[#ddd2c1] bg-[#f7f0e4] pb-20 text-[#1c2540] sm:pb-10 md:pb-0"
      aria-label="Smells From Heaven footer"
    >
      {/* Soft scrapbook atmosphere */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-28 top-24 h-72 w-72 rounded-full bg-[#bfe1ec]/25 blur-3xl" />
        <div className="absolute -right-24 top-[38%] h-80 w-80 rounded-full bg-[#f3c7d3]/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#d9cdec]/20 blur-3xl" />
      </div>

      {/* Trust notes */}
      <div className="relative border-b border-[#ddd2c1] bg-[#f2eadc]/80">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span
              className="rotate-[-2deg] text-2xl text-[#6f625b] sm:text-3xl"
              style={{ fontFamily: "CaveatLocal, cursive" }}
            >
              little things we promise ✦
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {trustItems.map(({ icon: Icon, title, desc }, index) => {
              const paperTones = [
                "bg-[#fffdf7]",
                "bg-[#fff6c9]",
                "bg-[#eaf5f5]",
                "bg-[#fbe8ee]",
                "bg-[#eef5e9]",
              ];

              return (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 22, rotate: 0 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    rotate: index % 2 === 0 ? -1 : 1,
                  }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{
                    y: -6,
                    rotate: 0,
                    scale: 1.025,
                    transition: { duration: 0.25 },
                  }}
                  className={`group relative border border-[#ddd2c1] ${paperTones[index % paperTones.length]} p-4 shadow-[4px_6px_0_rgba(28,37,64,0.05),0_12px_25px_rgba(17,17,17,0.04)]`}
                >
                  <div
                    className={`pointer-events-none absolute left-1/2 top-[-8px] h-5 w-16 -translate-x-1/2 ${
                      index % 3 === 0
                        ? "rotate-[-3deg] bg-[#bfe1ec]/70"
                        : index % 3 === 1
                          ? "rotate-[2deg] bg-[#fff6c9]/80"
                          : "rotate-[-2deg] bg-[#f3c7d3]/70"
                    }`}
                  />

                  <div className="flex items-start gap-3">
                    <motion.div
                      whileHover={{ rotate: 8, scale: 1.08 }}
                      className="flex h-10 w-10 shrink-0 rotate-[-3deg] items-center justify-center border border-[#dcccae] bg-white/80 text-[#b88932] shadow-[2px_3px_0_rgba(28,37,64,0.05)]"
                    >
                      <Icon size={17} strokeWidth={2.1} />
                    </motion.div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-tight text-[#1c2540]">
                        {title}
                      </p>
                      <p className="mt-1 text-[11px] leading-4 text-[#706b70]">
                        {desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main scrapbook footer */}
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.45fr_0.8fr_0.8fr_0.8fr] lg:gap-14">
          {/* Brand note */}
          <motion.div
            initial={{ opacity: 0, y: 28, rotate: -2 }}
            whileInView={{ opacity: 1, y: 0, rotate: -1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative max-w-md border border-[#dcd0bb] bg-[#fffdf7] p-6 shadow-[7px_9px_0_rgba(28,37,64,0.06),0_20px_45px_rgba(17,17,17,0.05)] sm:p-7">
              <div className="pointer-events-none absolute left-1/2 top-[-11px] h-6 w-28 -translate-x-1/2 rotate-[-2deg] bg-[#fff6c9]/90" />

              <Link href="/" className="inline-flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: 5, scale: 1.04 }}
                  className="relative flex h-14 w-14 shrink-0 rotate-[-2deg] items-center justify-center overflow-hidden rounded-full border border-[#dcccae] bg-white shadow-[3px_4px_0_rgba(28,37,64,0.06)]"
                >
                  <Image
                    src="/logo.png"
                    alt="Smells From Heaven logo"
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </motion.div>

                <div>
                  <h3 className="font-[var(--font-playfair)] text-xl font-semibold leading-tight text-[#1c2540]">
                    Smells From Heaven
                  </h3>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#b88932]">
                    Premium Fragrances
                  </p>
                </div>
              </Link>

              <p
                className="mt-6 text-3xl leading-none text-[#1c2540]"
                style={{ fontFamily: "CaveatLocal, cursive" }}
              >
                Where Every Scent Feels
                <span className="block">Like Heaven. ✦</span>
              </p>

              <p className="mt-3 max-w-sm text-sm leading-6 text-[#6e6a70]">
                Crafted to be remembered. Made for the moments that stay with
                you.
              </p>

              <div className="my-6 h-px w-24 bg-[#b88932]/60" />

              <div className="space-y-3">
                {[
                  {
                    icon: Mail,
                    value: "official.smellsfromheaven@gmail.com",
                    href: "mailto:official.smellsfromheaven@gmail.com",
                  },
                  {
                    icon: Phone,
                    value: "+91 8087568338",
                    href: "tel:+918087568338",
                  },
                  {
                    icon: MapPin,
                    value: "Chhatrapati Sambhajinagar, Maharashtra, India",
                    href: null,
                  },
                ].map(({ icon: Icon, value, href }) =>
                  href ? (
                    <a
                      key={value}
                      href={href}
                      className="luxury-link flex items-center gap-2 text-sm text-[#4f4b53] transition-colors hover:text-[#b88932]"
                    >
                      <Icon size={14} className="shrink-0 text-[#b88932]" />
                      {value}
                    </a>
                  ) : (
                    <p
                      key={value}
                      className="flex items-center gap-2 text-sm text-[#4f4b53]"
                    >
                      <Icon size={14} className="shrink-0 text-[#b88932]" />
                      {value}
                    </p>
                  ),
                )}
              </div>

              <div className="mt-6 flex gap-3">
                {social.map(({ svg, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    whileHover={{ y: -4, rotate: 5, scale: 1.08 }}
                    whileTap={{ scale: 0.94 }}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ddd2c1] bg-[#f5efe4] text-[#1c2540] shadow-[2px_3px_0_rgba(28,37,64,0.04)] transition-colors hover:border-[#b88932] hover:text-[#b88932]"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path d={svg} />
                    </svg>
                  </motion.a>
                ))}
              </div>
            </div>

            <p
              className="mt-5 ml-4 text-2xl text-[#8b827d]"
              style={{ fontFamily: "CaveatLocal, cursive" }}
            >
              made with love in Chhatrapati Sambhajinagar ♡
            </p>
          </motion.div>

          {/* Navigation groups */}
          {Object.entries(footerLinks).map(([group, links], groupIndex) => (
            <motion.div
              key={group}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: 0.1 + groupIndex * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative"
            >
              <div
                className={`mb-5 inline-block rotate-[-1deg] border border-[#ddd2c1] px-3 py-2 shadow-[2px_3px_0_rgba(28,37,64,0.04)] ${
                  groupIndex === 0
                    ? "bg-[#fff6c9]"
                    : groupIndex === 1
                      ? "bg-[#bfe1ec]/45"
                      : "bg-[#f3c7d3]/45"
                }`}
              >
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1c2540]">
                  {group}
                </h4>
              </div>

              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="luxury-link group inline-flex items-center text-sm text-[#59555c] transition-all duration-200 hover:translate-x-1 hover:text-[#b88932]"
                    >
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Signature line */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-14 origin-center border-t border-dashed border-[#d8ccb8]"
        />

        <motion.div
          initial={{ opacity: 0, y: 15, rotate: -2 }}
          whileInView={{ opacity: 1, y: 0, rotate: -1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mx-auto mt-7 w-fit rotate-[-1deg] border border-[#dcd0bb] bg-[#fffdf7] px-5 py-3 text-center shadow-[3px_4px_0_rgba(28,37,64,0.05)]"
        >
          <p
            className="text-2xl text-[#1c2540]"
            style={{ fontFamily: "CaveatLocal, cursive" }}
          >
            CRAFTED IN HEAVEN. WORN BY LEGENDS. ✦
          </p>
        </motion.div>
      </div>

      {/* Copyright */}
      <div className="relative border-t border-[#ddd2c1] bg-[#f2eadc]/75">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
          <p className="text-[11px] tracking-[0.08em] text-[#777078]">
            © 2026 Smells From Heaven. All Rights Reserved.
          </p>
          <p
            className="text-xl text-[#777078]"
            style={{ fontFamily: "CaveatLocal, cursive" }}
          >
            Crafted with ✦ for fragrance lovers
          </p>
        </div>
      </div>
    </footer>
  );
}

