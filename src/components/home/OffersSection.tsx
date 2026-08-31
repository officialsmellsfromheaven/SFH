"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Gift, Star, Users, CreditCard } from "lucide-react";

const offers = [
  {
    icon: Gift,
    title: "Gift Cards",
    description: "Share the gift of heavenly fragrance. Available in ₹500 – ₹10,000 denominations.",
    cta: "Buy Gift Card",
    href: "/gift-cards",
    color: "from-rose-500 to-pink-600",
  },
  {
    icon: Star,
    title: "Loyalty Points",
    description: "Earn 1 point per ₹10 spent. Redeem for discounts on future orders.",
    cta: "Join Rewards",
    href: "/rewards",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: Users,
    title: "Referral Program",
    description: "Refer a friend and both of you get ₹200 off your next order.",
    cta: "Refer & Earn",
    href: "/referral",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: CreditCard,
    title: "Bundle Offers",
    description: "Buy any 3 perfumes and get 20% off. Mix and match across collections.",
    cta: "Shop Bundles",
    href: "/shop?bundle=true",
    color: "from-violet-500 to-purple-600",
  },
];

export default function OffersSection() {
  return (
    <section className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-amber-600 text-sm font-semibold tracking-widest uppercase mb-2">
            Special Offers
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold font-[var(--font-playfair)] text-stone-900">
            Rewards & Deals
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {offers.map((offer, i) => (
            <motion.div
              key={offer.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm hover:shadow-xl hover:shadow-amber-50 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${offer.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <offer.icon size={22} className="text-white" />
              </div>
              <h3 className="font-bold text-stone-800 mb-2">{offer.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-4">
                {offer.description}
              </p>
              <Link
                href={offer.href}
                className="text-amber-600 hover:text-amber-700 font-semibold text-sm inline-flex items-center gap-1 transition-colors"
              >
                {offer.cta} →
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
