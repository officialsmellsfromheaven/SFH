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
      <div className="relative min-h-screen overflow-hidden bg-[#f7f0e4] py-12 text-[#1c2540] sm:py-16">
        <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#bfe1ec]/45 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-[28rem] h-80 w-80 rounded-full bg-[#f3c7d3]/40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 left-1/3 h-64 w-64 rounded-full bg-[#d9cdec]/35 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mx-auto mb-10 max-w-4xl"
          >
            <div className="absolute -left-1 top-2 h-9 w-28 rotate-[-4deg] bg-[#bfe1ec]/80 shadow-sm" />
            <div className="absolute -right-1 top-8 h-8 w-24 rotate-[5deg] bg-[#f3c7d3]/75 shadow-sm" />

            <div className="relative overflow-hidden border border-[#d8cdbd] bg-[#fffdf7] px-6 py-9 text-center shadow-[0_18px_50px_rgba(72,56,35,0.10)] sm:px-10 sm:py-11">
              <div className="absolute right-5 top-5 h-3 w-3 rounded-full bg-[#b88932]/70" />
              <div className="mx-auto mb-4 inline-flex h-12 w-12 rotate-[-3deg] items-center justify-center border border-[#e7d8af] bg-[#fff6c9] shadow-[3px_4px_0_rgba(28,37,64,0.05)]">
                <Sparkles size={22} className="text-[#b88932]" />
              </div>

              <p className="caveat text-2xl font-semibold text-[#7d6a4e] sm:text-3xl">
                your scent story has been found ✦
              </p>

              <h1 className="mt-2 font-[var(--font-playfair)] text-4xl font-semibold tracking-[-0.06em] text-[#1c2540] sm:text-5xl">
                Your Heavenly Matches
              </h1>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#667085] sm:text-base">
                Based on your mood and preferences, these fragrances fit the vibe you are after.
              </p>
            </div>
          </motion.div>

          <div className="relative border border-[#d8cdbd] bg-[#fffdf7]/75 p-3 shadow-[0_16px_40px_rgba(72,56,35,0.08)] sm:p-5">
            <div className="pointer-events-none absolute left-[18%] top-[-8px] h-7 w-24 rotate-[2deg] bg-[#d9cdec]/70" />
            <div className="pointer-events-none absolute right-[18%] bottom-[-8px] h-7 w-24 rotate-[-3deg] bg-[#cfe6cf]/65" />

            <div className="mb-5 flex items-center justify-between px-2">
              <p className="caveat text-xl text-[#7a8799]">a few scents worth remembering ♡</p>
              <span className="hidden rounded-full border border-[#ded4c5] bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#7a8799] sm:inline-flex">
                {recs.length} matches
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
              {recs.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 22, rotate: i % 2 === 0 ? -2 : 2 }}
                  animate={{ opacity: 1, y: 0, rotate: i % 2 === 0 ? -0.5 : 0.5 }}
                  transition={{ delay: i * 0.1, duration: 0.45 }}
                  whileHover={{ y: -7, rotate: 0 }}
                  className="min-w-0"
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mx-auto mt-10 flex max-w-2xl flex-col justify-center gap-4 text-center sm:flex-row">
            <button
              onClick={() => {
                setStep(0);
                setAnswers({});
                setDone(false);
              }}
              className="inline-flex items-center justify-center border border-[#cbbd9e] bg-[#fffdf7] px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-[#1c2540] shadow-[4px_5px_0_rgba(28,37,64,0.05)] transition-all hover:-translate-y-1 hover:border-[#b88932]"
            >
              Retake Quiz
            </button>

            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 border-2 border-[#1c2540] bg-[#1c2540] px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[5px_6px_0_rgba(28,37,64,0.13)] transition-all hover:-translate-y-1 hover:bg-[#27324f]"
            >
              Browse All Fragrances <ArrowRight size={16} />
            </Link>
          </div>

          <p className="caveat mt-7 text-center text-xl text-[#7d6a4e] sm:text-2xl">
            trust your nose. it usually knows. ☁
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f0e4] px-4 py-10 text-[#1c2540] sm:px-6 sm:py-14">
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#bfe1ec]/45 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-[30rem] h-80 w-80 rounded-full bg-[#f3c7d3]/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#d9cdec]/35 blur-3xl" />

      <div className="relative mx-auto w-full max-w-6xl">
        <div className="relative mb-8">
          <div className="absolute -left-1 top-3 h-9 w-28 rotate-[-4deg] bg-[#bfe1ec]/80 shadow-sm" />
          <div className="absolute -right-1 top-10 h-8 w-24 rotate-[5deg] bg-[#f3c7d3]/75 shadow-sm" />

          <div className="relative overflow-hidden border border-[#d8cdbd] bg-[#fffdf7] shadow-[0_18px_50px_rgba(72,56,35,0.10)]">
            <div className="grid items-stretch lg:grid-cols-[1.05fr_0.85fr]">
              <div className="relative p-6 sm:p-9 lg:p-11">
                <div className="absolute right-5 top-5 h-3 w-3 rounded-full bg-[#b88932]/70" />

                <div className="mb-5 flex items-center gap-3">
                  <div className="relative h-12 w-12 rotate-[-3deg] overflow-hidden border border-[#ded4c5] bg-[#fff6c9] shadow-[3px_4px_0_rgba(28,37,64,0.05)]">
                    <Image src="/logo.png" alt="Smells From Heaven" fill className="object-cover" sizes="48px" />
                  </div>
                  <p className="caveat text-xl text-[#7d6a4e]">
                    a tiny scent diary ✦
                  </p>
                </div>

                <div className="mb-4 inline-flex -rotate-[1deg] items-center gap-2 border border-[#ead5df] bg-[#fae9ef] px-4 py-2 shadow-[3px_4px_0_rgba(28,37,64,0.05)]">
                  <Sparkles size={14} className="text-[#8a6875]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7a5361]">
                    NOT SURE WHAT TO WEAR?
                  </span>
                </div>

                <h1 className="font-[var(--font-playfair)] text-4xl font-semibold leading-[0.94] tracking-[-0.06em] text-[#1c2540] sm:text-5xl lg:text-[3.9rem]">
                  LET YOUR VIBE
                  <span className="block text-[#b88932]">CHOOSE YOUR FRAGRANCE.</span>
                </h1>

                <p className="mt-5 max-w-xl text-sm leading-7 text-[#667085] sm:text-base">
                  Pick a mood and let your fragrance match the energy you want to wear.
                </p>

                <div className="mt-6 flex max-w-xl flex-wrap gap-3">
                  {moodOptions.map((option, index) => {
                    const moodStyles = [
                      "rotate-[-2deg] border-[#cddfe4] bg-[#e9f4f5]",
                      "rotate-[2deg] border-[#d8dfc9] bg-[#edf3df]",
                      "rotate-[-1deg] border-[#d9cdec] bg-[#f0ebf8]",
                      "rotate-[3deg] border-[#ead5df] bg-[#fae9ef]",
                      "rotate-[-2deg] border-[#e7d9b3] bg-[#fff6c9]",
                    ];

                    return (
                      <motion.span
                        key={option}
                        whileHover={{ y: -5, rotate: 0, scale: 1.04 }}
                        className={`border px-4 py-2 text-[15px] font-semibold text-[#1c2540] shadow-[3px_4px_0_rgba(28,37,64,0.05)] ${moodStyles[index % moodStyles.length]}`}
                        style={{ fontFamily: "CaveatLocal, cursive" }}
                      >
                        {option}
                      </motion.span>
                    );
                  })}
                </div>
              </div>

              <div className="relative min-h-[300px] overflow-hidden border-t border-[#d8cdbd] bg-[#efe7d9] p-3 sm:p-4 lg:border-l lg:border-t-0">
                <div className="absolute left-1/2 top-[-8px] z-20 h-8 w-28 -translate-x-1/2 rotate-[-2deg] bg-[#fff0a8]/80 shadow-sm" />
                <div className="relative h-full min-h-[300px] overflow-hidden border border-[#ded4c5] bg-[#fffdf7]">
                  <Image
                    src={finderVisual?.src ?? "/logo.png"}
                    alt={finderVisual?.alt ?? "Smells From Heaven fragrance finder visual"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 480px"
                    className="object-cover transition-transform duration-700 hover:scale-[1.04]"
                  />
                  <div className="absolute bottom-4 left-4 rotate-[-2deg] border border-[#d8cdbd] bg-[#fffdf7]/90 px-3 py-2 shadow-sm backdrop-blur-sm">
                    <p className="caveat text-lg text-[#6d7890]">your next memory starts here ♡</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="mb-7 border border-[#d8cdbd] bg-[#fffdf7] p-4 shadow-[0_12px_30px_rgba(72,56,35,0.07)] sm:p-5">
            <div className="mb-2 flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#7a8799]">
              <span>Question {step + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>

            <div className="h-3 overflow-hidden border border-[#ded4c5] bg-[#f2eadc] p-[2px]">
              <motion.div
                className="h-full bg-[#b88932]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <p className="caveat mt-2 text-base text-[#8b6f45]">
              one little choice at a time ✦
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 28, rotate: 1 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              exit={{ opacity: 0, x: -28, rotate: -1 }}
              transition={{ duration: 0.28 }}
              className="relative border border-[#d8cdbd] bg-[#fffdf7] p-5 shadow-[0_18px_42px_rgba(72,56,35,0.09)] sm:p-8"
            >
              <div className="absolute -top-3 left-10 h-7 w-24 rotate-[-3deg] bg-[#bfe1ec]/75 shadow-sm" />

              <p className="caveat mb-2 text-center text-lg text-[#7a8799]">
                tell us what feels right ♡
              </p>

              <h2 className="mb-7 text-center font-[var(--font-playfair)] text-2xl font-semibold tracking-[-0.04em] text-[#1c2540] sm:text-3xl">
                {currentQ.question}
              </h2>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {currentQ.options.map((option, index) => {
                  const isSelected = answers[currentQ.id] === option;
                  const optionStyles = [
                    "border-[#cddfe4] bg-[#eef8fa]",
                    "border-[#ead5df] bg-[#fae9ef]",
                    "border-[#d9cdec] bg-[#f0ebf8]",
                    "border-[#e7d9b3] bg-[#fff9dc]",
                    "border-[#d8dfc9] bg-[#edf7ed]",
                  ];

                  return (
                    <motion.button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      whileHover={{ y: -4, rotate: 0 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative w-full border px-4 py-4 text-left text-sm font-semibold text-[#1c2540] shadow-[3px_4px_0_rgba(28,37,64,0.04)] transition-all duration-200 ${optionStyles[index % optionStyles.length]} ${
                        isSelected
                          ? "ring-2 ring-[#b88932] ring-offset-2 ring-offset-[#fffdf7]"
                          : "hover:shadow-[6px_7px_0_rgba(28,37,64,0.06)]"
                      }`}
                    >
                      <span className="block text-[17px]" style={{ fontFamily: "CaveatLocal, cursive" }}>
                        {option}
                      </span>
                      <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.12em] text-[#7a8799]">
                        tap to choose
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {step > 0 && (
            <div className="mt-6 flex justify-start">
              <button
                onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
                className="inline-flex items-center gap-2 border border-[#cbbd9e] bg-[#fffdf7] px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#1c2540] shadow-[3px_4px_0_rgba(28,37,64,0.04)] transition-all hover:-translate-y-1 hover:border-[#b88932]"
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
