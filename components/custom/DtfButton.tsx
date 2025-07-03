import Image from "next/image";
import Link from "next/link";
import React from "react";
interface CustomButtonProps {
  title: string;
  className?: string;
  url: string;
}

const DtfButton = ({ title, className, url }: CustomButtonProps) => {
  return (
    <Link
      className={` "text-base px-4 py-2 bg-white rounded-md shadow-2xl text-black font-poppins flex items-center gap-2" ${className}`}
      href={url}
    >
      <Image
        src="/images/dtf.png"
        alt="dtf"
        width={40}
        height={40}
        className="mr-5"
      />
      {title}
    </Link>
  );
};

export default DtfButton;
