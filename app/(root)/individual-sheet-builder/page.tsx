"use client";

import React, { useState, DragEvent } from "react";
import { UploadCloud } from "lucide-react";

const Page = () => {
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
      <h1 className="text-2xl md:text-5xl font-poppins font-bold text-center mb-8">
        Individual Design File
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
            Upload Individual Sheet Design File
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
      <div className="mt-12 flex flex-col items-center justify-center">
        <h2 className="text-2xl md:text-5xl font-bold font-poppins text-center mb-4">
          Your DTF Designs History
        </h2>
        <p className="text-center text-gray-500 font-poppins underline italic">
          Pdf and eps files may show a white background instead of transparent
          background. This is the problem in converting a file to thumbnail
          display. I&apos;ll print transparent on a transfer.
        </p>
      </div>
    </main>
  );
};

export default Page;
