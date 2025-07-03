"use client";
import CustomButton from "@/components/custom/CustomButton";
import AnotherHeroSection from "@/components/shared/AnotherHeroSection";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const router = useRouter();
  const handleExploreGangSheets = () => {
    router.push("/gang-sheet-builder");
  };
  return (
    <div>
      <AnotherHeroSection title="About Us" />
      <div className="layout">
        <div className="flex flex-col md:flex-row justify-center items-center gap-5 py-10">
          <div className="md:w-[70%] w-full flex items-center justify-center">
            <Image
              src="/images/why-choose-us.png"
              alt="why-choose-us"
              width={500}
              height={500}
              className="md:w-[550px] w-[400px]"
            />
          </div>
          <div className="md:w-[50%] w-full flex flex-col gap-10">
            <div className="flex flex-col gap-8">
              <h3 className="text-2xl md:text-4xl font-bold">
                Journey of Trust, Growth, and Excellence
              </h3>
              <p className="text-gray-500 text-lg md:text-xl">
                Get ready to experience the power of Hot Market Design! We’re a
                small business with big passion, and we’ve invested in top-notch
                Automatic presses, wide formate printers, sublimation machines,
                DTG, DTF & embroidery equipment – so you know that no job is too
                large or too small for us. Our 20+ ears of industry experience
                means fast turnaround times and unbeatable quality control
                standards on each order.
              </p>
              <CustomButton
                title="Explore Gang sheets"
                onClick={handleExploreGangSheets}
                className="px-10 py-5 w-fit"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="layout">
        <div className="flex flex-col md:flex-row justify-center items-center gap-5 py-10">
          <div className="md:w-[50%] w-full flex flex-col gap-10">
            <div className="flex flex-col gap-8">
              <h3 className="text-2xl md:text-4xl font-bold">
                Dedication, Quality, and Unmatched Service
              </h3>
              <p className="text-gray-500 text-lg md:text-xl">
                Plus our expertise in graphic design production and fulfillment
                programs mean your t-shirts will be party perfect -or full
                uniform program compliant- every time! Best yet: ownership stays
                on site everyday which guarantees personal investment into YOUR
                needs as a customer. We truly value your business & can’t wait
                to serve you!
              </p>
              <CustomButton
                title="Explore Gang sheets"
                onClick={handleExploreGangSheets}
                className="px-10 py-5 w-fit"
              />
            </div>
          </div>
          <div className="md:w-[70%] w-full flex items-center justify-center">
            <Image
              src="/images/apperal-hero.png"
              alt="why-choose-us"
              width={500}
              height={500}
              className="md:w-[550px] w-[400px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
