"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";

interface CartItem {
  id: number;
  image: string;
  title: string;
  price: number;
  quantity: number;
}

const dummyCart: CartItem[] = [
  {
    id: 1,
    image: "/images/product-image.png",
    title: "DTF Design Sheet",
    price: 650,
    quantity: 1,
  },
  {
    id: 2,
    image: "/images/product-image.png",
    title: "DTF Design Sheet",
    price: 650,
    quantity: 1,
  },
  {
    id: 3,
    image: "/images/product-image.png",
    title: "DTF Design Sheet",
    price: 650,
    quantity: 1,
  },
  {
    id: 4,
    image: "/images/product-image.png",
    title: "DTF Design Sheet",
    price: 650,
    quantity: 1,
  },
];

const ShoppingCart: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>(dummyCart);

  const handleQuantityChange = (id: number, value: number) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: value } : item))
    );
  };

  const handleDelete = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Your Shopping Cart
      </h1>
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 font-semibold">Product</th>
              <th className="text-left p-4 font-semibold">Price</th>
              <th className="text-left p-4 font-semibold">Quantity</th>
              <th className="text-left p-4 font-semibold">Subtotal</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr
                key={item.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="flex items-center gap-4 p-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <span className="font-medium">{item.title}</span>
                </td>
                <td className="p-4">${item.price}</td>
                <td className="p-4">
                  <select
                    className="border rounded px-2 py-1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.id, Number(e.target.value))
                    }
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {String(i + 1).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-4 font-semibold">
                  ${item.price * item.quantity}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col items-end mt-8 gap-2">
        <div className="flex gap-8 text-lg">
          <span>Subtotal:</span>
          <span className="font-bold">${subtotal}</span>
        </div>
        <div className="flex gap-8 text-lg">
          <span>Shipping:</span>
          <span className="font-bold">Free</span>
        </div>
        <hr className="w-full my-2 border-gray-300" />
        <div className="flex gap-8 text-xl">
          <span>Total:</span>
          <span className="font-bold">${subtotal}</span>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
