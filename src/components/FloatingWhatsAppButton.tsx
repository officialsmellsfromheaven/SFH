"use client";

import { MessageCircle } from "lucide-react";
import { orderConfig } from "@/lib/orderConfig";

export default function FloatingWhatsAppButton() {
  const message = encodeURIComponent(
    "Hello! Need help choosing a fragrance. Please guide me."
  );

  return (
    <a
      href={`https://wa.me/${orderConfig.whatsappNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition-transform hover:scale-[1.03]"
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle size={18} />
      <span className="hidden sm:inline">Chat with us</span>
    </a>
  );
}
