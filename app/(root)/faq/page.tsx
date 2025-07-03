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
          "DTF printing is an advanced digital technique where designs are printed onto a special film and then transferred onto garments using heat and adhesive powder. This method is known for producing vibrant, durable, color-rich quality prints suitable for a wide range of materials.",
      },
      {
        question: "Which materials are compatible with DTF printing?",
        answer:
          "DTF printing works on cotton, polyester, blends, and many other fabric types, making it highly versatile for apparel decoration.",
      },
    ],
  },
  {
    section: "Shipping",
    items: [
      {
        question: "What are your shipping options and costs?",
        answer:
          "We offer standard and expedited shipping options. Standard shipping is a flat rate, and expedited shipping is available for an additional fee. Shipping costs are calculated at checkout based on your location and order size.",
      },
      {
        question: "Do you offer international shipping?",
        answer:
          "Yes, we ship internationally. Shipping rates and delivery times vary by destination.",
      },
      {
        question: "How can I track my order?",
        answer:
          "Once your order ships, you will receive a tracking number via email to monitor your shipment's progress.",
      },
    ],
  },
  {
    section: "Washing and Care Instructions",
    items: [
      {
        question: "How should I wash garments with DTF prints?",
        answer:
          "Turn the garment inside out before washing. Use cold water and a gentle cycle. Avoid bleach and fabric softeners. Tumble dry on low or hang dry for best results.",
      },
      {
        question: "Can I dry DTF-printed garments in a dryer?",
        answer:
          "Yes, but tumble dry on low heat to preserve the print's longevity.",
      },
      {
        question: "Is ironing safe for DTF prints?",
        answer:
          "Iron inside out on low heat. Do not iron directly on the print.",
      },
      {
        question: "Any additional tips for maintaining DTF prints?",
        answer:
          "Avoid harsh detergents and do not dry clean. Quick, gentle care ensures your prints last longer.",
      },
      {
        question: "How durable are DTF prints?",
        answer:
          "DTF prints are highly durable and can withstand many wash cycles without significant fading or cracking.",
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
                      isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
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
