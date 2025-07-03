import Image from "next/image";
import React from "react";

const WhyChooseUs = () => {
  return (
    <section className="py-10 layout">
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-3xl md:text-5xl font-bold">Why Choose Us</h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-10 py-10">
          <div className="md:w-[50%] w-full flex items-center justify-center">
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
                Trust, Expertise, Service, Results, Commitment
              </h3>
              <ul className="flex flex-col gap-4" style={{ listStyle: "disc" }}>
                <li className="text-gray-500 text-lg md:text-xl">
                  <span className="text-black">Same-Day Turnaround:</span> Fast
                  production to keep your business moving
                </li>
                <li className="text-gray-500 text-lg md:text-xl">
                  <span className="text-black">Pricing:</span> Competitive rates
                  without compromising quality.
                </li>
                <li className="text-gray-500 text-lg md:text-xl">
                  <span className="text-black">Easy Online Ordering:</span>{" "}
                  Upload your artwork and create gang sheets in minutes.
                </li>
                <li className="text-gray-500 text-lg md:text-xl">
                  <span className="text-black">Reliable Reordering:</span>{" "}
                  Access your order history anytime for quick repeat orders
                </li>
                <li className="text-gray-500 text-lg md:text-xl">
                  <span className="text-black">Customer-First Support:</span>{" "}
                  We&apos;re here to answer your questions and help you every
                  step of the way.
                </li>
              </ul>
              <p className="text-black italic text-lg md:text-xl">
                Join hundreds of satisfied customers who trust us for their DTF
                printing needs. Experience the difference of a partner who truly
                understands your business.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
