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
import axios from "axios";

const GANG_SHEET_SIZES = [
  { label: '2" x 2"', value: "2x2", price: 1.05 },
  { label: '3" x 3"', value: "3x3", price: 2.0 },
  { label: '4" x 4"', value: "4x4", price: 3.0 },
  { label: '5" x 5"', value: "5x5", price: 4.0 },
  { label: '6" x 6"', value: "6x6", price: 5.0 },
  { label: '7" x 7"', value: "7x7", price: 6.0 },
  { label: '8" x 8"', value: "8x8", price: 7.0 },
  { label: '9" x 9"', value: "9x9", price: 8.0 },
  { label: '9" x 11"', value: "9x11", price: 8.5 },
  { label: '10" x 10"', value: "10x10", price: 9.0 },
  { label: '10" x 12"', value: "10x12", price: 9.5 },
  { label: '11" x 11"', value: "11x11", price: 10.0 },
  { label: '12" x 17"', value: "12x17", price: 10.0 },
];

const OPTIONS = [
  { label: "Need help with artwork", value: "artwork", price: 10 },
  { label: "Pre-cut transfers", value: "precut", price: 0.2 },
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
    GANG_SHEET_SIZES.find((s) => s.value === selectedSize)?.price || 0;

  // Calculate precut and other options separately
  const precutOption = OPTIONS.find((o) => o.value === "precut");
  const isPrecutSelected = selectedOptions.includes("precut");
  const precutPrice =
    isPrecutSelected && precutOption ? precutOption.price * quantity : 0;

  const otherOptionsPrice = selectedOptions.reduce((sum, opt) => {
    if (opt === "precut") return sum;
    const found = OPTIONS.find((o) => o.value === opt);
    return sum + (found ? found.price : 0);
  }, 0);

  // Now calculate total
  const total = (
    basePrice * quantity +
    precutPrice +
    otherOptionsPrice
  ).toFixed(2);

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!uploadedFile || !selectedSize) return;

    const formData = new FormData();
    formData.append("title", "Garam Anday");
    formData.append("image", uploadedFile);
    formData.append("size", selectedSize);
    formData.append("quantity", quantity.toString());
    formData.append("total", total);
    formData.append("options", JSON.stringify(selectedOptions));
    formData.append("orderNotes", orderNotes);

    try {
      await axios.post(
        "http://localhost:5000/api/cart/add", // or your actual backend endpoint
        formData,
        {
          withCredentials: true, // send cookies (JWT) automatically
        }
      );
      alert("Order added to cart!");
    } catch {
      alert("Failed to add to cart. Please login or try again.");
    }
  };

  return (
    <main className="p-4 lg:p-12 layout">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left: Image preview or placeholder */}
        <div className="flex-1 flex flex-col items-center justify-start mb-8 lg:mb-0 lg:sticky lg:top-8 lg:self-start">
          <Image
            width={500}
            height={500}
            src="/images/indivdual-sheet-DTF.webp"
            alt="Individual Sheet"
            className="object-cover"
          />
        </div>
        {/* Right: Form */}
        <div className="flex-1 max-w-xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">
            Individual Design File
          </h1>
          <p className="text-gray-700 mb-2">
            DTF (Direct to Film) printing is incredibly versatile and works on a
            wide range of materials, making it ideal for both apparel and
            promotional items. It performs exceptionally well on cotton,
            polyester, and cotton/poly blends, delivering vibrant colors and
            strong wash durability—perfect for t-shirts, hoodies, and tote bags.
            Tri-blend fabrics also work well when paired with high-quality film
            and powder. DTF printing isn’t limited to clothing; it’s great for
            canvas and denim items like aprons, backpacks, and jackets, as well
            as hats with flat areas, especially 5-panel or flat-bill caps. It
            can also be used on shoes (such as canvas sneakers), tote bags, and
            even koozies, provided they can handle the press heat. While more
            challenging, DTF can also adhere to nylon, wood, or leather when
            tested carefully with the right adhesive powder and press settings.
            For best results, use quality materials, avoid overheating, and
            apply even pressure to ensure long-lasting, professional prints
            across a wide range of substrates.
          </p>
          <div className="text-xl font-bold mb-2">
            ${GANG_SHEET_SIZES[0].price.toFixed(2)} – $
            {GANG_SHEET_SIZES[GANG_SHEET_SIZES.length - 1].price.toFixed(2)}
          </div>

          <h1 className="text-2xl text-[var(--gray)] md:text-4xl font-bold mb-2">
            Additional Information
          </h1>
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="font-bold">
                Simplify Your Printing with Custom-Sized DTF Transfers!
              </h2>
              <p>
                Upload your design, choose the transfer size that suits your
                project, and we’ll take care of the rest—creating a personalized
                DTF just for you.
              </p>
            </div>
            <p>
              Need a size you don’t see listed? No worries! Select the closest
              match and include a note with your exact dimensions. You can also
              ask us to remove the background for a polished, pro-ready finish.
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
                      className="absolute top-2 right-2 bg-black/60 hover:text-red-600 text-white text-xl rounded-full w-8 h-8 p-1 cursor-pointer"
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
            Individual Sheet : Select Size
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
                  ? GANG_SHEET_SIZES.find((s) => s.value === selectedSize)
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
                {GANG_SHEET_SIZES.map((size) => (
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
