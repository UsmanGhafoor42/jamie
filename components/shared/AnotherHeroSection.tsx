import React from "react";
interface AnotherHeroSectionProps {
  title: string;
}

const AnotherHeroSection = ({ title }: AnotherHeroSectionProps) => {
  return (
    <div className="bg-black py-20">
      <div className="layout">
        <h2 className="text-2xl text-white md:text-5xl font-poppins uppercase font-bold text-center mb-4">
          {title}
        </h2>
      </div>
    </div>
  );
};

export default AnotherHeroSection;
