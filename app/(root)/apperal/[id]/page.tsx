"use client";

import React, { useState } from "react";
import { UploadCloud, X } from "lucide-react";
import Image from "next/image";

// Shirt sizes and prices
const SHIRT_SIZES = [
  { label: "S", value: "S", price: 3.75 },
  { label: "M", value: "M", price: 3.75 },
  { label: "L", value: "L", price: 3.75 },
  { label: "XL", value: "XL", price: 3.75 },
  { label: "XXL", value: "XXL", price: 5.75 },
  { label: "3XL", value: "3XL", price: 7.75 },
];

// Shirt color swatches
const SHIRT_COLORS = [
  { name: "White", value: "#fff" },
  { name: "Black", value: "#222" },
  { name: "Gray", value: "#888" },
  { name: "Red", value: "#e53e3e" },
  { name: "Blue", value: "#3182ce" },
  { name: "Green", value: "#38a169" },
  { name: "Yellow", value: "#ecc94b" },
  { name: "Pink", value: "#ed64a6" },
  { name: "Navy", value: "#2a4365" },
  { name: "Brown", value: "#8B5E3C" },
  { name: "Olive", value: "#6B8E23" },
  { name: "Purple", value: "#805ad5" },
];

// Sticker locations and prices
const STICKER_LOCATIONS = [
  { label: "Left Chest", value: "left_chest", price: 3.75 },
  { label: "Right Chest", value: "right_chest", price: 3.75 },
  { label: "Middle Chest", value: "middle_chest", price: 5.55 },
  { label: "Full Front", value: "full_front", price: 6.0 },
  { label: "Extra Large Front", value: "extra_large_front", price: 8.5 },
  { label: "Full Back", value: "full_back", price: 8.0 },
  {
    label: "Extra Large Full Back",
    value: "extra_large_full_back",
    price: 9.5,
  },
  { label: "Back Yoke", value: "back_yoke", price: 2.0 },
  { label: "Inside Neck Tag", value: "inside_neck_tag", price: 2.75 },
];

// Extra options
const EXTRA_OPTIONS = [
  { label: "Need help with artwork", value: "artwork", price: 10 },
  { label: "Rush fee", value: "rush", price: 25 },
];

type SizeKey = (typeof SHIRT_SIZES)[number]["value"];
type StickerKey = (typeof STICKER_LOCATIONS)[number]["value"];
type OptionKey = (typeof EXTRA_OPTIONS)[number]["value"];

