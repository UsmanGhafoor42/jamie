"use client";

import React, { useState } from "react";
import { UploadCloud, X } from "lucide-react";
import Image from "next/image";
import products from "../apparelProducts.json";
import { useParams } from "next/navigation";

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

type StickerKey = (typeof STICKER_LOCATIONS)[number]["value"];
type OptionKey = (typeof EXTRA_OPTIONS)[number]["value"];

const Page = () => {
  const { id } = useParams();
  // All useState/useEffect hooks here (move before any early return)
  // We'll use empty arrays/objects as fallback for initial state
  const [sizeQuantities, setSizeQuantities] = useState<Record<string, number>>(
    {}
  );
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [imprint, setimprint] = useState<Record<string, File | null>>({});
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [orderNotes, setOrderNotes] = useState<string>("");

  // Always call hooks before any early return
  React.useEffect(() => {
    if (!products.find((p) => p.id === Number(id))) return;
    setSizeQuantities(
      (products.find((p) => p.id === Number(id))?.prices || []).reduce(
        (acc, s) => ({ ...acc, [s.size]: 0 }),
        {}
      )
    );
    setSelectedColor(
      products.find((p) => p.id === Number(id))?.colorSwatches?.[0]?.hex || ""
    );
    setimprint(
      STICKER_LOCATIONS.reduce(
        (acc, loc) => ({ ...acc, [loc.value]: null }),
        {}
      )
    );
  }, [id]);

  const product = products.find((p) => p.id === Number(id));
  if (!product) return <div>Product not found</div>;

  // Use product.prices for sizes
  const SHIRT_SIZES =
    product.prices?.map((p) => ({
      label: p.size,
      value: p.size,
      price: p.price,
    })) || [];

  // Use product.colorSwatches for color selection
  const colorSwatches =
    product.colorSwatches?.map((c) => ({
      name: c.name,
      value: c.hex,
      image: c.image,
    })) || [];

  // Use product.finishingMeasurementTable for measurement table
  const measurementTable =
    product.finishingMeasurementTable ||
    product.finishingMeasurementTable ||
    [];

  // Handle size quantity change
  const handleSizeQtyChange = (size: string, qty: number) => {
    setSizeQuantities((prev) => ({ ...prev, [size]: qty }));
  };

  // Handle color select
  const handleColorSelect = (color: string) => setSelectedColor(color);

  // Handle sticker file upload
  const handleStickerChange = (loc: StickerKey, file: File | null) => {
    setimprint((prev) => ({ ...prev, [loc]: file }));
  };

  // Handle extra options
  const handleOptionChange = (value: OptionKey) => {
    setSelectedOptions((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  // Calculate totals
  const productTotal = SHIRT_SIZES.reduce(
    (sum, s) => sum + (sizeQuantities[s.value] || 0) * s.price,
    0
  );
  const totalShirtQty = Object.values(sizeQuantities).reduce(
    (sum, qty) => sum + qty,
    0
  );
  const imprintTotal = STICKER_LOCATIONS.reduce(
    (sum, loc) =>
      imprint[loc.value] && totalShirtQty > 0
        ? sum + loc.price * totalShirtQty
        : sum,
    0
  );
  const optionsTotal = EXTRA_OPTIONS.reduce(
    (sum, opt) => (selectedOptions.includes(opt.value) ? sum + opt.price : sum),
    0
  );
  const grandTotal = (productTotal + imprintTotal + optionsTotal).toFixed(2);

  // Add to cart handler
  const handleAddToCart = () => {
    const data = {
      sizes: sizeQuantities,
      color: selectedColor,
      imprint: Object.fromEntries(Object.entries(imprint).filter(([, v]) => v)),
      options: selectedOptions,
      orderNotes,
      totals: {
        productTotal,
        imprintTotal,
        optionsTotal,
        grandTotal,
      },
    };
    console.log("Cart Data:", data);
    alert("Order added to cart! Check console for data.");
  };

  // --- UI ---
  // Find the selected color swatch for image
  const selectedColorObj = colorSwatches.find((c) => c.value === selectedColor);
  const shirtImageSrc = selectedColorObj?.image || product.productImage;

  return (
    <main className="p-4 lg:p-12 layout">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left: Product image */}
        <div className="flex-1 flex flex-col items-center justify-start mb-8 lg:mb-0 lg:sticky lg:top-8 lg:self-start">
          <Image
            width={500}
            height={500}
            src={shirtImageSrc}
            alt={product.title}
            className="object-cover rounded-xl border border-gray-200"
          />
          <Image
            src="/images/Print_Locations_Short_Sleeve.jpg"
            alt="Print location on short sleeves"
            width={500}
            height={500}
            className="object-cover"
          />
        </div>
        {/* Right: Product info and options */}
        <div className="flex-1 max-w-xl mx-auto w-full">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">
            {product.title}
          </h1>
          <p className="text-gray-700 mb-2">{product.description}</p>
          <h2 className="text-xl font-bold mb-2">Additional Information</h2>
          <ul className="list-disc list-inside text-gray-700 mb-4 text-sm">
            {product.details?.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>

          {/* Finishing Measurement Table */}
          <h2 className="text-xl font-bold mb-2">Finishing Measurement</h2>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border border-gray-300 text-sm text-center">
              <thead className="bg-gray-100">
                <tr>
                  {measurementTable[0]?.map((col, i) => (
                    <th key={i} className="px-2 py-2 border">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {measurementTable.slice(1).map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className={
                          j === 0
                            ? "px-2 py-2 border font-semibold text-left"
                            : "px-2 py-2 border" +
                              (typeof cell === "string" && cell.includes("+/-")
                                ? " text-[11px]"
                                : "")
                        }
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Shirt color selection */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Color:</label>
            <div className="flex flex-wrap gap-2">
              {colorSwatches.map((color, i) => (
                <button
                  key={`${color.value}-${i}`}
                  type="button"
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedColor === color.value
                      ? "border-[var(--green)] ring-2 ring-[var(--green)]"
                      : "border-gray-300"
                  }`}
                  style={{ background: color.value }}
                  onClick={() => handleColorSelect(color.value)}
                  aria-label={color.name}
                  title={color.name}
                >
                  {/* Optionally show image preview on hover or inside swatch */}
                </button>
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
                    required
                    value={sizeQuantities[size.value] ?? 0}
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
              Custom Imprint Locations:
            </label>
            <div className="flex flex-col gap-2">
              {STICKER_LOCATIONS.map((loc) => (
                <div key={loc.value} className="flex items-center gap-2">
                  <span className="w-40 text-sm">{loc.label}</span>
                  <span className="text-xs text-gray-500">
                    Imprint Fee (${loc.price.toFixed(2)})
                  </span>
                  <div className="flex-1 flex items-center gap-2">
                    <label
                      htmlFor={`imprint-upload-${loc.value}`}
                      className={`border-2 border-dashed rounded-lg flex items-center gap-2 px-3 py-2 cursor-pointer transition hover:bg-gray-50 ${
                        imprint[loc.value]
                          ? "border-[var(--green)] bg-green-50"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      <UploadCloud className="w-5 h-5 text-[var(--green)]" />
                      <span className="text-xs font-medium">
                        {imprint[loc.value] ? "Change file" : "Upload file"}
                      </span>
                      <input
                        id={`imprint-upload-${loc.value}`}
                        type="file"
                        required
                        accept="image/*,application/pdf"
                        onChange={(e) =>
                          handleStickerChange(
                            loc.value,
                            e.target.files?.[0] || null
                          )
                        }
                        className="hidden"
                      />
                      {imprint[loc.value] && (
                        <span className="ml-2 text-[var(--green)] text-xs">
                          {imprint[loc.value]?.name}
                        </span>
                      )}
                      {imprint[loc.value] && (
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
                    {imprint[loc.value] && totalShirtQty > 0 && (
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
              <span className="font-semibold">Imprint total:</span>
              <span>${imprintTotal.toFixed(2)}</span>
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
