import HeroSection from "@/components/shared/HeroSection";
import WhyChooseUs from "@/components/shared/WhyChooseUs";
import React from "react";

const page = () => {
  return (
    <div>
      <HeroSection />
      <hr className="border-black layout" />
      <WhyChooseUs />
    </div>
  );
};

export default page;
