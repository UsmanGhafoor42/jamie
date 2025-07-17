"use client";
import Image from "next/image";
import React from "react";
import { motion, easeInOut } from "framer-motion";

const WhyChooseUs = () => {
  return (
    <section className="py-10 layout">
      <div className="flex flex-col items-center justify-center">
        <motion.h2
          className="text-3xl md:text-5xl font-bold"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeInOut }}
          viewport={{ once: true }}
        >
          Why Choose Us
        </motion.h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-10 py-10">
          <motion.div
            className="md:w-[50%] w-full flex items-center justify-center"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: easeInOut }}
            viewport={{ once: true }}
          >
            <Image
              src="/images/why-choose-us.png"
              alt="why-choose-us"
              width={500}
              height={500}
              className="md:w-[550px] w-[400px]"
            />
          </motion.div>
          <motion.div
            className="md:w-[50%] w-full flex flex-col gap-10"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: easeInOut }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col gap-8">
              <motion.h3
                className="text-2xl md:text-4xl font-bold"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4, ease: easeInOut }}
                viewport={{ once: true }}
              >
                Trust, Expertise, Service, Results, Commitment
              </motion.h3>
              <motion.ul
                className="flex flex-col gap-4"
                style={{ listStyle: "disc" }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5, ease: easeInOut }}
                viewport={{ once: true }}
              >
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
              </motion.ul>
              <motion.p
                className="text-black italic text-lg md:text-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6, ease: easeInOut }}
                viewport={{ once: true }}
              >
                Join hundreds of satisfied customers who trust us for their DTF
                printing needs. Experience the difference of a partner who truly
                understands your business.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
