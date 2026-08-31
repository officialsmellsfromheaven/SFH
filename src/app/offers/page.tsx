"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const offers = [
  { code: "HEAVEN10", title: "10% Off First Order", desc: "Share code HEAVEN10 on WhatsApp for 10% off your first order.", type: "New Customers" },
  { code: "BUNDLE20", title: "Bundle Deal", desc: "Buy any 3 fragrances and get 20% off automatically. No code needed.", type: "Bundle" },
  { code: "FREESHIP", title: "Free Shipping", desc: "Get free shipping on orders above ₹999. Applied automatically.", type: "Shipping" },
  { code: "REFER200", title: "Refer & Earn ₹200", desc: "Refer a friend who makes a purchase and both get ₹200 off. Share your referral link with friends.", type: "Referral" },
];

export default function OffersPage() {
  const [copyStatus, setCopyStatus] = useState<{ code: string; state: "success" | "error" } | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async (code: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = code;
        textArea.setAttribute("readonly", "");
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        const copied = document.execCommand("copy");
        document.body.removeChild(textArea);
        if (!copied) throw new Error("Copy failed");
      }

      setCopyStatus({ code, state: "success" });
    } catch {
      setCopyStatus({ code, state: "error" });
    }

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setCopyStatus(null);
    }, 1400);
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="pt-10 sm:pt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#bf4800]">
              Special Deals
            </p>
            <h1 className="mt-3 font-[var(--font-playfair)] text-4xl font-bold tracking-[-0.05em] text-[#1d1d1f] sm:text-5xl">
              Offers & Rewards
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#6e6e73] sm:text-lg">
              More reasons to smell heavenly.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-12 grid gap-5 sm:grid-cols-2">
          {offers.map((offer) => (
            <div
              key={offer.code}
              className="rounded-xl border border-[#e5e5e5] bg-[#f5f5f7] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[#d9d9dc] hover:shadow-[0_16px_30px_rgba(0,0,0,0.04)]"
            >
              <span className="inline-flex rounded-full border border-[#f0d1b1] bg-[#fff3ea] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#bf4800]">
                {offer.type}
              </span>
              <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-[#1d1d1f]">
                {offer.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#6e6e73]">{offer.desc}</p>

              {offer.code && (
                <div className="mt-5 flex items-center gap-3">
                  <code className="rounded-lg border border-dashed border-[#d9d9dc] bg-white px-3 py-1.5 text-sm font-semibold text-[#1d1d1f]">
                    {offer.code}
                  </code>
                  <button
                    type="button"
                    onClick={() => handleCopy(offer.code)}
                    className="text-sm font-medium text-[#0066cc] transition-colors hover:text-[#0077ed]"
                  >
                    {copyStatus?.code === offer.code
                      ? copyStatus.state === "success"
                        ? "Copied!"
                        : "Copy failed"
                      : "Copy"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-[#e5e5e5] bg-[#f5f5f7] p-8 text-center">
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#1d1d1f] sm:text-3xl">
            Heaven Points
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#6e6e73] sm:text-base">
            Earn 1 point for every ₹10 spent. Redeem 100 points = ₹10 off. Gold members (500+ points) get exclusive early access.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#0066cc] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0077ed]"
          >
            Shop the Collection →
          </Link>
        </div>
      </div>
    </div>
  );
}
