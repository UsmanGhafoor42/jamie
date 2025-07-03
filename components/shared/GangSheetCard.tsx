import React, { useState } from "react";
import Image from "next/image";
import { Plus, Minus, ShoppingCart, Trash2 } from "lucide-react";

interface GangSheetCardProps {
  image: string;
  title: string;
}

const GangSheetCard: React.FC<GangSheetCardProps> = ({ image, title }) => {
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  return (
    <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 max-w-xs mx-auto">
      {/* Flag Image */}
      <div className="w-full aspect-[1.2/1] bg-gray-100">
        <Image
          src={image}
          alt={title}
          width={400}
          height={300}
          className="object-cover w-full h-full"
        />
      </div>
      {/* Cart Button */}
      <button className="absolute cursor-pointer right-4 bottom-24 bg-[var(--green)] rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
        <ShoppingCart className="text-white w-8 h-8" />
      </button>
      {/* Card Content */}
      <div className="pt-4 pb-3 px-4 mt-6 border-gray-200 bg-white relative z-10">
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">Quantity:</span>
            <button
              onClick={handleDecrement}
              className="border-2 border-[var(--green)] rounded-full w-7 h-7 flex items-center justify-center text-black hover:bg-[var(--primary)] hover:text-white transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-semibold text-lg w-6 text-center">
              {quantity}
            </span>
            <button
              onClick={handleIncrement}
              className="border-2 border-[var(--green)] rounded-full w-7 h-7 flex items-center justify-center text-black hover:bg-[var(--primary)] hover:text-white transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <button
            className="ml-4 text-red-500 hover:text-red-700"
            aria-label="Delete"
          >
            <Trash2 className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GangSheetCard;
