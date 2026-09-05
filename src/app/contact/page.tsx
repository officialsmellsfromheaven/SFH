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
    <main className="relative min-h-screen overflow-hidden bg-[#f7f0e4] text-[#1c2540]">
      {/* Heaven / scrapbook atmosphere */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-20 h-80 w-80 rounded-full bg-[#bfe1ec]/55 blur-3xl" />
        <div className="absolute right-[-100px] top-10 h-96 w-96 rounded-full bg-[#f3c7d3]/45 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 h-80 w-80 rounded-full bg-[#d9cdec]/40 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage: "radial-gradient(#1c2540 0.7px, transparent 0.7px)",
            backgroundSize: "18px 18px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="relative pb-12 pt-4 sm:pb-16">
          <div className="absolute right-2 top-3 hidden rotate-6 border border-[#1c2540]/10 bg-[#fff6c9] px-5 py-3 shadow-[4px_5px_0_rgba(28,37,64,0.08)] lg:block">
            <p className="font-[Caveat,cursive] text-xl">we'd love to hear from you ♡</p>
          </div>

          <div className="mb-5 inline-flex -rotate-2 items-center gap-2 border border-[#1c2540]/10 bg-[#d9cdec] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.17em] shadow-[3px_3px_0_rgba(28,37,64,0.08)]">
            <MessageCircle size={13} />
            a little note from heaven
          </div>

          <h1 className="max-w-4xl font-serif text-5xl leading-[0.92] tracking-[-0.05em] sm:text-6xl lg:text-8xl">
            Let&apos;s talk.
            <br />
            <span className="italic">We&apos;re listening.</span>
            <span className="font-[Caveat,cursive] text-4xl tracking-normal text-[#b88932] sm:text-5xl lg:text-6xl">
              {" "}✦
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-[#1c2540]/65 sm:text-base">
            Questions about an order, a fragrance, or simply need a little help?
            Drop us a note. We&apos;ll get back to you within 24 hours.
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            <span className="rotate-[-2deg] border border-[#1c2540]/10 bg-[#fffdf7] px-4 py-2 font-[Caveat,cursive] text-base shadow-[3px_4px_0_rgba(28,37,64,0.06)]">
              ✉ real humans behind the screen
            </span>
            <span className="rotate-[2deg] border border-[#1c2540]/10 bg-[#cfe6cf] px-4 py-2 font-[Caveat,cursive] text-base shadow-[3px_4px_0_rgba(28,37,64,0.06)]">
              ♡ Mon–Sat · 9 AM–7 PM IST
            </span>
          </div>
        </section>

        <div className="grid items-start gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          {/* Contact details */}
          <section className="relative">
            <div className="absolute -right-2 -top-3 h-5 w-20 rotate-6 bg-[#bfe1ec]/80" />

            <div className="border border-[#1c2540]/10 bg-[#fffdf7] p-6 shadow-[7px_8px_0_rgba(28,37,64,0.08)] sm:p-7">
              <div className="mb-6">
                <p className="font-[Caveat,cursive] text-xl text-[#1c2540]/55">
                  keep this little page handy ✦
                </p>
                <h2 className="mt-1 font-serif text-3xl tracking-[-0.03em]">
                  Get in touch.
                </h2>
              </div>

              <div className="space-y-4">
                {[
                  {
                    icon: Mail,
                    title: "Email Us",
                    value: "official.smellsfromheaven@gmail.com",
                    href: "mailto:official.smellsfromheaven@gmail.com",
                    paper: "#fff6c9",
                    rotate: "-rotate-1",
                    note: "for thoughtful questions ✉",
                  },
                  {
                    icon: MessageCircle,
                    title: "WhatsApp",
                    value: "+91 8087568338",
                    href: "https://wa.me/918087568338",
                    paper: "#cfe6cf",
                    rotate: "rotate-1",
                    note: "fastest way to reach us ♡",
                  },
                  {
                    icon: Clock,
                    title: "Support Hours",
                    value: "Mon–Sat: 9 AM – 7 PM IST",
                    href: "#",
                    paper: "#d9cdec",
                    rotate: "-rotate-[0.7deg]",
                    note: "we're around during these hours",
                  },
                ].map(({ icon: Icon, title, value, href, paper, rotate, note }) => (
                  <a
                    key={title}
                    href={href}
                    className={`group relative block border border-[#1c2540]/10 p-4 shadow-[4px_5px_0_rgba(28,37,64,0.07)] transition-all duration-300 hover:-translate-y-1 hover:rotate-0 ${rotate}`}
                    style={{ backgroundColor: paper }}
                  >
                    <div className="absolute -top-2 left-8 h-5 w-14 rotate-[-2deg] bg-[#fffdf7]/75" />
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 rotate-[-2deg] items-center justify-center border border-[#1c2540]/10 bg-[#fffdf7]">
                        <Icon size={18} className="text-[#1c2540]/70" />
                      </div>
                      <div className="min-w-0 pt-0.5">
                        <p className="font-serif text-base">{title}</p>
                        <p className="mt-1 break-words text-sm text-[#1c2540]/65">{value}</p>
                        <p className="mt-1 font-[Caveat,cursive] text-sm text-[#1c2540]/50">
                          {note}
                        </p>
                      </div>
                    </div>
                    {title !== "Support Hours" && (
                      <ArrowSmall />
                    )}
                  </a>
                ))}
              </div>

              {/* Location note */}
              <div className="relative mt-6 rotate-[0.7deg] border border-[#1c2540]/10 bg-[#f7f0e4] p-5 shadow-[4px_5px_0_rgba(28,37,64,0.06)]">
                <div className="absolute -top-2 right-10 h-5 w-16 rotate-[-3deg] bg-[#f3c7d3]/80" />
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f3c7d3]">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="font-serif text-base">A little corner of heaven</p>
                    <p className="mt-1 text-sm text-[#1c2540]/60">
                      Chhatrapati Sambhajinagar, Maharashtra, India
                    </p>
                    <p className="mt-1 font-[Caveat,cursive] text-sm text-[#1c2540]/50">
                      made here, sent everywhere ✦
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Form */}
          <section className="relative">
            <div className="absolute -left-2 -top-3 z-10 h-6 w-24 rotate-[-3deg] bg-[#f3c7d3]/85" />

            <div className="border border-[#1c2540]/10 bg-[#fffdf7] p-6 shadow-[9px_10px_0_rgba(28,37,64,0.09)] sm:p-8">
              <div className="mb-7 flex items-end justify-between gap-4">
                <div>
                  <p className="font-[Caveat,cursive] text-xl text-[#b88932]">
                    write us a little something ✍
                  </p>
                  <h2 className="mt-1 font-serif text-3xl tracking-[-0.035em] sm:text-4xl">
                    Send a message.
                  </h2>
                </div>
                <span className="hidden rotate-3 border border-[#1c2540]/10 bg-[#fff6c9] px-3 py-2 font-[Caveat,cursive] text-sm text-[#1c2540]/65 sm:block">
                  no question is too small ♡
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" aria-label="Contact form">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-1.5 block font-[Caveat,cursive] text-lg text-[#1c2540]/65"
                    >
                      Your Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Rushikesh Joshi"
                      className="w-full border border-[#1c2540]/12 bg-[#f7f0e4]/60 px-4 py-3 text-sm text-[#1c2540] placeholder:text-[#1c2540]/30 outline-none transition-all focus:-translate-y-0.5 focus:border-[#b88932]/55 focus:bg-[#fffdf7] focus:shadow-[3px_4px_0_rgba(184,137,50,0.10)]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block font-[Caveat,cursive] text-lg text-[#1c2540]/65"
                    >
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="rushikesh@example.com"
                      className="w-full border border-[#1c2540]/12 bg-[#f7f0e4]/60 px-4 py-3 text-sm text-[#1c2540] placeholder:text-[#1c2540]/30 outline-none transition-all focus:-translate-y-0.5 focus:border-[#b88932]/55 focus:bg-[#fffdf7] focus:shadow-[3px_4px_0_rgba(184,137,50,0.10)]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="mb-1.5 block font-[Caveat,cursive] text-lg text-[#1c2540]/65"
                  >
                    What can we help with? *
                  </label>
                  <select
                    id="subject"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full border border-[#1c2540]/12 bg-[#f7f0e4]/60 px-4 py-3 text-sm text-[#1c2540] outline-none transition-all focus:-translate-y-0.5 focus:border-[#b88932]/55 focus:bg-[#fffdf7] focus:shadow-[3px_4px_0_rgba(184,137,50,0.10)]"
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

                <div>
                  <label
                    htmlFor="message"
                    className="mb-1.5 block font-[Caveat,cursive] text-lg text-[#1c2540]/65"
                  >
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us how we can help you..."
                    className="w-full resize-none border border-[#1c2540]/12 bg-[#f7f0e4]/60 px-4 py-3 text-sm text-[#1c2540] placeholder:text-[#1c2540]/30 outline-none transition-all focus:-translate-y-0.5 focus:border-[#b88932]/55 focus:bg-[#fffdf7] focus:shadow-[3px_4px_0_rgba(184,137,50,0.10)]"
                  />
                </div>

                <div className="relative pt-1">
                  <div className="absolute -top-2 right-[20%] h-4 w-14 rotate-[2deg] bg-[#bfe1ec]/75" />
                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex w-full items-center justify-center gap-2 bg-[#1c2540] px-6 py-4 text-sm font-semibold text-white shadow-[5px_5px_0_rgba(28,37,64,0.14)] transition-all hover:-translate-y-0.5 hover:shadow-[7px_7px_0_rgba(28,37,64,0.14)] disabled:cursor-not-allowed disabled:opacity-60"
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
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-center font-[Caveat,cursive] text-base text-[#1c2540]/45">
                  ✦ your message lands with a real human ✦
                </p>
              </form>
            </div>
          </section>
        </div>

        <div className="mt-14 text-center">
          <p className="font-[Caveat,cursive] text-xl text-[#1c2540]/45">
            crafted in heaven · here whenever you need us ♡
          </p>
        </div>
      </div>
    </main>
  );
}

function ArrowSmall() {
  return (
    <span className="absolute bottom-4 right-4 text-lg text-[#1c2540]/30 transition-transform duration-300 group-hover:translate-x-1">
      →
    </span>
  );
}
