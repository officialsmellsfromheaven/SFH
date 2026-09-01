"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Clock,
  Send,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      toast.success(
        "Message sent successfully! We'll get back to you within 24 hours. 🌟"
      );

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact form error:", error);

      toast.error(
        "Unable to send your message. Please try again or contact us directly."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="pt-10 sm:pt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#bf4800]">
              We&apos;re Here to Help
            </p>

            <h1 className="mt-3 font-[var(--font-playfair)] text-4xl font-bold tracking-[-0.05em] text-[#1d1d1f] sm:text-5xl">
              Contact Us
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#6e6e73] sm:text-lg">
              Crafted By Heaven, Worn By Legends.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold tracking-[-0.04em] text-[#1d1d1f]">
              Get in Touch
            </h2>

            <div className="mt-6 space-y-4">
              {[
                {
                  icon: Mail,
                  title: "Email Us",
                  value: "official.smellsfromheaven@gmail.com",
                  href: "mailto:official.smellsfromheaven@gmail.com",
                },
                {
                  icon: MessageCircle,
                  title: "WhatsApp",
                  value: "+91 8087568338",
                  href: "https://wa.me/918087568338",
                },
                {
                  icon: Clock,
                  title: "Support Hours",
                  value: "Mon–Sat: 9 AM – 7 PM IST",
                  href: "#",
                },
              ].map(({ icon: Icon, title, value, href }) => (
                <a
                  key={title}
                  href={href}
                  className="group flex items-start gap-4 rounded-xl border border-[#e5e5e5] bg-[#f5f5f7] p-4 transition-all hover:-translate-y-0.5 hover:border-[#d9d9dc] hover:shadow-[0_16px_30px_rgba(0,0,0,0.04)]"
                >
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-[#e5e5e5]">
                    <Icon size={18} className="text-[#bf4800]" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#1d1d1f]">
                      {title}
                    </p>

                    <p className="mt-1 text-sm text-[#6e6e73]">
                      {value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* Location */}
            <div className="mt-8 flex h-56 items-center justify-center overflow-hidden rounded-xl border border-[#e5e5e5] bg-[#f5f5f7]">
              <div className="text-center text-[#6e6e73]">
                <MapPin
                  size={32}
                  className="mx-auto mb-2 text-[#bf4800]"
                />

                <p className="font-medium text-[#1d1d1f]">
                  123 Fragrance Lane
                </p>

                <p className="text-sm">
                  Bandra West, Mumbai
                </p>
              </div>
            </div>
          </div>

          {/* Send Message */}
          <div className="rounded-xl border border-[#e5e5e5] bg-[#f5f5f7] p-6 sm:p-8">
            <h2 className="text-3xl font-bold tracking-[-0.04em] text-[#1d1d1f]">
              Send a Message
            </h2>

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
              aria-label="Contact form"
            >
              {/* Name + Email */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm font-medium text-[#1d1d1f]"
                  >
                    Your Name *
                  </label>

                  <input
                    id="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: e.target.value,
                      })
                    }
                    placeholder="Rushikesh Joshi"
                    className="w-full rounded-xl border border-[#e5e5e5] bg-white px-4 py-3 text-sm text-[#1d1d1f] placeholder:text-[#8c8c90] focus:border-[#0066cc] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium text-[#1d1d1f]"
                  >
                    Email Address *
                  </label>

                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value,
                      })
                    }
                    placeholder="rushikesh@example.com"
                    className="w-full rounded-xl border border-[#e5e5e5] bg-white px-4 py-3 text-sm text-[#1d1d1f] placeholder:text-[#8c8c90] focus:border-[#0066cc] focus:outline-none"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="mb-1.5 block text-sm font-medium text-[#1d1d1f]"
                >
                  Subject *
                </label>

                <select
                  id="subject"
                  value={form.subject}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      subject: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-[#e5e5e5] bg-white px-4 py-3 text-sm text-[#1d1d1f] focus:border-[#0066cc] focus:outline-none"
                  required
                >
                  <option value="">Select a subject</option>
                  <option>Order Enquiry</option>
                  <option>Return / Refund</option>
                  <option>Product Information</option>
                  <option>Bulk / Corporate Order</option>
                  <option>Partnership</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="mb-1.5 block text-sm font-medium text-[#1d1d1f]"
                >
                  Message *
                </label>

                <textarea
                  id="message"
                  rows={5}
                  required
                  value={form.message}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      message: e.target.value,
                    })
                  }
                  placeholder="Tell us how we can help you..."
                  className="w-full resize-none rounded-xl border border-[#e5e5e5] bg-white px-4 py-3 text-sm text-[#1d1d1f] placeholder:text-[#8c8c90] focus:border-[#0066cc] focus:outline-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0066cc] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#0077ed] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />

                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>

                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}