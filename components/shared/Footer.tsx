import { footerLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="layout">
        <div className="flex flex-col items-center gap-10 py-20">
          <Image
            src="/icons/secondary-logo.png"
            alt="logo"
            width={152}
            height={69}
          />
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-10">
            {footerLinks.map((link) => (
              <Link
                href={link.href}
                key={link.name}
                className="text-lg text-white font-poppins"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <hr className="border-gray-200" />
      <div className="layout">
        <div className="flex flex-col md:flex-row justify-between items-center py-4 gap-2 md:gap-0 text-center">
          <p className="text-sm text-gray font-poppins">
            Copyright © 2025 The Metaxoft | All rights reserved.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-gray">
            <Link href="/terms-and-conditions">Terms & Conditions</Link>
            <Link href="/privacy-policy">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
