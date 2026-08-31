"use client";
import { motion } from "framer-motion";
import StarRating from "@/components/ui/StarRating";

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    text: "I ordered Oud Al Qamar for my husband's birthday and he absolutely loves it. The fragrance lasts all day and gets so many compliments. Smells From Heaven is now our go-to for perfumes!",
    avatar: "PS",
    verified: true,
    product: "Oud Al Qamar",
  },
  {
    name: "Rahul Mehta",
    location: "Delhi",
    rating: 5,
    text: "Noir Velvet is hands down the best fragrance I've ever worn. The leather and tobacco combination is just perfect. Extremely long-lasting. Will definitely order again!",
    avatar: "RM",
    verified: true,
    product: "Noir Velvet",
  },
  {
    name: "Fatima Khan",
    location: "Hyderabad",
    rating: 5,
    text: "The Amber Mystique attar is divine. Being alcohol-free makes it perfect for daily use. It lasts literally the entire day — one tiny drop is enough. Authentic oriental quality.",
    avatar: "FK",
    verified: true,
    product: "Amber Mystique",
  },
  {
    name: "Sneha Patel",
    location: "Ahmedabad",
    rating: 4,
    text: "Rose de Paradis is so elegant. Perfect for office and brunch. The packaging is beautiful too — feels super premium. Delivery was fast and the perfume was well-packed.",
    avatar: "SP",
    verified: true,
    product: "Rose de Paradis",
  },
  {
    name: "Arjun Nair",
    location: "Bangalore",
    rating: 5,
    text: "I've tried many brands but Smells From Heaven's quality is unmatched at this price point. The Saffron Dreams limited edition is worth every rupee. Smells absolutely incredible!",
    avatar: "AN",
    verified: true,
    product: "Saffron Dreams",
  },
  {
    name: "Deepika Rao",
    location: "Chennai",
    rating: 5,
    text: "The fragrance finder quiz actually helped me pick the perfect scent! Got Jasmine Royale and it's exactly what I was looking for. Super impressed with the customer service too.",
    avatar: "DR",
    verified: true,
    product: "Jasmine Royale",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-stone-950 to-amber-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-2">
            What Our Customers Say
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold font-[var(--font-playfair)] text-white">
            Reviews from Heaven
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <StarRating rating={4.8} size={18} />
            <span className="text-amber-300 font-bold">4.8/5</span>
            <span className="text-stone-400 text-sm">from 50,000+ reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-stone-400 text-xs">{t.location}</p>
                  </div>
                </div>
                {t.verified && (
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full px-2 py-0.5">
                    ✓ Verified
                  </span>
                )}
              </div>

              <StarRating rating={t.rating} size={14} />

              <p className="text-stone-300 text-sm leading-relaxed mt-3 line-clamp-3">
                &ldquo;{t.text}&rdquo;
              </p>

              <p className="text-amber-500 text-xs font-medium mt-3">
                Purchased: {t.product}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
