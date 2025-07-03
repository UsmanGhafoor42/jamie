"use client";
import DtfButton from "@/components/custom/DtfButton";
import React from "react";

const page = () => {
  return (
    <div className="layout">
      <DtfButton
        title="Gang Sheet DTF"
        url="/uv-stickers"
        className="px-12 py-6 w-fit  text-xl"
      />
    </div>
  );
};

export default page;
