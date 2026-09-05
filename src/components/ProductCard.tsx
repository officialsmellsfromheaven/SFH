"use client";

import { Heart, MessageCircle, Sparkles, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useState } from "react";
import { useWishlistStore } from "@/lib/store";
import {
  Product,
  getProductFragranceFamilies,
  getProductPrimaryImage,
  getProductSlug,
} from "@/lib/data";
import { getLowestProductPrice } from "@/lib/pricing";
import { formatPrice } from "@/lib/utils";
import { orderConfig } from "@/lib/orderConfig";
import SafeImage from "@/components/ui/SafeImage";
import Badge from "@/components/ui/Badge";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const { toggleWishlist, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);
  const fragranceTags = getProductFragranceFamilies(product);
  const productImage = getProductPrimaryImage(product);
  const productSlug = getProductSlug(product);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Large curated message library. Selection is deterministic per product, so
  // every current product gets its own scrapbook thought without an API call.
  const scrapbookMessages = [
    "a quiet scent can speak volumes.",
    "some moments arrive wrapped in fragrance.",
    "leave kindness in the air you pass through.",
    "the best memories know how to linger.",
    "let your presence have a signature.",
    "fragrance is the invisible part of the story.",
    "some scents stay long after the moment leaves.",
    "a beautiful day deserves a beautiful beginning.",
    "wear something worth remembering.",
    "every presence leaves a little atmosphere behind.",
    "the right scent turns a moment into a memory.",
    "soft notes, lasting impressions.",
    "good fragrance is felt before it is noticed.",
    "make ordinary moments feel a little more golden.",
    "some memories begin with a single breath.",
    "carry a little beauty wherever you go.",
    "your scent can be part of the welcome.",
    "there is poetry in the way fragrance lingers.",
    "let the moment stay a little longer.",
    "a signature is something only you can leave.",
    "fragrance gives memories another way to return.",
    "quiet confidence has its own scent.",
    "leave the room with a story still in the air.",
    "some things are remembered without words.",
    "wear the feeling you want to leave behind.",
    "beauty does not need to announce itself.",
    "a familiar scent can bring a whole moment home.",
    "make your everyday worth remembering.",
    "let your fragrance finish the sentence.",
    "some scents feel like a place you once loved.",
    "presence is felt long before it is explained.",
    "the smallest details often become the memories.",
    "a good scent makes time feel softer.",
    "keep a little wonder close.",
    "fragrance is a memory waiting to happen.",
    "let your moments have their own signature.",
    "some aromas become part of who we are.",
    "wear something that feels like you.",
    "the air remembers what the heart keeps.",
    "make room for beautiful little moments.",
    "a scent can turn an entrance into an impression.",
    "there is elegance in being quietly unforgettable.",
    "let every day carry a beautiful note.",
    "some fragrances feel like sunlight on a good day.",
    "your story deserves a scent of its own.",
    "good things linger.",
    "let your presence speak softly.",
    "fragrance turns passing moments into keepsakes.",
    "some memories have a beginning, a middle, and a scent.",
    "wear the moment while it is still becoming.",
    "an unforgettable presence is never just seen.",
    "let the air remember you kindly.",
    "there is magic in a scent that feels familiar.",
    "small rituals make beautiful lives.",
    "one breath can change the feeling of a room.",
    "let your everyday carry a little poetry.",
    "fragrance is the detail people remember later.",
    "some scents belong to chapters, not occasions.",
    "wear a little confidence into the day.",
    "let beautiful things become part of your routine.",
    "the finest impressions are often invisible.",
    "some moments deserve to linger.",
    "make an impression worth keeping.",
    "your fragrance should feel like a secret only you know.",
    "let your scent arrive with quiet confidence.",
    "a beautiful fragrance leaves more than a trail.",
    "memories have a way of finding their way back.",
    "there is character in every note.",
    "let the little things become legendary.",
    "some scents feel like a handwritten letter.",
    "wear something that makes the moment yours.",
    "fragrance is where feeling meets memory.",
    "leave behind warmth, never just a trail.",
    "let your signature be unmistakably yours.",
    "some days deserve their own fragrance.",
    "a scent can hold a feeling without saying a word.",
    "make space for moments that stay.",
    "good fragrance becomes part of your presence.",
    "let the room remember something beautiful.",
    "some notes are made for unforgettable chapters.",
    "wear the kind of scent that feels like home.",
    "every beautiful memory starts somewhere.",
    "let your scent tell a gentler story.",
    "the best details are the ones felt, not explained.",
    "a little fragrance can change the whole mood.",
    "let your presence linger for the right reasons.",
    "some aromas become part of our personal history.",
    "wear a feeling, leave an impression.",
    "fragrance is a quiet form of self-expression.",
    "make today a memory worth returning to.",
    "let every note have a purpose.",
    "some scents become signatures without trying.",
    "the air around you can tell a story.",
    "wear something that makes you pause and smile.",
    "there is beauty in a fragrance that feels effortless.",
    "let your scent be part of the moment, not the noise.",
    "some memories smell exactly like happiness.",
    "carry your own little atmosphere.",
    "fragrance makes the invisible unforgettable.",
    "let this moment have a beautiful afterthought.",
    "your presence deserves more than an ordinary scent.",
    "some stories are written in notes.",
    "leave a trace of something beautiful.",
    "wear the memory before it becomes one.",
    "let your fragrance become part of the chapter.",
    "good scent, good energy, good memories.",
    "some feelings are easier to remember by scent.",
    "make your signature something worth discovering.",
    "let the day begin with a beautiful note.",
    "fragrance is a small luxury with a long echo.",
    "some scents do not enter a room; they change it.",
    "wear the mood you want the world to feel.",
    "let every entrance carry a little intention.",
    "beautiful things are often remembered in details.",
    "some fragrances feel like finding an old photograph.",
    "your scent is part of the way you are remembered.",
    "let the air hold onto something lovely.",
    "there is a story hiding in every beautiful note.",
    "make the ordinary smell extraordinary.",
    "wear something that feels like your own little ritual.",
    "some moments deserve more than words.",
    "let your fragrance become a familiar part of you.",
    "the most personal details are often invisible.",
    "leave a softer world behind you.",
  ];

  const productSeed = `${product.id}-${product.name}`;
  const messageIndex = productSeed
    .split("")
    .reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + 1), 0) % scrapbookMessages.length;

  const scrapbookPalettes = [
    { tape: "#bfe1ec", paper: "#eef8fa", ink: "#456875" },
    { tape: "#f3c7d3", paper: "#fae9ef", ink: "#765966" },
    { tape: "#d9cdec", paper: "#f0ebf8", ink: "#665878" },
    { tape: "#fff0a8", paper: "#fff9dc", ink: "#7b6833" },
    { tape: "#cfe6cf", paper: "#edf7ed", ink: "#55705a" },
  ];

  const scrapbookNote = {
    text: scrapbookMessages[messageIndex],
    ...scrapbookPalettes[messageIndex % scrapbookPalettes.length],
  };

  const detailNotes = [
    "a little scent story, just for you ♡",
    "let this fragrance become part of your story.",
    "some moments deserve a signature scent ✦",
    "for the days that become favourite memories ♡",
    "a beautiful note for a beautiful chapter.",
    "keep the feeling, wear the fragrance.",
    "made for moments that deserve to linger.",
    "a quiet detail that changes the whole mood.",
    "let the atmosphere say a little more.",
    "for wherever your next story takes you.",
  ];

  const closingNotes = [
    "keep this moment close ✦",
    "wear the feeling ♡",
    "made to be remembered.",
    "let it linger.",
    "for your next beautiful chapter.",
    "a little luxury for the everyday.",
    "leave something lovely behind.",
    "your signature, softly.",
    "one beautiful detail.",
    "stay unforgettable ✦",
  ];

  const detailNote = detailNotes[messageIndex % detailNotes.length];
  const closingNote = closingNotes[messageIndex % closingNotes.length];

  const familyLabel =
    product.fragranceFamily && product.fragranceFamily.trim()
      ? product.fragranceFamily.trim()
      : "A LITTLE PIECE OF HEAVEN";

  const handleWishlist = () => {
    toggleWishlist(product.id);
    toast(wishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 28, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -8,
        rotate: -0.45,
        transition: {
          duration: 0.35,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
      className="product-card group relative flex min-w-0 self-start flex-col overflow-visible rounded-[1.15rem] border border-[#dfd3bf] bg-[#fffdf7] p-3 text-left shadow-[0_12px_28px_rgba(40,30,20,0.07)] transition-[box-shadow,border-color] duration-500 hover:border-[#c9b083] hover:shadow-[0_24px_55px_rgba(40,30,20,0.14)]"
    >
      {/* Heaven glow behind the paper */}
      <div className="pointer-events-none absolute -inset-3 -z-10 rounded-[1.8rem] bg-[radial-gradient(circle_at_20%_20%,rgba(243,199,211,0.32),transparent_34%),radial-gradient(circle_at_85%_20%,rgba(191,225,236,0.34),transparent_34%),radial-gradient(circle_at_55%_95%,rgba(217,205,236,0.3),transparent_38%)] opacity-70 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

      {/* Tiny scrapbook corner marks */}
      <span className="pointer-events-none absolute -left-1 top-8 h-2 w-8 -rotate-[14deg] rounded-full bg-[#f3c7d3] opacity-80" />
      <span className="pointer-events-none absolute -right-2 bottom-24 h-2 w-10 rotate-[18deg] rounded-full bg-[#bfe1ec] opacity-80" />

      {/* Top paper label */}
      <div className="relative z-10 flex items-start justify-between gap-2 px-1 pb-2">
        <div className="min-w-0">
          <p
            className="max-w-[175px] text-[15px] leading-[1.05]"
            style={{
              color: scrapbookNote.ink,
              fontFamily: "CaveatLocal, cursive",
            }}
          >
            {scrapbookNote.text}
          </p>
          <p className="mt-1 truncate text-[8px] font-semibold uppercase tracking-[0.18em] text-[#9b8258]">
            {familyLabel}
          </p>
        </div>

        <motion.button
          type="button"
          onClick={handleWishlist}
          aria-label={
            wishlisted ? "Remove from wishlist" : "Add to wishlist"
          }
          whileTap={{ scale: 0.88 }}
          whileHover={{ scale: 1.08, rotate: 5 }}
          transition={{ duration: 0.18 }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#e7dbc8] bg-[#fffaf0] text-[#4d4d4d] shadow-[0_4px_10px_rgba(0,0,0,0.04)] transition-colors duration-300 hover:border-[#b88932] hover:text-[#111111]"
        >
          <Heart
            size={16}
            strokeWidth={1.8}
            fill={wishlisted ? "currentColor" : "none"}
          />
        </motion.button>
      </div>

      {/* Pasted-photo / polaroid image area */}
      <Link
        href={`/product/${productSlug}`}
        className="relative block px-1 pt-1"
      >
        <motion.div
          whileHover={{ scale: 1.018, rotate: 0.5 }}
          transition={{
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative mx-auto aspect-[0.92/1] w-full overflow-visible border border-[#e6ddcf] bg-[#f8f3ea] p-2 shadow-[0_8px_18px_rgba(30,25,20,0.09)]"
        >
          {/* taped photo */}
          <span className="pointer-events-none absolute -top-3 left-1/2 z-20 h-7 w-20 -translate-x-1/2 -rotate-[2deg] opacity-85 shadow-[0_2px_5px_rgba(0,0,0,0.05)]" style={{ backgroundColor: scrapbookNote.tape }} />

          <div className="relative h-full w-full overflow-hidden bg-[#f3eee5]">
            <SafeImage
              src={productImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 88vw, (max-width: 1024px) 42vw, 250px"
              className="object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-[1.055]"
            />

            {/* photo dust / paper wash */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,255,255,0.55),transparent_22%),radial-gradient(circle_at_82%_75%,rgba(255,255,255,0.28),transparent_24%)] opacity-70" />
          </div>

          {/* side doodle */}
          <span
            className="pointer-events-none absolute -right-7 top-1/2 hidden -translate-y-1/2 rotate-[8deg] text-[25px] text-[#b88932] md:block"
            style={{ fontFamily: "CaveatLocal, cursive" }}
          >
            ↗
          </span>
        </motion.div>
      </Link>

      {/* Product paper note */}
      <div className="relative mt-3 flex flex-1 flex-col px-1 pb-1">
        <Link href={`/product/${productSlug}`} className="block">
          <motion.h3
            whileHover={{ x: 2 }}
            transition={{ duration: 0.2 }}
            className="break-words text-[1.22rem] font-semibold leading-[1.05] tracking-[-0.035em] text-[#171717] max-[639px]:text-[1.12rem]"
          >
            {product.name}
          </motion.h3>
        </Link>

        {/* Desktop: hover reveal. Mobile: tap Details.
            This panel stays in normal flow on purpose. The Shop page groups
            cards into real rows with items-start, so opening one card grows
            only that card and pushes the next row down without stretching
            its siblings. */}
        <div
          className={`overflow-hidden transition-[max-height,opacity,margin] duration-300 ${
            detailsOpen
              ? "mt-3 max-h-44 opacity-100"
              : "mt-0 max-h-0 opacity-0"
          } md:group-hover:mt-3 md:group-hover:max-h-44 md:group-hover:opacity-100`}
        >
          <div
            className="relative rounded-[0.8rem] border border-dashed border-[#d9cdbb] px-3 py-2.5 shadow-[0_14px_28px_rgba(40,30,20,0.12)]"
            style={{ backgroundColor: scrapbookNote.paper }}
          >
            <span
              className="absolute -top-2 left-5 h-4 w-12 -rotate-[3deg] opacity-75"
              style={{ backgroundColor: scrapbookNote.tape }}
            />

            <div className="flex flex-wrap justify-center gap-1.5 pt-1">
              {fragranceTags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#e4d8c7] bg-[#fffdf7] px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.11em] text-[#62594f]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="mt-2 text-center text-[10px] leading-4 text-[#6e6e73]">
              {product.longevity} longevity · {product.projection} projection
            </p>

            <p
              className="mt-1 text-center text-[16px] leading-4"
              style={{
                color: scrapbookNote.ink,
                fontFamily: "CaveatLocal, cursive",
              }}
            >
              {detailNote}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setDetailsOpen((open) => !open)}
          className="mt-2 inline-flex items-center justify-center gap-1 self-center text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8c6d3e] md:hidden"
        >
          {detailsOpen ? "Hide details" : "Tap for details"}
          <ArrowUpRight
            size={11}
            className={`transition-transform duration-300 ${
              detailsOpen ? "rotate-90" : ""
            }`}
          />
        </button>

        <div className="mt-2 flex items-end justify-between gap-2 border-t border-dashed border-[#ddd1bf] pt-2">
          <div>
            <p
              className="text-[15px] leading-none text-[#6c6256]"
              style={{ fontFamily: "CaveatLocal, cursive" }}
            >
              starting at
            </p>
            <p className="mt-0.5 text-[15px] font-semibold text-[#151515]">
              {formatPrice(getLowestProductPrice(product))}
            </p>
          </div>

          <span
            className="rotate-[-3deg] text-[14px] text-[#1c2540]"
            style={{ fontFamily: "CaveatLocal, cursive" }}
          >
            {closingNote}
          </span>
        </div>

        {/* WhatsApp */}
        <div className="mt-2.5 flex justify-center">
          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <Link
              href={`https://wa.me/${orderConfig.whatsappNumber}?text=${encodeURIComponent(
                `Hello! I would like to know more about ${product.name}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-[0.7rem] border border-[#1c2540] bg-[#1c2540] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-white transition-all duration-300 hover:-rotate-[0.5deg] hover:bg-[#283451] hover:shadow-[0_10px_20px_rgba(28,37,64,0.14)]"
            >
              <MessageCircle size={13} />
              Ask about this scent
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}