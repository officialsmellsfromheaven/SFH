import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, ShieldCheck, MessageCircleMore, Truck, RotateCcw, BadgeDollarSign } from "lucide-react";

const footerLinks = {
  Shop: [
    { label: "Men's Collection", href: "/shop?gender=men" },
    { label: "Women's Collection", href: "/shop?gender=women" },
    { label: "Unisex", href: "/shop?gender=unisex" },
    { label: "Attars", href: "/shop?category=attar" },
    { label: "Gift Sets", href: "/shop?category=gift" },
    { label: "New Arrivals", href: "/shop?filter=new" },
    { label: "Best Sellers", href: "/shop?filter=bestseller" },
  ],
  Discover: [
    { label: "Collections", href: "/collections" },
    { label: "Fragrance Finder", href: "/fragrance-finder" },
    { label: "Blog", href: "/blog" },
    { label: "About Us", href: "/about" },
    { label: "Offers & Rewards", href: "/offers" },
    { label: "Subscription Box", href: "/subscription" },
  ],
  Support: [
    { label: "Contact Us", href: "/contact" },
    { label: "FAQs", href: "/faq" },
    { label: "Track Order", href: "/track-order" },
    { label: "Return Policy", href: "/return-policy" },
    { label: "Shipping Policy", href: "/shipping-policy" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
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
    <footer className="border-t border-[#e5e1d8] bg-[#faf8f3] text-[#1d1d1f] pb-20 sm:pb-10 md:pb-0">
      <div className="border-b border-[#e5e1d8] bg-[#f7f3ee]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:pr-[4.5rem] xl:pr-[5.5rem]">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {trustItems.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3 rounded-[1rem] border border-[#e8dfcf] bg-white p-3 shadow-[0_8px_20px_rgba(0,0,0,0.02)]">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5efe4] text-[#b88932] ring-1 ring-[#eadfc5]">
                  <Icon size={16} strokeWidth={2.2} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1d1d1f]">{title}</p>
                  <p className="mt-0.5 text-[11px] text-[#6e6e73]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:pr-[4.5rem] xl:pr-[5.5rem]">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="mb-4 inline-flex items-center gap-3">
              <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-[#e5e1d8] bg-white shadow-[0_8px_20px_rgba(0,0,0,0.04)]">
                <Image src="/logo.png" alt="Smells From Heaven logo" fill className="object-cover" sizes="48px" />
              </div>
              <div>
                <h3 className="text-lg font-bold leading-tight text-[#1d1d1f]">
                  Smells From Heaven
                </h3>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b88932]">
                  Premium Fragrances
                </p>
              </div>
            </Link>

            <p className="mb-6 max-w-xs text-sm leading-6 text-[#6e6e73]">
              Where Every Smell Is A Heavenly Delight. Crafted Heaven Worn By Legends.
            </p>

            <div className="space-y-3">
              {[
                { icon: Mail, value: "official.smellsfromheaven@gmail.com", href: "mailto:official.smellsfromheaven@gmail.com" },
                { icon: Phone, value: "+91 8087568338", href: "tel:+918087568338" },
                { icon: MapPin, value: "Mumbai, Maharashtra, India", href: "#" },
              ].map(({ icon: Icon, value, href }) => (
                <a
                  key={value}
                  href={href}
                  className="luxury-link flex items-center gap-2 text-sm text-[#4b4b4f] transition-colors hover:text-[#b88932]"
                >
                  <Icon size={14} className="text-[#b88932]" />
                  {value}
                </a>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              {social.map(({ svg, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e5e1d8] bg-[#f5f1ea] text-[#111111] transition-all hover:border-[#b88932] hover:bg-[#f5efe4] hover:text-[#b88932]"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d={svg} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#1d1d1f]">
                {group}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="luxury-link text-sm text-[#4b4b4f] transition-colors hover:text-[#b88932]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>

      <div className="border-t border-[#e5e1d8] bg-transparent">
        <div className="mx-auto flex max-w-7xl flex-row flex-wrap items-center justify-center gap-3 px-4 py-5 text-center sm:px-6">
          <p className="text-[11px] tracking-[0.08em] text-[#6e6e73]">© 2026 Smells From Heaven. All rights reserved. Made with ❤️ in India.</p>
          <div className="flex flex-wrap items-center justify-center gap-1 text-[11px] tracking-[0.08em] text-[#6e6e73]">
            <span className="font-medium text-[#1d1d1f]">WhatsApp Confirmation</span>
            <span className="text-[#b88932]">|</span>
            <span>Payment details shared after confirmation</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
