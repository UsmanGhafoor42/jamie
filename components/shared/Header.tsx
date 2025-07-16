"use client";
import { navLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import CustomButton from "@/components/custom/CustomButton";
import { ShoppingCart, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { useRouter } from "next/navigation";

const Header = () => {
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(
    null
  );
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const handleClick = () => {
    router.push("/auth/login");
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header>
      <div className="layout">
        <div className="flex justify-between items-center py-4">
          <Link href="/">
            <Image
              src="/icons/primary-logo.png"
              alt="logo"
              width={275}
              height={175}
              className="object-contain"
            />
          </Link>
          {/* Desktop Nav */}
          <div className="hidden lg:flex flex-col gap-4 mt-5">
            <div className="hidden lg:flex items-center gap-20">
              {navLinks.map((link) =>
                link.subLinks ? (
                  <div
                    key={link.name}
                    className="relative group"
                    ref={dropdownRef}
                  >
                    <button
                      type="button"
                      className="text-lg font-poppins flex items-center gap-1"
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === link.name ? null : link.name
                        )
                      }
                    >
                      {link.name}
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {openDropdown === link.name && (
                      <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                        {link.subLinks.map((sub) => (
                          <Link
                            href={sub.href ?? "/"}
                            key={sub.name}
                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                            onClick={() => setOpenDropdown(null)} // Close on link click
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={link.href ?? "/"}
                    key={link.name}
                    className="text-lg font-poppins"
                  >
                    {link.name}
                  </Link>
                )
              )}
              <div className="flex items-center gap-4">
                <Link href={"/cart"}>
                  <ShoppingCart className="w-6 h-6" />
                </Link>
                <CustomButton title="Login" onClick={handleClick} />
              </div>
            </div>
            <hr className="border-black border-2" />
          </div>
          {/* Mobile Nav */}
          <div className="flex lg:hidden items-center gap-2">
            <Link href={"/cart"}>
              <ShoppingCart className="w-6 h-6" />
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <button aria-label="Open menu">
                  <Menu className="w-8 h-8" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-white text-black">
                <SheetTitle className="sr-only">Main Menu</SheetTitle>
                <nav className="flex flex-col items-center gap-6 mt-8 w-full">
                  {navLinks.map((link) =>
                    link.subLinks ? (
                      <div key={link.name} className="w-full">
                        <button
                          className="flex items-center justify-between w-full text-lg font-poppins py-2 px-2 border-b border-gray-200"
                          onClick={() =>
                            setMobileDropdownOpen(
                              mobileDropdownOpen === link.name
                                ? null
                                : link.name
                            )
                          }
                        >
                          {link.name}
                          <svg
                            className={`w-4 h-4 ml-1 transition-transform ${
                              mobileDropdownOpen === link.name
                                ? "rotate-180"
                                : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                        {mobileDropdownOpen === link.name && (
                          <div className="flex flex-col w-full bg-gray-50 rounded-b-md">
                            {link.subLinks.map((sub) => (
                              <Link
                                href={sub.href ?? "/"}
                                key={sub.name}
                                className="block px-6 py-2 text-gray-800 hover:bg-gray-100 text-left"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={link.href ?? "/"}
                        key={link.name}
                        className="text-lg font-poppins w-full text-left px-2 py-2 border-b border-gray-200"
                      >
                        {link.name}
                      </Link>
                    )
                  )}
                  <CustomButton
                    title="Login"
                    onClick={() => {}}
                    className="w-full"
                  />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
