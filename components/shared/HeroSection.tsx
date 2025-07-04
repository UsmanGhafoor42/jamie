import Image from "next/image";
import React from "react";
import DtfButton from "../custom/DtfButton";

export default function HeroSection() {
  return (
    <section className="py-10 layout">
      <div className="flex flex-col md:flex-row justify-center items-start gap-10 text-center">
        {/* Top Buttons */}
        <div className="w-full md:w-2/3">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button className="px-4 py-2">
              <Image
                src="/images/hero-section/hero-image1.png"
                alt="DTF Order Individual Sheets"
                width={250}
                height={100}
              />
            </button>
            <button className="px-4 py-2">
              <Image
                src="/images/hero-section/hero-image2.png"
                alt="DTF Order Individual Sheets"
                width={250}
                height={100}
              />
            </button>
            <button className="px-4 py-2">
              <Image
                src="/images/hero-section/hero-image3.png"
                alt="DTF Order Individual Sheets"
                width={250}
                height={100}
              />
            </button>
          </div>

          {/* Steps Section */}
          <div className="flex flex-col md:flex-row justify-center items-start gap-10 mb-12 text-center">
            <Image
              width={300}
              height={300}
              src="/images/hero-section/hero-card1.png"
              alt="T-Shirt Design Preview"
              className=""
            />
            <Image
              width={300}
              height={300}
              src="/images/hero-section/hero-card2.png"
              alt="T-Shirt Design Preview"
              className=""
            />
            <Image
              width={300}
              height={300}
              src="/images/hero-section/hero-card3.png"
              alt="T-Shirt Design Preview"
              className=""
            />
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-poppins font-bold text-center text-black mb-10">
            DTF Transfer Chosen By Thousand Of Creators
          </h1>
          <p>
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
          </p>
          <h2 className="text-2xl font-bold text-center text-black mb-10 mt-10">
            Whats the differance between UV DTF and DTF?
          </h2>
          <p>
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
          </p>
        </div>

        {/* Right Panel */}
        <div className="flex justify-center md:justify-end w-full md:w-1/3">
          <div className="bg-[var(--green)] p-4 rounded-lg shadow-md w-full text-center max-w-sm">
            <Image
              width={100}
              height={100}
              src="/images/apperal-side-card.webp"
              alt="T-Shirt Design Preview"
              className="w-full max-w-sm rounded mb-4"
            />
            <div className="flex flex-col justify-center gap-10 text-white text-xl font-bold mb-4 max-w-sm">
              <DtfButton
                title="Gang Sheet DTF"
                url="/gang-sheet-builder"
                className="px-12 py-6 w-full text-xl max-w-sm"
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
              width={100}
              height={100}
              src="/images/made-in-USA.webp"
              alt="T-Shirt Design Preview"
              className="w-full max-w-sm rounded mb-4"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
