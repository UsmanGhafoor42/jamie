"use client";
import { adminNavLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import CustomButton from "@/components/custom/CustomButton";
import { ShoppingCart, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useAuth";
import axios from "axios";

const AdminHeader = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const { user, loading } = useUser();
  const router = useRouter();

  const handleClick = () => {
    router.push("/auth/login");
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      window.location.reload(); // ✅ this ensures UI updates instantly
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Close dropdown on outside click

  if (loading) return null;

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
            <div className="hidden lg:flex items-center gap-16">
              {adminNavLinks.map((link) => (
                <Link
                  href={link.href}
                  key={link.name}
                  className="text-lg font-poppins"
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center gap-4">
                <Link href={"/cart"}>
                  <ShoppingCart className="w-6 h-6" />
                </Link>
                {user ? (
                  <CustomButton title="Logout" onClick={handleLogout} />
                ) : (
                  <CustomButton title="Login" onClick={handleClick} />
                )}
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
                  {adminNavLinks.map((link) => (
                    <Link
                      href={link.href}
                      key={link.name}
                      className="text-lg font-poppins w-full text-left px-2 py-2 border-b border-gray-200"
                    >
                      {link.name}
                    </Link>
                  ))}
                  {user ? (
                    <CustomButton
                      title="Logout"
                      onClick={handleLogout}
                      className="w-full"
                    />
                  ) : (
                    <CustomButton
                      title="Login"
                      onClick={handleClick}
                      className="w-full"
                    />
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
