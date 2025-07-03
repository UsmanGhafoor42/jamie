import React from "react";
interface CustomButtonProps {
  title: string;
  onClick: () => void;
  className?: string;
}
const CustomButton = ({ title, onClick, className }: CustomButtonProps) => {
  return (
    <button
      className={` "text-base px-4 py-2 bg-[var(--green)] rounded-md text-white font-poppins" ${className}`}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default CustomButton;
