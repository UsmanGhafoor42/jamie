"use client";

import React, { useState, DragEvent } from "react";
import { UploadCloud } from "lucide-react";
import GangSheetCard from "@/components/shared/GangSheetCard";

const Page = () => {
  const gangSheetHistory = [
    {
      id: 1,
      image: "/images/gang-sheet-card.png",
      title: "Gang Sheet 1",
    },
    {
      id: 2,
      image: "/images/gang-sheet-card.png",
      title: "Gang Sheet 2",
    },
    {
      id: 3,
      image: "/images/gang-sheet-card.png",
      title: "Gang Sheet 2",
    },
    {
      id: 4,
      image: "/images/gang-sheet-card.png",
      title: "Gang Sheet 2",
    },
    {
      id: 5,
      image: "/images/gang-sheet-card.png",
      title: "Gang Sheet 2",
    },
    {
      id: 6,
      image: "/images/gang-sheet-card.png",
      title: "Gang Sheet 2",
    },
    {
      id: 7,
      image: "/images/gang-sheet-card.png",
      title: "Gang Sheet 2",
    },
    {
      id: 8,
      image: "/images/gang-sheet-card.png",
      title: "Gang Sheet 2",
    },
    {
      id: 9,
      image: "/images/gang-sheet-card.png",
      title: "Gang Sheet 2",
    },
    {
      id: 10,
      image: "/images/gang-sheet-card.png",
      title: "Gang Sheet 2",
    },
  ];
  const [file, setFile] = useState<File | null>(null);

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  return (
    <main className="p-4 lg:p-12 layout">
      <h1 className="text-2xl md:text-5xl font-bold text-center mb-8">
        Gang Sheet Builder
      </h1>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-8 w-full max-w-6xl mx-auto justify-center">
        {/* Upload Box */}
        <label
          htmlFor="fileInput"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-white bg-[var(--gray)] text-white rounded-xl flex flex-col items-center justify-center px-8 py-16 cursor-pointer transition hover:bg-gray-500 text-center"
        >
          <UploadCloud className="w-10 h-10 mb-4" />
          <p className="text-lg font-semibold mb-2">
            Upload Gang Sheet Design File
          </p>
          <p className="text-sm">Click here or drag and drop file</p>
          <input
            id="fileInput"
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
          {file && <p className="mt-4 text-sm text-green-300">{file.name}</p>}
        </label>

        {/* File Requirements */}
        <div className="border border-gray-300 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-center mb-4">
            File Requirements
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold underline mb-2">
                Available Film Size
              </h3>
              <ul className="space-y-1">
                <li>Small - 11.00&quot; x 12.50&quot;</li>
                <li>Medium - 22.50&quot; x 12.50&quot;</li>
                <li>Large - 22.50&quot; x 25.00&quot;</li>
                <li>Extra Large - 22.50&quot; x 60.00&quot;</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold underline mb-2">
                File Requirements
              </h3>
              <ul className="space-y-1">
                <li>Max File Size 100 Megabytes</li>
                <li>png - tif - pdf - eps - ai</li>
                <li>Transparent Background</li>
                <li>Min 300dpi & Max 600dpi</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-center mt-4 italic text-gray-500">
            All text should be converted to curve
          </p>
        </div>
      </div>
      <h1 className="text-2xl md:text-5xl font-bold text-center mt-10">
        Your DTF Designs History
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-y-16 mt-10 py-5">
        {gangSheetHistory.map((gangSheet) => (
          <GangSheetCard
            key={gangSheet.id}
            image={gangSheet.image}
            title={gangSheet.title}
          />
        ))}
      </div>
    </main>
  );
};

export default Page;
