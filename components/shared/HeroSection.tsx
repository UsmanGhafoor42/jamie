"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import DtfButton from "../custom/DtfButton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, easeInOut } from "framer-motion";

function HeroSlider() {
  const slides = [
    {
      image: "/images/hero-section/slider1.jpg",
      title: "Custom UV Stickers",
      description:
        "Permanent stickers great for promotional products and so much more",
      button: { text: "Click Here", href: "/uv-stickers" },
    },
    {
      image: "/images/hero-section/slider2.jpg",
      title: "DTF Gang Sheets",
      description: "Order large format gang sheets for bulk savings",
      button: { text: "Order Now", href: "/gang-sheet-builder" },
    },
    {
      image: "/images/hero-section/slider3.jpg",
      title: "Individual DTF Transfers",
      description: "Perfect for small runs and custom designs",
      button: { text: "Shop Now", href: "/individual-sheet-builder" },
    },
  ];
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-slide effect
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000); // 5 seconds per slide

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [current, slides.length]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };
  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slide = slides[current];

  const variants = {
    initial: { opacity: 0, y: 40, scale: 0.95 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: easeInOut },
    },
    exit: {
      opacity: 0,
      y: -40,
      scale: 0.95,
      transition: { duration: 0.5, ease: easeInOut },
    },
  };

  return (
    <div className="relative w-full h-[250px] md:h-[350px] lg:h-[420px] rounded-xl overflow-hidden flex items-center justify-center mb-8">
      {/* Background image with overlay and scaling */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.image}
          className="absolute inset-0"
          initial={{ scale: 1.05, opacity: 0.5 }}
          animate={{
            scale: 1.1,
            opacity: 1,
            transition: { duration: 1.2, ease: easeInOut },
          }}
          exit={{
            scale: 1.05,
            opacity: 0.5,
            transition: { duration: 0.7, ease: easeInOut },
          }}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover w-full h-full"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </motion.div>
      </AnimatePresence>
      {/* Slide content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.title}
          className="relative z-10 flex flex-col items-center justify-center text-center text-white px-4"
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <motion.h2
            className="text-2xl md:text-4xl font-bold mb-2"
            variants={variants}
          >
            {slide.title}
          </motion.h2>
          <motion.p className="mb-4 text-base md:text-lg" variants={variants}>
            {slide.description}
          </motion.p>
          <motion.a
            href={slide.button.href}
            className="px-6 py-2 border border-white rounded bg-white/10 hover:bg-white/20 text-white font-semibold transition"
            variants={variants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            {slide.button.text}
          </motion.a>
        </motion.div>
      </AnimatePresence>
      {/* Prev/Next buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer text-white z-20 w-8 h-8 text-xl"
        aria-label="Previous Slide"
      >
        <ChevronLeft />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-white z-20 w-8 h-8 text-xl"
        aria-label="Next Slide"
      >
        <ChevronRight />
      </button>
      {/* Dots for mobile navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`w-2 h-2 rounded-full ${
              idx === current ? "bg-white" : "bg-white/40"
            }`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="py-10 layout">
      <div className="flex flex-col md:flex-row justify-center items-start gap-10 text-center">
        {/* Top Buttons */}
        <div className="w-full md:w-2/3">
          <HeroSlider />

          {/* Steps Section */}
          <div className="flex flex-col md:flex-row justify-center items-start gap-10 mb-12 text-center">
            {[1, 2, 3].map((i, idx) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.85, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.2 + idx * 0.15,
                  ease: easeInOut,
                }}
                viewport={{ once: true }}
              >
                <Image
                  width={300}
                  height={300}
                  src={`/images/hero-section/hero-card${i}.png`}
                  alt="T-Shirt Design Preview"
                />
              </motion.div>
            ))}
          </div>

          {/* Heading */}
          <motion.h1
            className="text-3xl md:text-5xl lg:text-6xl font-poppins font-bold text-center text-black mb-10"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: easeInOut }}
            viewport={{ once: true }}
          >
            DTF Transfer Chosen By Thousand Of Creators
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: easeInOut }}
            viewport={{ once: true }}
          >
            In today’s fast-paced and quality-driven market, sourcing within the
            USA has never been more important. When you choose DTF transfers
            made in the USA and partner with a U.S.-based company, you’re not
            just investing in a product—you’re investing in reliability, speed,
            and clear communication. You get to speak directly with real people
            who understand your needs, offer expert guidance, and stand behind
            their work. No language barriers, no overseas delays—just
            high-quality transfers produced on-site, delivered quickly, and
            backed by dependable, human service. Supporting American-made also
            strengthens local businesses and helps ensure higher standards
            across the board.
          </motion.p>
          <h2 className="text-2xl font-bold text-center text-black mb-10 mt-10">
            Whats the differance between UV DTF and DTF?
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: easeInOut }}
            viewport={{ once: true }}
          >
            DTF (Direct to Film) and UV DTF stickers are two different printing
            methods used for applying custom graphics, but they serve different
            purposes and materials. DTF is mainly used for fabric
            printing—designs are printed on a special film, covered in adhesive
            powder, heat pressed, and then transferred onto clothing or other
            textiles like cotton, polyester, or canvas. It’s ideal for t-shirts,
            hoodies, and tote bags. On the other hand, UV DTF stickers are
            designed for hard, smooth surfaces like glass, plastic, metal, or
            acrylic. These are printed using UV light-cured ink and come with a
            peel-and-stick application that doesn’t require heat. UV DTF is
            perfect for customizing tumblers, candle jars, laptops, and
            packaging. In short, DTF is best for apparel, while UV DTF is best
            for hard goods and stickers.
          </motion.p>
        </div>

        {/* Right Panel */}
        <div className="flex justify-center md:justify-end w-full md:w-1/3">
          <motion.div
            className="bg-[var(--green)] p-4 rounded-lg shadow-md w-full text-center max-w-sm"
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: easeInOut }}
            viewport={{ once: true }}
          >
            <Image
              width={500}
              height={500}
              src="/images/apperal-side-card.webp"
              alt="T-Shirt Design Preview"
              className="w-full max-w-sm rounded mb-4"
            />
            <div className="flex flex-col justify-center gap-5 text-white text-xl font-bold mb-4 max-w-sm">
              <DtfButton
                title="Gang Sheet DTF"
                url="/gang-sheet-builder"
                className="px-12 py-6 w-full /images/hero-section/slider1.jpg"
              />
              <DtfButton
                title="Individual Sheet DTF"
                url="/individual-sheet-builder"
                className="px-12 py-6 w-full text-xl max-w-sm"
              />
              <DtfButton
                title="UV Stickers DTF"
                url="/uv-stickers"
                className="px-12 py-6 w-full text-xl max-w-sm"
              />
            </div>
            <Image
              width={500}
              height={500}
              src="/images/made-in-USA.webp"
              alt="T-Shirt Design Preview"
              className="w-full max-w-sm rounded mb-4"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
