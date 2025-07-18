"use client";

import React, {
  useState,
  DragEvent,
  ChangeEvent,
  useRef,
  useEffect,
} from "react";
import { UploadCloud, X } from "lucide-react";
import Image from "next/image";

const UV_STICKER_SIZES = [
  { label: '1" x 1"', value: "1x1", price: 0.89 },
  { label: '2" x 2"', value: "2x2", price: 1.5 },
  { label: '3" x 3"', value: "3x3", price: 2.0 },
  { label: '4" x 4"', value: "4x4", price: 3.0 },
  { label: '5" x 5"', value: "5x5", price: 4.0 },
  { label: '6" x 6"', value: "6x6", price: 5.0 },
  { label: '7" x 7"', value: "7x7", price: 6.0 },
  { label: '8" x 8"', value: "8x8", price: 7.0 },
  { label: '9" x 9"', value: "9x9", price: 8.0 },
  { label: '10" x 10"', value: "10x10", price: 9.0 },
  { label: '11" x 11"', value: "11x11", price: 10.0 },
];

const OPTIONS = [
  { label: "Need help with artwork", value: "artwork", price: 10 },
  { label: "Rush fee", value: "rush", price: 25 },
];

const Page = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [orderNotes, setOrderNotes] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsSizeDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle file upload (drag or select)
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setUploadedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Handle size selection
  const handleSizeSelect = (value: string) => {
    setSelectedSize(value);
  };

  // Handle option checkboxes
  const handleOptionChange = (value: string) => {
    setSelectedOptions((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  // Calculate total price
  const basePrice =
    UV_STICKER_SIZES.find((s) => s.value === selectedSize)?.price || 0;
  const optionsPrice = selectedOptions.reduce((sum, opt) => {
    const found = OPTIONS.find((o) => o.value === opt);
    return sum + (found ? found.price : 0);
  }, 0);
  const total = (basePrice * quantity + optionsPrice).toFixed(2);

  // Handle add to cart
  const handleAddToCart = () => {
    const data = {
      image: uploadedFile,
      imagePreview,
      size: selectedSize,
      options: selectedOptions,
      orderNotes,
      quantity,
      total,
    };
    // In real app, send to backend/cart
    console.log("Cart Data:", data);
    alert("Order added to cart! Check console for data.");
  };

  return (
    <main className="p-4 lg:p-12 layout">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left: Image preview or placeholder */}
        <div className="flex-1 flex flex-col items-center justify-start mb-8 lg:mb-0 lg:sticky lg:top-8 lg:self-start">
          <Image
            width={500}
            height={500}
            src="/images/uv-stcikers-sheet.webp"
            alt="UV Stickers"
            className="object-cover"
          />
        </div>
        {/* Right: Form */}
        <div className="flex-1 max-w-xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">UV Stickers</h1>
          <p className="text-gray-700 mb-2">
            UV DTF stickers are incredibly versatile and work best on hard,
            smooth, and non-porous surfaces, making them perfect for a wide
            range of applications. They adhere exceptionally well to drinkware
            like stainless steel tumblers, water bottles, and glass mugs, making
            them ideal for custom gifts or branded merchandise. They&apos;re
            also popular for tech accessories, such as phone cases, laptops, and
            tablets, where they provide a sleek, high-quality finish. In the
            automotive and outdoor space, UV DTF stickers are great for car
            windows, bumpers, coolers, and toolboxes due to their durability and
            weather resistance. For businesses, these stickers elevate packaging
            on items like candle jars, cosmetic containers, and acrylic boxes,
            offering a no-label, high-end look. They&apos;re also perfect for
            customizing notebooks, planners, and signage made from acrylic or
            coated wood. Around the home, UV DTF decals work beautifully on
            glass, mirrors, picture frames, ceramic tiles, and coasters for
            seasonal decor or personalized gifts. For best results, the surface
            should be cleaned thoroughly before application, and the sticker
            should be pressed firmly before peeling the transfer film. Avoid
            using UV DTF on flexible or highly textured surfaces to ensure
            long-lasting adhesion.
          </p>
          <div className="text-xl font-bold mb-2">
            ${UV_STICKER_SIZES[0].price.toFixed(2)} – $
            {UV_STICKER_SIZES[UV_STICKER_SIZES.length - 1].price.toFixed(2)}
          </div>

          <h1 className="text-2xl text-[var(--gray)] md:text-4xl font-bold mb-2">
            Additional Information
          </h1>
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="font-bold">
                Simplify Your Printing with Custom-Sized UV DTF Stickers!
              </h2>
              <p>
                Upload your design, choose the transfer size that suits your
                project, and we&apos;ll take care of the rest—creating a
                personalized DTF just for you.
              </p>
            </div>
            <p>
              Need a size you don&apos;t see listed? No worries! Select the
              closest match and include a note with your exact dimensions. You
              can also ask us to remove the background for a polished, pro-ready
              finish.
            </p>
            <p>
              Your custom DTF transfers will arrive ready to apply using any
              heat press—quick, easy, and made to match your vision.
            </p>
          </div>

          <div>
            {imagePreview ? (
              <div className="relative mt-6 rounded-xl bg-[var(--green)]">
                <div className="bg-gradient-to-br from-[#4cce24] via-[#6ebd63] to-[#1c5814] rounded-xl flex flex-col items-center justify-center p-4">
                  <div className="relative w-full flex justify-center">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={400}
                      height={350}
                      className="max-h-48 rounded shadow-lg object-contain"
                    />
                    {/* Delete button */}
                    <button
                      className="absolute top-2 right-2 bg-black/60 hover:text-red-600 text-white text-xl rounded-full w-8 h-8 cursor-pointer p-1"
                      onClick={() => {
                        setUploadedFile(null);
                        setImagePreview(null);
                      }}
                      aria-label="Delete"
                    >
                      <X />
                    </button>
                  </div>
                  <div className="mt-4 w-full text-left">
                    <div className="text-white font-medium truncate">
                      {uploadedFile?.name}
                    </div>
                    <div className="text-white">
                      {uploadedFile?.size !== undefined
                        ? `${(uploadedFile.size / 1024).toFixed(2)} KB`
                        : ""}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={`relative mt-6 rounded-xl border-2 border-dashed bg-[var(--green)]`}
              >
                <div
                  className="flex flex-col items-center justify-center w-full h-56 bg-gradient-to-br from-[#4cce24] via-[#6ebd63] to-[#1c5814] rounded-xl cursor-pointer"
                  onClick={() => document.getElementById("fileInput")?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <UploadCloud className="w-10 h-10 mb-2 text-white" />
                  <span className="font-semibold mb-1 text-white text-lg">
                    Upload artwork
                  </span>
                  <span className="text-xs mb-2 text-white">
                    Drag & drop your artwork here or click and locate your file.
                  </span>
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            )}
            <div className="text-xs text-gray-400 mt-2 text-center">
              Supports: JPG, JPEG, PNG, GIF, BMP, EPS, PDF, AI, SVG, PSD, TIF,
              TIFF
            </div>
          </div>

          <h2 className="text-lg font-semibold mt-6 mb-2">
            UV Sticker : Select Size
          </h2>
          <div className="relative mb-4" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsSizeDropdownOpen(!isSizeDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white text-left hover:border-[var(--green)] focus:outline-none focus:ring-2 focus:ring-[var(--green)] focus:border-transparent"
            >
              <span
                className={selectedSize ? "text-gray-900" : "text-gray-500"}
              >
                {selectedSize
                  ? UV_STICKER_SIZES.find((s) => s.value === selectedSize)
                      ?.label
                  : "Select a size"}
              </span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  isSizeDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isSizeDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {UV_STICKER_SIZES.map((size) => (
                  <button
                    key={size.value}
                    type="button"
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                      selectedSize === size.value
                        ? "bg-[var(--green)] text-white"
                        : "text-gray-900"
                    } ${selectedSize === size.value ? "font-semibold" : ""}`}
                    onClick={() => {
                      handleSizeSelect(size.value);
                      setIsSizeDropdownOpen(false);
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span>{size.label}</span>
                      <span className="text-sm opacity-75">
                        ${size.price.toFixed(2)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 mb-4">
            {OPTIONS.map((opt) => (
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
          <div className="mb-4">
            <label className="block font-medium mb-1">Order Notes</label>
            <textarea
              className="w-full border rounded p-2 min-h-[60px]"
              placeholder="Need to give more info about your order or do it here"
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
            />
          </div>
          <div className="mb-4 flex items-center gap-4">
            <label className="font-medium">Quantity:</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="w-8 h-8 rounded-full border border-[var(--green)] text-[var(--green)] flex items-center justify-center text-xl font-bold hover:bg-[var(--green)] hover:text-white transition"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-fit text-center border rounded px-2 py-1 font-semibold"
              />
              <button
                type="button"
                className="w-8 h-8 rounded-full border border-[var(--green)] text-[var(--green)] flex items-center justify-center text-xl font-bold hover:bg-[var(--green)] hover:text-white transition"
                onClick={() => setQuantity((q) => Math.min(q + 1))}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-6 mb-2">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-2xl font-bold text-[var(--green)]">
              ${total}
            </span>
          </div>
          <button
            className="w-full bg-[var(--green)] text-white font-bold py-3 rounded-lg mt-2 hover:bg-green-700 transition"
            onClick={handleAddToCart}
            disabled={!selectedSize || !uploadedFile}
          >
            Add to cart
          </button>
          <div className="text-xs text-gray-500 mt-2">
            * Please select a size and upload your design file to add to cart.
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
