"use client";
import AnotherHeroSection from "@/components/shared/AnotherHeroSection";
import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    section: "DTF Printing",
    items: [
      {
        question: "What is DTF (Direct-to-Film) printing?",
        answer:
          "DTF printing involves printing a design onto a special film using a DTF printer and then transferring that design onto fabric using heat and pressure. Unlike screen printing or vinyl, DTF doesn’t require weeding or pretreatment for most fabrics.",
      },
      {
        question: "How the DTF Process Works",
        answer: [
          [
            "1. Design Preparation: You create your artwork digitally (usually in PNG format with a transparent background).",
            "2. Film Preparation: The design is printed onto a clear PET film using special DTF inks. These printers typically lay down white ink last as a backing.",
            "3. Apply Adhesive Powder: A fine powdered adhesive is applied to the wet ink on the film. This powder sticks to the inked areas only.",
            "4. Cure the Powder: The film is heated briefly (usually with a curing oven or heat press hovering above) to melt the powder into an adhesive.",
            "5. Transfer to Fabric: Place the film onto your garment and press it with a heat press. The design bonds to the fabric.",
            "6. Peel the Film: After pressing, peel the film away—either hot or cold peel depending on the materials used.",
          ].map((step, idx) => (
            <React.Fragment key={idx}>
              {step}
              <br />
            </React.Fragment>
          )),
        ],
      },
      {
        question: "Why People Use DTF Printing",
        answer: [
          [
            "1. Works on almost any fabric (cotton, polyester, blends, nylon, etc.)",
            "2. No weeding or pretreatment required",
            "3. Vibrant, full-color designs including gradients and fine detail",
            "4. Soft and durable finish",
            "5. Great for short runs or on-demand printing",
          ].map((step, idx) => (
            <React.Fragment key={idx}>
              {step}
              <br />
            </React.Fragment>
          )),
        ],
      },
      {
        question: "What Are UV DTF Stickers?",
        answer:
          "UV DTF stickers are made by printing a design onto a special film using UV-curable inks. Then, using a two-layer adhesive system, the design is transferred onto any smooth surface—almost like a peel-and-stick tattoo for objects.",
      },
      {
        question: "How UV DTF Stickers Work",
        answer: [
          [
            "1. Design Printing: A UV printer prints your design on a transparent adhesive film (called A Film). UV inks are cured instantly by ultraviolet light during printing, which makes them vibrant and durable.",
            "2. Lamination Layer: A second protective film (called B Film) is laminated on top. This helps hold the design in place during transfer.",
            "3. Peel and Stick: You peel off the backing, apply the sticker to the surface, press it down firmly, then peel off the top film—leaving just the printed design stuck in place.",
          ].map((step, idx) => (
            <React.Fragment key={idx}>
              {step}
              <br />
            </React.Fragment>
          )),
        ],
      },
      {
        question: "Why Use UV DTF Stickers?",
        answer: [
          [
            "No need for transfer tape",
            "Full-color, detailed prints",
            "Adheres to almost any surface (tumblers, mugs, laptops, phone cases, wood, walls, etc.)",
            "Scratch-resistant and waterproof",
            "No heat or special tools required for application",
            "",
            "Common Uses:",
            "Custom branding on products (cups, bottles, packaging)",
            "Personalizing items like phone cases or electronics",
            "Signage, labels, and decals for small businesses",
            "DIY and craft projects",
          ].map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              <br />
              {line === "Common Uses:" && <br />}
            </React.Fragment>
          )),
        ],
      },
      {
        question: "Best practice to apply Transfers",
        answer: [
          [
            "How to Apply DTF Transfers with a Heat Press",
            "What You’ll Need:",
            "DTF transfer",
            "Garment (cotton, polyester, blends, etc.)",
            "Heat press",
            "Parchment paper or Teflon sheet (optional)",
            "",
            "Step 1: Prep Your Garment",
            "Lay the garment flat on the press.",
            "Pre-press it for 5–10 seconds at 280–300°F to remove wrinkles and moisture.",
            "",
            "Step 2: Position the Transfer",
            "Place the DTF transfer face up (design facing you) and the ink side down against the garment.",
            "Make sure it’s aligned exactly how you want it.",
            "",
            "Step 3: Press the Transfer",
            "Temperature: 280°F to 320°F",
            "Time: 10–15 seconds",
            "Pressure: Medium to firm (around 6–8 pressure setting)",
            "",
            "Step 4: Cool & Peel",
            "Let the transfer cool down completely before peeling (cold peel).",
            "Slowly peel the film off—your design should stay perfectly on the garment.",
            "Hot & Peel- Pull right away (used mostly)",
            "",
            "Step 5: Post-Press (Recommended)",
            "Place parchment paper or a Teflon sheet over the design.",
            "Press again for 5–10 seconds to lock in the print and improve durability.",
            "",
            "Care Tips:",
            "Wash inside out, cold water, gentle cycle.",
            "Avoid bleach and fabric softener.",
            "Hang dry or tumble dry low.",
          ].map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              <br />
              {line === "Common Uses:" && <br />}
            </React.Fragment>
          )),
        ],
      },
      {
        question: "Unique and trending items to Print DTFs on",
        answer: [
          [
            "👕 Apparel",
            "Oversized Vintage-Wash Tees",
            "Trending in streetwear and band-style merch.",
            "",
            "Crop Tops & Baby Tees",
            "Big in youth and fashion-forward markets.",
            "",
            "Raglan/Baseball Tees",
            "Great for team gear, events, or retro-inspired drops.",
            "",
            "Pajama Sets or Lounge Shorts",
            "Comfort + customization = hot sellers.",
            "",
            "Work Shirts / Mechanic-Style Button-Ups",
            "Huge in custom shop and garage merch.",
            "",
            "👜 Accessories",
            "Canvas Utility Totes with Pockets",
            "Eco-friendly and highly marketable.",
            "",
            "Sling Bags / Crossbody Bags",
            "Great for urban and festival styles.",
            "",
            "Bucket Hats & Flat Bill Snapbacks",
            "Ideal for bold logo prints.",
            "",
            "🏡 Home & Lifestyle",
            "Throw Pillow Covers (cotton or linen)",
            "Seasonal or personalized decor options.",
            "",
            "Canvas Aprons",
            "Perfect for cooking, art studios, or baristas.",
            "",
            "Kitchen Towels",
            "Funny quotes or seasonal prints are great for Etsy shops.",
            "",
            "🛍️ Event & Promo Items",
            "Drawstring Backpacks",
            "Lightweight, popular at races or team events.",
            "",
            "Zip-Up Pouches (makeup/tool bags)",
            "Ideal for giveaways or influencer packs.",
            "",
            "Can Coolers / Koozies",
            "Tailgate and wedding favorite.",
            "",
            "🔥 Niche & Creative",
            "Pet Bandanas",
            "Huge hit with pet lovers and boutiques.",
            "",
            "Gaming Mouse Pads",
            "Custom art or logos for gamer audiences.",
            "",
            "Patches (DTF on twill/fabric for heat pressing later)",
            "Great for branding or collector series.",
          ].map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              <br />
            </React.Fragment>
          )),
        ],
      },
      {
        question: "Unique and trending items to Print UV STICKERS on",
        answer: [
          [
            "🥤 Drinkware & Kitchen",
            "Stanley Cups & Dupe Tumblers",
            "A hot trend—perfect for custom names, quotes, or logos.",
            "",
            "Glass Can Cups with Bamboo Lids",
            "Huge hit on Etsy and with influencers.",
            "",
            "Ceramic Mugs with Curved Surfaces",
            "UV DTF sticks great and adds a premium look.",
            "",
            "Wine Glasses & Champagne Flutes",
            "Great for weddings or party favors.",
            "",
            "🖥️ Tech & Work Essentials",
            "Laptops & iPads (Hard Shells)",
            "Personalize with logos or aesthetic sticker sets.",
            "",
            "Phone Stands or Wireless Chargers",
            "Sleek surfaces ideal for branding.",
            "",
            "Desk Organizers & Pen Holders (Acrylic or Metal)",
            "Elevate your workspace or office promo kits.",
            "",
            "🛍️ Home & Lifestyle",
            "Scented Candle Jars (Glass or Metal)",
            "Great for custom gift sets or private-label brands.",
            "",
            "Bathroom Dispensers & Containers",
            "Trendy for aesthetic home setups.",
            "",
            "Acrylic Keychains & Ornaments",
            "Great for seasonal promos or boutique add-ons.",
            "",
            "🚗 On-the-Go & Outdoor",
            "Coolers & Ice Buckets",
            "Perfect for tailgating or branded giveaways.",
            "",
            "Car Window Stickers (Inside or Outside)",
            "Custom club decals, baby on board, or fun graphics.",
            "",
            "Acrylic License Plate Frames or Inserts",
            "Great for clubs, events, or influencers.",
            "",
            "🧴 Packaging & Beauty",
            "Cosmetic Bottles & Lip Balm Tubes",
            "Small batch branding or seasonal collections.",
            "",
            "Perfume Atomizers (Glass or Plastic)",
            "Elegant way to label luxury samples.",
            "",
            "Gift Boxes & Subscription Kit Packaging",
            "Adds a luxury touch without printing directly.",
            "",
            "🐾 Fun & Niche",
            "Pet Food Jars & Treat Containers",
            "Personalize with pet names or funny icons.",
            "",
            "Mini Trash Cans for Cars or Desks",
            "Big with Gen Z and TikTok “desk setup” trends.",
            "",
            "Acrylic Fridge Calendars or To-Do Boards",
            "Useful and highly giftable.",
          ].map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              <br />
            </React.Fragment>
          )),
        ],
      },
    ],
  },
  {
    section: "Shipping",
    items: [
      {
        question: "What are your shipping options and costs?",
        answer: [
          [
            "We offer several shipping options to cater to your needs:​",
            "Standard Shipping: Delivered within 3-5 business days.​",
            "Expedited Shipping: Delivered within 2-3 business days.​",
            "Overnight Shipping: Delivered the next business day.​",
            "Shipping costs are calculated based on the selected shipping method and the destination. You can view the exact shipping charges at checkout before finalizing your order.",
          ].map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              <br />
              {line === "Common Uses:" && <br />}
            </React.Fragment>
          )),
        ],
      },
      {
        question: "Do you offer international shipping?",
        answer: "As of right now we do not offer international shipping",
      },
      {
        question: "How can I track my order?",
        answer:
          "Yes once order is placed and filled you will receive and email with tracking info.",
      },
    ],
  },
  {
    section: "Washing and Care Instructions",
    items: [
      {
        question: "How should I wash garments with DTF prints?",
        answer: [
          [
            "To ensure the longevity and vibrancy of your DTF-printed garments, follow these care instructions:",
            "1. Turn the garment inside out: This protects the print from abrasion during washing.​",
            "2. Use cold water: Wash with cold or lukewarm water (30-40°C) to prevent color fading and fabric shrinkage.",
            "3. Select a gentle cycle: Opt for a delicate or gentle wash setting to minimize stress on the print.​",
            "4. Use mild detergent: Avoid harsh detergents, bleach, or fabric softeners, as they can degrade the print quality.​",
          ].map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              <br />
              {line === "Common Uses:" && <br />}
            </React.Fragment>
          )),
        ],
      },
      {
        question: "Can I dry DTF-printed garments in a dryer?",
        answer: [
          [
            "DO:",
            "Use low heat or delicate setting",
            "Turn the garment inside out before drying",
            "Remove promptly once dry to avoid over-drying",
            "AVOID:",
            "High heat – it can cause the print to crack or peel prematurely",
            "Over-drying – prolonged heat exposure can break down the adhesive and inks",
            "Dryer sheets – they sometimes contain chemicals that affect print longevity",
          ].map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              <br />
              {line === "Common Uses:" && <br />}
            </React.Fragment>
          )),
        ],
      },
      {
        question: "Is ironing safe for DTF prints?",
        answer: [
          [
            "⚠️ Why Not Iron Directly?",
            "DTF prints use heat-activated adhesives.",
            "",
            "Direct contact with a hot iron can melt, warp, or peel the print.",
            "",
            "It may create shiny marks or cause lifting on edges.",
            "",
            "✅ Safe Ironing Method for DTF Garments:",
            "If you must iron a DTF-printed garment:",
            "",
            "Turn the garment inside out",
            "This protects the print from direct heat.",
            "",
            "Use a pressing cloth",
            "If ironing the front, place a thin cotton cloth, parchment paper, or Teflon sheet over the design.",
            "",
            "Set the iron to low-medium heat",
            "Avoid steam or high settings.",
            "",
            "Keep it quick and light",
            "Don’t hold the iron in one place—keep it moving.",
            "",
            "🔁 Best Alternative:",
            "To remove wrinkles safely, use a steamer or lightly tumble dry on low heat for a few minutes, then hang the garment immediately.",
          ].map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              <br />
            </React.Fragment>
          )),
        ],
      },
      {
        question: "Any additional tips for maintaining DTF prints?",
        answer: [
          [
            "Maintaining DTF (Direct to Film) prints properly can dramatically extend the life, color, and feel of your garments. Here are the top pro tips to keep them looking fresh:",
            "",
            "🧺 Washing Tips:",
            "✅ DO:",
            "Turn garments inside out before washing",
            "Use cold water and a gentle cycle",
            "Use mild detergent (no bleach or optical brighteners)",
            "Wash with similar colors and fabrics",
            "",
            "❌ AVOID:",
            "Hot water",
            "Harsh detergents or bleach",
            "Fabric softeners (they can affect adhesion over time)",
            "Overloading the washer",
            "",
            "🔥 Drying Tips:",
            "✅ DO:",
            "Tumble dry low or air dry",
            "Remove from the dryer promptly to prevent heat damage",
            "",
            "❌ AVOID:",
            "High heat settings",
            "Dryer sheets",
            "",
            "🧼 Ironing Tips:",
            "Never iron directly on the print",
            "Use a Teflon sheet or cotton cloth as a barrier",
            "Or iron the reverse side of the garment",
            "",
            "💡 Storage Tips:",
            "Fold printed garments instead of hanging if possible (reduces stretching or cracking over time)",
            "Store in a cool, dry place away from direct sunlight",
            "Avoid stacking hot/freshly printed garments — let them cure completely for at least 24 hours after pressing",
            "",
            "🛡️ Bonus: Post-Press After Application",
            "After peeling the carrier film, press again (5–10 sec with a Teflon or parchment sheet) to seal the print into the fabric. This adds durability and a smoother feel.",
          ].map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              <br />
            </React.Fragment>
          )),
        ],
      },
      {
        question: "How durable are DTF prints?",
        answer: [
          [
            "When applied and cared for properly, they can last 50+ washes without significant fading, cracking, or peeling.",
            "",
            "💪 DTF Print Durability Highlights:",
            "",
            "✅ Wash Life:",
            "Typically lasts 50–75 washes or more",
            "Comparable to or better than screen printing and vinyl when properly applied",
            "",
            "✅ Stretch & Flex:",
            "Prints stay intact even when the fabric stretches — great for athletic wear, kids’ clothing, and fitted garments",
            "",
            "✅ Fade Resistance:",
            "UV-stable inks help prevent fading under normal sunlight exposure",
            "Colors remain vibrant when washed with care",
            "",
            "✅ Crack Resistance:",
            "Because of the flexible adhesive used, DTF prints are less prone to cracking than traditional heat transfer vinyl (HTV)",
            "",
            "📉 Durability Depends On:",
            "Correct Heat Press Settings:",
            "Wrong temp, time, or pressure = poor adhesion = early peeling or cracking",
            "",
            "Fabric Type:",
            "Works on cotton, poly, blends, and more — but cheap or coated fabrics may reduce adhesion",
            "",
            "Post-Pressing:",
            "A second press with parchment or Teflon seals the design and boosts durability",
            "",
            "Aftercare:",
            "Washing in cold water, no bleach, low-heat drying, and turning garments inside out greatly extends life",
          ].map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              <br />
            </React.Fragment>
          )),
        ],
      },
    ],
  },
  {
    section: "Return Policy",
    items: [
      {
        question: "Return Policy",
        answer:
          "At Hot Market Design, your satisfaction is our priority. If you’re not 100% satisfied with your purchase, please contact us within 15 days of receiving your order to request a refund or discuss a resolution. While we strive to make things right, please note that refunds may not be available on all orders, especially for custom or personalized items. All return requests will be reviewed on a case-by-case basis. To initiate a return, please reach out to our customer service team with your order details, and we’ll guide you through the process.",
      },
    ],
  },
];