const Page = () => {
  // Shirt size quantities
  const [sizeQuantities, setSizeQuantities] = useState<Record<SizeKey, number>>(
    SHIRT_SIZES.reduce(
      (acc, s) => ({ ...acc, [s.value]: 0 }),
      {} as Record<SizeKey, number>
    )
  );
  // Selected color
  const [selectedColor, setSelectedColor] = useState<string>(
    SHIRT_COLORS[0].value
  );
  // Sticker uploads per location
  const [stickers, setStickers] = useState<Record<StickerKey, File | null>>(
    STICKER_LOCATIONS.reduce(
      (acc, loc) => ({ ...acc, [loc.value]: null }),
      {} as Record<StickerKey, File | null>
    )
  );
  // Extra options
  const [selectedOptions, setSelectedOptions] = useState<OptionKey[]>([]);
  // Order notes
  const [orderNotes, setOrderNotes] = useState<string>("");

  // Handle size quantity change
  const handleSizeQtyChange = (size: SizeKey, qty: number) => {
    setSizeQuantities((prev) => ({ ...prev, [size]: qty }));
  };

  // Handle color select
  const handleColorSelect = (color: string) => setSelectedColor(color);

  // Handle sticker file upload
  const handleStickerChange = (loc: StickerKey, file: File | null) => {
    setStickers((prev) => ({ ...prev, [loc]: file }));
  };

  // Handle extra options
  const handleOptionChange = (value: OptionKey) => {
    setSelectedOptions((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  // Calculate totals
  const productTotal = SHIRT_SIZES.reduce(
    (sum, s) => sum + sizeQuantities[s.value] * s.price,
    0
  );
  const totalShirtQty = Object.values(sizeQuantities).reduce(
    (sum, qty) => sum + qty,
    0
  );
  const stickersTotal = STICKER_LOCATIONS.reduce(
    (sum, loc) =>
      stickers[loc.value] && totalShirtQty > 0
        ? sum + loc.price * totalShirtQty
        : sum,
    0
  );
  const optionsTotal = EXTRA_OPTIONS.reduce(
    (sum, opt) => (selectedOptions.includes(opt.value) ? sum + opt.price : sum),
    0
  );
  const grandTotal = (productTotal + stickersTotal + optionsTotal).toFixed(2);

  // Add to cart handler
  const handleAddToCart = () => {
    const data = {
      sizes: sizeQuantities,
      color: selectedColor,
      stickers: Object.fromEntries(
        Object.entries(stickers).filter(([, v]) => v)
      ),
      options: selectedOptions,
      orderNotes,
      totals: {
        productTotal,
        stickersTotal,
        optionsTotal,
        grandTotal,
      },
    };
    console.log("Cart Data:", data);
    alert("Order added to cart! Check console for data.");
  };

  // --- UI ---
  return (
    <main className="p-4 lg:p-12 layout">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left: Product image */}
        <div className="flex-1 flex flex-col items-center justify-start mb-8 lg:mb-0">
          <Image
            width={500}
            height={500}
            src="/images/product-image.png"
            alt="HD Cotton DTF Printed Shirt"
            className="object-cover rounded-xl border border-gray-200"
          />
        </div>
        {/* Right: Product info and options */}
        <div className="flex-1 max-w-xl mx-auto w-full">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">
            HD Cotton DTF Printed Shirt 4
          </h1>
          <p className="text-gray-700 mb-2">
            At HMD Ink, we specialize in high-quality custom T-shirt printing
            that brings your ideas to life. Whether it’s for personal style,
            team spirit, or brand promotion, our vibrant prints and premium
            materials ensure every shirt stands out. With easy online ordering
            and fast delivery, we make it simple to create T-shirts that speak
            your message loud and clear.
          </p>
          <h2 className="text-xl font-bold mb-2">Additional Information</h2>
          <ul className="list-disc list-inside text-gray-700 mb-4 text-sm">
            <li>
              4.45 oz./yd² (US), 7.4 oz./L yd (CA), 100% U.S. cotton, 30 singles
            </li>
            <li>Ash Grey is 99/1 cotton/polyester</li>
            <li>Sport Grey is 90/10 cotton/black polyester</li>
            <li>
              Dark Heather, Graphite Heather & Heather colors are 50/50
              cotton/polyester
            </li>
            <li>
              Features Innovation you can feel. Made with 100% U.S. cotton and
              the latest breakthrough in soft cotton technology, the Gildan®
            </li>
            <li>
              Light Cotton family has been remastered for improved printability,
              quality and comfort you can see and feel.
            </li>
            <li>Modern classic fit</li>
            <li>Narrow width, rib collar</li>
            <li>Taped neck and shoulders</li>
            <li>High-performing recycled tearaway label</li>
            <li>
              Made With Respect Gildan partners with Better Cotton to improve
              cotton farming globally
            </li>
            <li>Made with OEKO-TEX certified low-impact dyes</li>
            <li>
              We reduce plastic waste by the removal of polybags from all
              products except color White
            </li>
          </ul>

          {/* Shirt color selection */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Color:</label>
            <div className="flex flex-wrap gap-2">
              {SHIRT_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedColor === color.value
                      ? "border-[var(--green)] ring-2 ring-[var(--green)]"
                      : "border-gray-300"
                  }`}
                  style={{ background: color.value }}
                  onClick={() => handleColorSelect(color.value)}
                  aria-label={color.name}
                />
              ))}
            </div>
          </div>

          {/* Shirt size and quantity selection */}
          <div className="mb-4">
            <label className="block font-medium mb-1">
              Select Sizes & Quantity:
            </label>
            <div className="flex flex-col gap-2">
              {SHIRT_SIZES.map((size) => (
                <div key={size.value} className="flex items-center gap-3">
                  <span className="w-10 font-semibold">{size.label}</span>
                  <span className="text-gray-500 text-xs">
                    ${size.price.toFixed(2)}
                  </span>
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={sizeQuantities[size.value]}
                    onChange={(e) =>
                      handleSizeQtyChange(size.value, Number(e.target.value))
                    }
                    className="w-16 border rounded px-2 py-1 text-center"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Sticker upload per location */}
          <div className="mb-4">
            <label className="block font-medium mb-1">
              Custom Sticker Locations:
            </label>
            <div className="flex flex-col gap-2">
              {STICKER_LOCATIONS.map((loc) => (
                <div key={loc.value} className="flex items-center gap-2">
                  <span className="w-40 text-sm">{loc.label}</span>
                  <span className="text-xs text-gray-500">
                    Sticker Fee (${loc.price.toFixed(2)})
                  </span>
                  <div className="flex-1 flex items-center gap-2">
                    <label
                      htmlFor={`sticker-upload-${loc.value}`}
                      className={`border-2 border-dashed rounded-lg flex items-center gap-2 px-3 py-2 cursor-pointer transition hover:bg-gray-50 ${
                        stickers[loc.value]
                          ? "border-[var(--green)] bg-green-50"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      <UploadCloud className="w-5 h-5 text-[var(--green)]" />
                      <span className="text-xs font-medium">
                        {stickers[loc.value] ? "Change file" : "Upload file"}
                      </span>
                      <input
                        id={`sticker-upload-${loc.value}`}
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) =>
                          handleStickerChange(
                            loc.value,
                            e.target.files?.[0] || null
                          )
                        }
                        className="hidden"
                      />
                      {stickers[loc.value] && (
                        <span className="ml-2 text-[var(--green)] text-xs">
                          {stickers[loc.value]?.name}
                        </span>
                      )}
                      {stickers[loc.value] && (
                        <button
                          type="button"
                          className="ml-2 text-gray-400 hover:text-red-500"
                          onClick={(e) => {
                            e.preventDefault();
                            handleStickerChange(loc.value, null);
                          }}
                          aria-label="Remove file"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </label>
                    {/* Subtotal for this sticker location */}
                    {stickers[loc.value] && totalShirtQty > 0 && (
                      <span className="text-xs text-gray-700">
                        = ${(loc.price * totalShirtQty).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Extra options */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Extra Options:</label>
            <div className="flex flex-col gap-2">
              {EXTRA_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(opt.value)}
                    onChange={() => handleOptionChange(opt.value)}
                    className="accent-[var(--green)] w-5 h-5"
                  />
                  <span className="font-medium">{opt.label}</span>
                  <span className="text-xs text-gray-500">
                    (+${opt.price.toFixed(2)})
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Order notes */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Order Notes</label>
            <textarea
              className="w-full border rounded p-2 min-h-[60px]"
              placeholder="Need to give more info about your order or do it here"
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
            />
          </div>

          {/* Order summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4 flex flex-col gap-2 border">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Product total:</span>
              <span>${productTotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Sticker total:</span>
              <span>${stickersTotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Options total:</span>
              <span>${optionsTotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-lg font-bold mt-2">
              <span>Grand total:</span>
              <span className="text-[var(--green)]">${grandTotal}</span>
            </div>
          </div>

          {/* Add to cart button */}
          <button
            className="w-full bg-[var(--green)] text-white font-bold py-3 rounded-lg mt-2 hover:bg-green-700 transition"
            onClick={handleAddToCart}
            disabled={Object.values(sizeQuantities).every((q) => q === 0)}
          >
            Add to cart
          </button>
          <div className="text-xs text-gray-500 mt-2">
            * Please select at least one size to add to cart.
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
