"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import CustomButton from "@/components/custom/CustomButton";
import { useRouter } from "next/navigation";

// Dummy Product Type
interface Product {
  id: number;
  title: string;
  price: string;
  msrp: string;
  image: string;
  colors: string[];
  size: string[];
}

// Dummy Products
const products: Product[] = [
  {
    id: 1,
    title: "HD Cotton DTF Printed Shirt",
    price: "$12.95",
    msrp: "$18.95",
    image: "/images/product-image.png",
    colors: ["#008000", "#FF0000", "#FFA500", "#0000FF"],
    size: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: 2,
    title: "HD Cotton DTF Printed Shirt",
    price: "$12.95",
    msrp: "$18.95",
    image: "/images/product-image.png",
    colors: ["#008000", "#FF0000", "#FFA500", "#0000FF"],
    size: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: 3,
    title: "HD Cotton DTF Printed Shirt",
    price: "$12.95",
    msrp: "$18.95",
    image: "/images/product-image.png",
    colors: ["#008000", "#FF0000", "#FFA500", "#0000FF"],
    size: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: 4,
    title: "HD Cotton DTF Printed Shirt",
    price: "$12.95",
    msrp: "$18.95",
    image: "/images/product-image.png",
    colors: ["#008000", "#FF0000", "#FFA500", "#0000FF"],
    size: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: 5,
    title: "HD Cotton DTF Printed Shirt",
    price: "$12.95",
    msrp: "$18.95",
    image: "/images/product-image.png",
    colors: ["#008000", "#FF0000", "#FFA500", "#0000FF"],
    size: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: 6,
    title: "HD Cotton DTF Printed Shirt",
    price: "$12.95",
    msrp: "$18.95",
    image: "/images/product-image.png",
    colors: ["#008000", "#FF0000", "#FFA500", "#0000FF"],
    size: ["S", "M", "L", "XL", "XXL"],
  },
];

const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
  <div className="bg-white rounded-lg shadow-md p-3">
    <Link
      // href={`/apperal/${product.id}`}
      href={"/"}
    >
      <Image
        src={product.image}
        alt={product.title}
        width={300}
        height={300}
        className="object-cover w-full h-auto"
      />
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold mt-2">{product.title}</h3>
        <div className="text-sm font-semibold text-gray-500">
          <span className="font-bold">Size:</span>
          {product.size.map((size, index) => (
            <span key={index} className="p-1 rounded bg-gray-300 ml-1">
              {size}
            </span>
          ))}
        </div>
        <div className="text-sm font-semibold text-gray-500">Color:</div>
        <div className="flex space-x-1 mt-1">
          {product.colors.map((color, index) => (
            <span
              key={index}
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: color }}
            ></span>
          ))}
        </div>
        <div className="mt-1 text-sm">
          <span className="font-bold">MSRP:</span> {product.msrp}
        </div>
        <div className="text-[var(--green)] font-bold text-sm">
          {product.price}
        </div>
      </div>
    </Link>
  </div>
);

const Page: React.FC = () => {
  const router = useRouter();
  const handleGangSheetBuilder = () => {
    router.push("/gang-sheet-builder");
  };
  const handleIndividualSheetBuilder = () => {
    router.push("/individual-sheet-builder");
  };
  return (
    <main className="p-4 lg:p-12 layout">
      {/* Top section: buttons left, order card right */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-24 mb-6">
        {/* Left: Buttons and Heading */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-4 lg:gap-4 lg:flex-row ">
            <CustomButton
              title="Order Gang Sheets"
              className="md:text-2xl text-xl px-8 py-4 min-w-[220px] cursor-pointer"
              onClick={handleGangSheetBuilder}
            />
            <CustomButton
              title="Order Individual Sheets"
              className="md:text-2xl text-xl px-8 py-4 min-w-[220px] cursor-pointer"
              onClick={handleIndividualSheetBuilder}
            />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-2 mt-4 lg:mt-8 lg:mb-4">
            We Supply The Goods
          </h2>
          <p className="text-gray-500 max-w-[500px] text-justify">
            Plus our expertise in graphic design production and fulfillment
            programs mean your t-shirts will be party perfect -or full uniform
            program compliant- every time! Best yet: ownership stays on site
            everyday which guarantees personal investment into YOUR needs as a
            customer. We truly value your business & can’t wait to serve you!
          </p>

          <div className="flex flex-col lg:flex-row gap-10">
            <Image
              src="/images/product-image.png"
              alt="T-Shirt Design Preview"
              width={600}
              height={100}
              className="rounded mb-4 object-cover "
            />
          </div>
        </div>
        {/* Right: Order Card */}
        <div className="w-full max-w-sm lg:w-[600px] flex-shrink-0 flex justify-center">
          <div className="bg-[var(--green)] p-10 rounded-lg shadow-md w-full text-center">
            <h1 className="text-3xl md:text-4xl font-semibold text-white mb-4">
              Order In The Next
            </h1>
            <div className="flex justify-center gap-10 text-white text-xl font-bold mb-2">
              <div>
                <p className="rounded-full px-2 py-2 bg-white text-[var(--green)]">
                  34
                </p>
                <span className="text-sm font-normal">Hours</span>
              </div>
              <div>
                <p className="rounded-full px-2 py-2 bg-white text-[var(--green)]">
                  23
                </p>
                <span className="text-sm font-normal">Minutes</span>
              </div>
              <div>
                <p className="rounded-full px-2 py-2 bg-white text-[var(--green)]">
                  4
                </p>
                <span className="text-sm font-normal">Seconds</span>
              </div>
            </div>
            <p className="text-white text-xl md:text-3xl font-medium mb-4">
              Your Order Will Ship On Monday
            </p>
            <Image
              width={100}
              height={100}
              src="/images/hero-section/hero-image-card.png"
              alt="T-Shirt Design Preview"
              className="w-full rounded mb-4"
            />
            <button className="bg-black text-white px-6 py-2 rounded">
              Place Order
            </button>
          </div>
        </div>
      </div>
      {/* Product grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
};

export default Page;
