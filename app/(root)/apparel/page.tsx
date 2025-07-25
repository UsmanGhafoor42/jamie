"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import DtfButton from "@/components/custom/DtfButton";
import CustomButton from "@/components/custom/CustomButton";
import { useRouter } from "next/navigation";
import products from "./apparelProducts.json";
// Dummy Product Type
interface Product {
  id: number;
  title: string;
  productImage: string;
  slidersImage?: Record<string, string>;
}

const ProductCard: React.FC<
  { product: Product } & { slidersImage?: Record<string, string> }
> = ({ product, slidersImage }) => {
  const router = useRouter();
  // Show slider if slidersImage exists and has images
  const isSlider = slidersImage && Object.keys(slidersImage).length > 0;
  const [sliderIndex, setSliderIndex] = useState(0);
  const sliderImages = isSlider ? Object.values(slidersImage) : [];

  // Auto-slide every 0.3s for id 7
  useEffect(() => {
    if (!isSlider) return;
    const interval = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % sliderImages.length);
    }, 300);
    return () => clearInterval(interval);
  }, [isSlider, sliderImages.length]);

  const handleClick = () => {
    router.push(`/apparel/${product.id}`);
  };

  // const handlePrev = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   setSliderIndex(
  //     (prev) => (prev - 1 + sliderImages.length) % sliderImages.length
  //   );
  // };
  // const handleNext = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   setSliderIndex((prev) => (prev + 1) % sliderImages.length);
  // };

  return (
    <div className="bg-white rounded-lg shadow-md p-3">
      <div className="flex flex-col gap-5">
        {isSlider ? (
          <div className="relative flex flex-col items-center">
            <Image
              src={sliderImages[sliderIndex]}
              alt={product.title}
              width={150}
              height={150}
              className="object-cover w-full"
            />
            {/* <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full px-2 py-1 shadow hover:bg-gray-200"
              onClick={handlePrev}
              style={{ zIndex: 2 }}
              aria-label="Previous image"
            >
              &#8592;
            </button>
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full px-2 py-1 shadow hover:bg-gray-200"
              onClick={handleNext}
              style={{ zIndex: 2 }}
              aria-label="Next image"
            >
              &#8594;
            </button> */}
            {/* <div className="text-xs text-gray-500 mt-1">
              {sliderIndex + 1} / {sliderImages.length}
            </div> */}
          </div>
        ) : (
          <Image
            src={product.productImage}
            alt={product.title}
            width={150}
            height={150}
            className="object-cover w-full"
          />
        )}

        <h3 className="font-semibold text-center">{product.title}</h3>
        <CustomButton
          onClick={handleClick}
          title="Select Options"
          className="w-fit"
        />
      </div>
    </div>
  );
};

const Page: React.FC = () => {
  // Map slidersImage for id 7
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
              <ProductCard
                key={product.id}
                product={product}
                slidersImage={product.slidersImage}
              />
            ))}
          </div>
        </div>
        {/* Right: Order Card */}
        <div className="w-full max-w-sm lg:w-[600px] flex-shrink-0 flex justify-center">
          <div className="bg-[var(--green)] p-10 rounded-lg shadow-md w-full text-center">
            <Image
              width={500}
              height={500}
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
