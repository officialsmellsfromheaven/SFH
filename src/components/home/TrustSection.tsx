"use client";
import { motion } from "framer-motion";
import { Shield, Lock, Truck, RotateCcw, Banknote, Award } from "lucide-react";

const trustItems = [
  {
    icon: Shield,
    title: "100% Original",
    description: "Every product is authenticated and sourced directly from our in-house lab.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Lock,
    title: "WhatsApp Confirmation",
    description: "Every order is reviewed personally before payment details are shared.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Express shipping available. Track your order in real-time.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "Not satisfied? Return within 7 days for a full refund. No questions.",
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    icon: Banknote,
    title: "Cash on Delivery",
    description: "Pay when your order arrives. Available across India.",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: Award,
    title: "Award-Winning",
    description: "Recognised as India's best online fragrance brand 2025.",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
];

export default function TrustSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-amber-600 text-sm font-semibold tracking-widest uppercase mb-2">
            Why Shop With Us
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold font-[var(--font-playfair)] text-stone-900">
            Our Promise to You
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
          {trustItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="p-5 rounded-2xl border border-stone-100 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-50 transition-all duration-300"
            >
              <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mb-4`}>
                <item.icon size={22} className={item.color} />
              </div>
              <h3 className="font-bold text-stone-800 mb-1.5 text-sm sm:text-base">
                {item.title}
              </h3>
              <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