const FAQAccordion = () => {
  const [open, setOpen] = useState<{ section: number; item: number } | null>(
    null
  );

  const handleToggle = (sectionIdx: number, itemIdx: number) => {
    if (open && open.section === sectionIdx && open.item === itemIdx) {
      setOpen(null);
    } else {
      setOpen({ section: sectionIdx, item: itemIdx });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-10">
      {faqs.map((faqSection, sectionIdx) => (
        <div key={faqSection.section}>
          <h2 className="text-xl md:text-2xl font-bold text-center text-[var(--green)] mb-6">
            {faqSection.section}
          </h2>
          <div className="flex flex-col gap-4">
            {faqSection.items.map((item, itemIdx) => {
              const isOpen =
                open && open.section === sectionIdx && open.item === itemIdx;
              return (
                <div
                  key={item.question}
                  className="rounded-xl border border-[var(--green)] bg-white overflow-hidden shadow-sm"
                >
                  <button
                    className="w-full flex justify-between items-center px-6 py-4 text-left font-medium text-lg focus:outline-none transition-colors hover:bg-[var(--green)/10]"
                    onClick={() => handleToggle(sectionIdx, itemIdx)}
                  >
                    <span>{item.question}</span>
                    {isOpen ? (
                      <Minus className="w-6 h-6 text-[var(--green)]" />
                    ) : (
                      <Plus className="w-6 h-6 text-[var(--green)]" />
                    )}
                  </button>
                  <div
                    className={`px-6 pb-4 text-gray-700 text-base transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-fit opacity-100" : "max-h-0 opacity-0"
                    } overflow-hidden`}
                  >
                    {isOpen && <div>{item.answer}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

const page = () => {
  return (
    <div>
      <AnotherHeroSection title="Frequently Asked Question" />
      <div className="layout py-10">
        <FAQAccordion />
      </div>
    </div>
  );
};

export default page;
