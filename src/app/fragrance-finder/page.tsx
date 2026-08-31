"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import {
  products,
  fragranceFamilies,
  mainAccordOptions,
  noteSearchOptions,
  getProductFragranceFamilies,
  getProductGender,
  getProductMainAccords,
  matchesFragranceSearch,
} from "@/lib/data";
import { getSiteImage } from "@/lib/siteImages";

const finderVisual = getSiteImage("fragranceFinder");

const questions = [
  {
    id: "gender",
    question: "Who is this fragrance for?",
    options: ["Men", "Women", "Unisex"],
  },
  {
    id: "family",
    question: "Which fragrance family do you prefer?",
    options: fragranceFamilies,
  },
  {
    id: "accord",
    question: "Which main accord speaks to you most?",
    options: mainAccordOptions,
  },
  {
    id: "note",
    question: "Which note would you like to explore?",
    options: noteSearchOptions,
  },
];

const moodOptions = ["🔥 BOLD", "🌊 FRESH", "🌙 MYSTERIOUS", "🍯 SWEET", "🌿 CLEAN"];

export default function FragranceFinderPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const currentQ = questions[step];
  const progress = (step / questions.length) * 100;

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [currentQ.id]: answer };
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setTimeout(() => setStep(step + 1), 200);
    } else {
      setDone(true);
    }
  };

  const getRecommendations = () => {
    let filtered = [...products];

    if (answers.gender === "Men") {
      filtered = filtered.filter((p) => getProductGender(p) === "men" || getProductGender(p) === "unisex");
    }
    if (answers.gender === "Women") {
      filtered = filtered.filter((p) => getProductGender(p) === "women" || getProductGender(p) === "unisex");
    }
    if (answers.gender === "Unisex") {
      filtered = filtered.filter((p) => getProductGender(p) === "unisex");
    }
    if (answers.family) {
      filtered = filtered.filter((p) => getProductFragranceFamilies(p).includes(answers.family));
    }
    if (answers.accord) {
      filtered = filtered.filter((p) => getProductMainAccords(p).includes(answers.accord));
    }
    if (answers.note) {
      filtered = filtered.filter((p) => matchesFragranceSearch(p, answers.note));
    }

    if (filtered.length === 0) filtered = products;
    return filtered.slice(0, 4);
  };

  if (done) {
    const recs = getRecommendations();
    return (
      <div className="min-h-screen bg-[#faf8f3] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
            <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#f3e9d1] ring-1 ring-[#e7d8af]">
              <Sparkles size={28} className="text-[#b88932]" />
            </div>
            <h1 className="mb-2 font-[var(--font-playfair)] text-4xl font-semibold tracking-[-0.06em] text-[#111111] sm:text-5xl">
              Your Heavenly Matches
            </h1>
            <p className="mx-auto max-w-xl text-base text-[#4d4d4d] sm:text-lg">
              Based on your mood and preferences, these fragrances fit the vibe you are after.
            </p>
          </motion.div>

          <div className="mb-10 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {recs.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col justify-center gap-4 text-center sm:flex-row">
            <button
              onClick={() => {
                setStep(0);
                setAnswers({});
                setDone(false);
              }}
              className="inline-flex items-center justify-center rounded-full border border-[#e1d3ac] bg-white px-8 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#111111] transition-colors hover:border-[#b88932] hover:text-[#b88932]"
            >
              Retake Quiz
            </button>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111111] px-8 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#1d1d1d]"
            >
              Browse All Fragrances <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f3] px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto w-full max-w-6xl">
        <div className="overflow-hidden rounded-[2rem] border border-[#eadfc7] bg-white shadow-[0_18px_55px_rgba(17,17,17,0.04)]">
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_0.9fr]">
            <div className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
              <div className="mb-4 flex justify-center lg:justify-start">
                <div className="relative h-14 w-14 overflow-hidden rounded-full bg-[#f5efe5] ring-1 ring-[#e4d5ad]">
                  <Image src="/logo.png" alt="Smells From Heaven" fill className="object-cover" sizes="56px" />
                </div>
              </div>

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#ebdcc0] bg-[#f7f0e3] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b88932]">
                <Sparkles size={14} />
                NOT SURE WHAT TO WEAR?
              </div>

              <h1 className="text-center font-[var(--font-playfair)] text-4xl font-semibold leading-[0.94] tracking-[-0.06em] text-[#111111] sm:text-5xl lg:text-left">
                LET YOUR VIBE
                <span className="block">CHOOSE YOUR FRAGRANCE.</span>
              </h1>

              <p className="mt-4 text-center text-base text-[#4d4d4d] lg:text-left">
                Pick a mood and let your fragrance match the energy you want to wear.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {moodOptions.map((option) => (
                  <span
                    key={option}
                    className="rounded-full border border-[#e9d7ad] bg-[#faf7f1] px-4 py-2 text-sm font-medium text-[#111111]"
                  >
                    {option}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden bg-[#f3ebdc] p-3 sm:p-4">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
                <Image
                  src={finderVisual?.src ?? "/logo.png"}
                  alt={finderVisual?.alt ?? "Smells From Heaven fragrance finder visual"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4d4d4d]">
              <span>Question {step + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#efe4ca]">
              <motion.div
                className="h-full rounded-full bg-[#b88932]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              transition={{ duration: 0.25 }}
              className="rounded-[1.6rem] border border-[#e8dcc0] bg-[#fffdf9] p-5 sm:p-8"
            >
              <h2 className="mb-6 text-center text-2xl font-semibold tracking-[-0.04em] text-[#111111] sm:text-3xl">
                {currentQ.question}
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {currentQ.options.map((option) => {
                  const isSelected = answers[currentQ.id] === option;

                  return (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      className={`w-full rounded-[1rem] border px-4 py-3.5 text-left text-sm font-medium transition-all duration-200 ${
                        isSelected
                          ? "border-[#b88932] bg-[#f5efe4] text-[#111111] shadow-[0_0_0_1px_rgba(184,137,50,0.1)]"
                          : "border-[#e9e0cf] bg-white text-[#111111] hover:border-[#d2b777] hover:bg-[#faf7f1]"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {step > 0 && (
            <div className="mt-6 flex justify-start">
              <button
                onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
                className="inline-flex items-center gap-2 rounded-full border border-[#e4d4ae] bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#111111] transition-colors hover:border-[#b88932] hover:text-[#b88932]"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
