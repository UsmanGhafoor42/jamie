"use client";
import React from "react";
import Image from "next/image";
import DtfButton from "@/components/custom/DtfButton";
import CustomButton from "@/components/custom/CustomButton";

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
    <div
    // href={`/apperal/${product.id}`}
    // href={"/"}
    >
      <Image
        src={product.image}
        alt={product.title}
        width={150}
        height={150}
        className="object-cover w-full"
      />
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold mt-2">{product.title}</h3>
        {/* <div className="text-sm font-semibold text-gray-500">
          <span className="font-bold">Size:</span>
          {product.size.map((size, index) => (
            <span key={index} className="p-1 rounded bg-gray-300 ml-1">
              {size}
            </span>
          ))}
        </div> */}
        {/* <div className="text-sm font-semibold text-gray-500">Color:</div>
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
        </div> */}
        <CustomButton
          onClick={() => {}}
          title="Select Options"
          className="w-fit"
        />
      </div>
    </div>
  </div>
);

const Page: React.FC = () => {
  return (
    <main className="p-4 lg:p-12 layout">
      {/* Top section: buttons left, order card right */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-24 mb-6">
        {/* Left: Buttons and Heading */}
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl md:text-5xl font-bold mb-2 mt-4 lg:mt-8 lg:mb-4">
            We Supply The Goods
          </h2>
          <p className="text-gray-500 text-justify">
            Plus our expertise in graphic design production and fulfillment
            programs mean your t-shirts will be party perfect -or full uniform
            program compliant- every time! Best yet: ownership stays on site
            everyday which guarantees personal investment into YOUR needs as a
            customer. We truly value your business & can’t wait to serve you!
          </p>
          {/* Product grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-x-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
        {/* Right: Order Card */}
        <div className="w-full max-w-sm lg:w-[600px] flex-shrink-0 flex justify-center">
          <div className="bg-[var(--green)] p-10 rounded-lg shadow-md w-full text-center">
            <Image
              width={100}
              height={100}
              src="/images/apperal-side-card.webp"
              alt="T-Shirt Design Preview"
              className="w-full rounded mb-4"
            />
            <div className="flex flex-col gap-4">
              <DtfButton
                title="Gang Sheet DTF"
                url="/gang-sheet-builder"
                className="px-12 py-6 w-fit text-xl"
              />
              <DtfButton
                title="Individual Sheet DTF"
                url="/individual-sheet-builder"
                className="px-12 py-6 w-fit  text-xl"
              />
              <DtfButton
                title="UV Stickers DTF"
                url="/uv-stickers"
                className="px-12 py-6 w-fit  text-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
