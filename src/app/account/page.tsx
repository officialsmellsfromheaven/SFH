import Link from "next/link";
import { orderConfig } from "@/lib/orderConfig";

export default function AccountPage() {
  const whatsappMessage = encodeURIComponent("Hello! I would like to order on WhatsApp.");

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-16">
      <div className="mx-auto max-w-2xl rounded-[28px] border border-stone-200 bg-white p-8 shadow-[0_20px_40px_rgba(0,0,0,0.04)] sm:p-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#bf4800]">
          Guest Shopping
        </p>
        <h1 className="mt-3 font-[var(--font-playfair)] text-3xl font-bold tracking-[-0.05em] text-[#1d1d1f] sm:text-4xl">
          No customer account required
        </h1>
        <p className="mt-4 text-base leading-7 text-[#6e6e73]">
          Browse fragrances, add your favourites to the cart, and complete checkout without creating an account.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-full bg-[#1d1d1f] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2b2b2d]"
          >
            Browse Shop
          </Link>
          <a
            href={`https://wa.me/${orderConfig.whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-[#d9d9dc] bg-[#f5f5f7] px-6 py-3 text-sm font-semibold text-[#1d1d1f] transition-colors hover:border-[#0066cc] hover:text-[#0066cc]"
          >
            Order on WhatsApp
          </a>
        </div>

        <div className="mt-8 rounded-2xl border border-stone-200 bg-stone-50 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#1d1d1f]">
            Guest flow
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-[#4b4b4f]">
            <li>• Browse perfumes and collections</li>
            <li>• Add products to the cart</li>
            <li>• Checkout without sign up</li>
            <li>• Place your order through WhatsApp</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
