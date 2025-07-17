"use client";

import React, {
  useState,
  DragEvent,
  ChangeEvent,
  useRef,
  useEffect,
} from "react";
import { UploadCloud } from "lucide-react";
import Image from "next/image";

const GANG_SHEET_SIZES = [
  { label: '11" x 12.5"', value: "11x12.5", price: 5 },
  { label: '22.5" x 12.5"', value: "22.5x12.5", price: 10 },
  { label: '22.5" x 25"', value: "22.5x25", price: 20 },
  { label: '22.5" x 50"', value: "22.5x50", price: 40 },
  { label: '22.5" x 84"', value: "22.5x84", price: 60 },
  { label: '22.5" x 120"', value: "22.5x120", price: 80 },
  { label: '22.5" x 180"', value: "22.5x180", price: 100 },
  { label: '22.5" x 240"', value: "22.5x240", price: 120 },
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
  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setUploadedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
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
  const optionsPrice = selectedOptions.reduce((sum, opt) => {
    const found = OPTIONS.find((o) => o.value === opt);
    return sum + (found ? found.price : 0);
  }, 0);
  const total = ((basePrice + optionsPrice) * quantity).toFixed(2);

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
        <div className="flex-1 flex flex-col items-center justify-start mb-8 lg:mb-0">
          {/* <Image
            width={500}
            height={500}
            src="/images/Gang-Sheet-HMD.webp"
            alt="Gang Sheet"
            className="object-cover"
          /> */}
          <div className="w-full max-w-xl aspect-[1.1/1] bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border border-gray-300">
            {imagePreview ? (
              <Image
                width={100}
                height={100}
                src={imagePreview}
                alt="Preview"
                className="object-fit w-full h-full"
              />
            ) : (
              // <span className="text-gray-400 text-lg">Image Preview</span>
              <Image
                width={500}
                height={500}
                src="/images/Gang-Sheet-HMD.webp"
                alt="Gang Sheet"
                className="object-cover"
              />
            )}
          </div>
          {/* Custom upload */}
          {/* <label
            htmlFor="fileInput"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="mt-6 border-2 border-dashed border-gray-400 bg-gray-50 text-gray-700 rounded-xl flex flex-col items-center justify-center px-8 py-8 cursor-pointer transition hover:bg-gray-100 text-center w-full max-w-md"
          >
            <UploadCloud className="w-10 h-10 mb-2" />
            <span className="font-semibold mb-1">Upload Your Design File</span>
            <span className="text-xs mb-2">Click or drag and drop file</span>
            <input
              id="fileInput"
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            {uploadedFile && (
              <span className="mt-2 text-[var(--green)] text-sm">
                {uploadedFile.name}
              </span>
            )}
          </label> */}
        </div>
        {/* Right: Form */}
        <div className="flex-1 max-w-xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">
            Gang Sheet Builder
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
          {/* <div className="text-xl font-bold mb-2">$5.00 – $120.00</div> */}
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
                Save Time and Money with DTF Gang Sheets!
              </h2>
              <p>
                Group multiple designs on one sheet to cut down on costs and
                speed up your printing. Whether you&apos;re doing a bulk run or
                testing out different looks, gang sheets make it easy.
              </p>
            </div>
            <p>
              We&apos;ll print your designs on high-quality gang sheets, ready
              to press with any heat press.
            </p>
            <h2 className="font-bold">
              👉 Get more done, your way—start uploading now!
            </h2>
          </div>
          <div>
            <label
              htmlFor="fileInput"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="mt-6 border-2 border-dashed border-gray-400 bg-gray-50 text-gray-700 rounded-xl flex flex-col items-center justify-center px-8 py-8 cursor-pointer transition hover:bg-gray-100 text-center w-full max-w-md"
            >
              <UploadCloud className="w-10 h-10 mb-2" />
              <span className="font-semibold mb-1">
                Upload Your Design File
              </span>
              <span className="text-xs mb-2">Click or drag and drop file</span>
              <input
                id="fileInput"
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              {uploadedFile && (
                <span className="mt-2 text-[var(--green)] text-sm">
                  {uploadedFile.name}
                </span>
              )}
            </label>
          </div>

          <h2 className="text-lg font-semibold mt-6 mb-2">
            Gang Sheet : Select Size
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
