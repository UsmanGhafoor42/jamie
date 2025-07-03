import DtfButton from "@/components/custom/DtfButton";
import React from "react";

const page = () => {
  return (
    <div className="layout">
      <div className="flex flex-col justify-center items-center gap-10">
        <h1 className="text-4xl font-bold">Want To Place New Order</h1>
        <div className="flex flex-col md:flex-row gap-10">
          <DtfButton
            title="Gang Sheet DTF"
            url="/uv-stickers"
            className="px-12 py-6 w-fit  text-xl"
          />
          <DtfButton
            title="Individual Sheet DTF"
            url="/individual-sheet"
            className="px-12 py-6 w-fit  text-xl"
          />
          <DtfButton
            title="UV Stickers DTF"
            url="/uv-stickers"
            className="px-12 py-6 w-fit  text-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default page;
