"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";

interface ColorSwatch {
  name: string;
  hex: string;
  image: string;
}

interface Price {
  size: string;
  price: number;
}

interface ApparelProduct {
  _id?: string;
  title: string;
  productImage: string;
  description: string;
  details: string[];
  finishingMeasurementTable: (string | number)[][];
  colorSwatches: ColorSwatch[];
  prices: Price[];
}

interface EditProductModalProps {
  open: boolean;
  onClose: () => void;
  onProductUpdated: () => void;
  product: ApparelProduct | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const EditProductModal: React.FC<EditProductModalProps> = ({
  open,
  onClose,
  onProductUpdated,
  product,
}) => {
  const [title, setTitle] = useState("");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [currentProductImage, setCurrentProductImage] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState<string[]>([""]);
  const [finishingMeasurementTable, setFinishingMeasurementTable] = useState<
    (string | number)[][]
  >([
    ["", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL"],
    ["Body Length", "", "", "", "", "", "", "", "", "", ""],
    ["Body Length Tolerance", "", "", "", "", "", "", "", "", "", ""],
    ["Chest Tolerance", "", "", "", "", "", "", "", "", "", ""],
    ["Chest Width (Laid Flat)", "", "", "", "", "", "", "", "", "", ""],
  ]);
  const [colorSwatches, setColorSwatches] = useState<ColorSwatch[]>([]);
  const [colorSwatchFiles, setColorSwatchFiles] = useState<
    (File | undefined)[]
  >([]);
  const [prices, setPrices] = useState<Price[]>([
    { size: "S", price: 0 },
    { size: "M", price: 0 },
    { size: "L", price: 0 },
    { size: "XL", price: 0 },
    { size: "XXL", price: 0 },
    { size: "3XL", price: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Populate form with product data when modal opens
  useEffect(() => {
    if (product && open) {
      setTitle(product.title);
      setCurrentProductImage(product.productImage);
      setDescription(product.description);
      setDetails(product.details);
      setFinishingMeasurementTable(product.finishingMeasurementTable);
      setColorSwatches(product.colorSwatches);
      setColorSwatchFiles(
        new Array(product.colorSwatches.length).fill(undefined)
      );
      setPrices(product.prices);
    }
  }, [product, open]);

  const handleColorSwatchChange = (
    idx: number,
    field: keyof ColorSwatch,
    value: string
  ) => {
    setColorSwatches((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  const handleColorSwatchFile = (idx: number, file: File | null) => {
    setColorSwatchFiles((prev) => {
      const updated = [...prev];
      updated[idx] = file!;
      return updated;
    });
  };

  const handleAddColorSwatch = () => {
    setColorSwatches((prev) => [...prev, { name: "", hex: "", image: "" }]);
    setColorSwatchFiles((prev) => [...prev, undefined]);
  };

  const handleRemoveColorSwatch = (idx: number) => {
    setColorSwatches((prev) => prev.filter((_, i) => i !== idx));
    setColorSwatchFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleDetailChange = (idx: number, value: string) => {
    setDetails((prev) => {
      const updated = [...prev];
      updated[idx] = value;
      return updated;
    });
  };

  const handleAddDetail = () => setDetails((prev) => [...prev, ""]);
  const handleRemoveDetail = (idx: number) =>
    setDetails((prev) => prev.filter((_, i) => i !== idx));

  const handleMeasurementChange = (row: number, col: number, value: string) => {
    setFinishingMeasurementTable((prev) => {
      const updated = prev.map((r) => [...r]);
      updated[row][col] = value;
      return updated;
    });
  };

  const handlePriceChange = (
    idx: number,
    field: keyof Price,
    value: string
  ) => {
    setPrices((prev) => {
      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        [field]: field === "price" ? Number(value) : value,
      };
      return updated;
    });
  };

  const handleProductImage = (file: File | null) => setProductImage(file);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product?._id) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!API_URL) throw new Error("API URL not set");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("details", JSON.stringify(details));
      formData.append(
        "finishingMeasurementTable",
        JSON.stringify(finishingMeasurementTable)
      );
      formData.append(
        "colorSwatches",
        JSON.stringify(
          colorSwatches.map((swatch) => ({ ...swatch, image: swatch.image }))
        )
      );
      formData.append("prices", JSON.stringify(prices));

      // Only append new product image if one was selected
      if (productImage) {
        formData.append("productImage", productImage);
      }

      // Append color swatch files (only those with new files)
      colorSwatchFiles.forEach((file) => {
        if (file) formData.append("colorSwatchImages", file);
      });

      await axios.patch(
        `${API_URL}/apparel/products/${product._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setSuccess(true);
      onProductUpdated();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error updating product");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 relative overflow-y-auto max-h-[90vh]">
        <button className="absolute top-2 right-2 text-2xl" onClick={onClose}>
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Edit Apparel Product</h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">
            Product updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Title</label>
            <input
              className="border rounded px-3 py-2 w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium">Product Image</label>
            {currentProductImage && (
              <div className="mb-2">
                <Image
                  src={currentProductImage}
                  alt="Current product image"
                  width={100}
                  height={100}
                  className="object-cover rounded border"
                />
                <p className="text-sm text-gray-500 mt-1">Current image</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleProductImage(e.target.files?.[0] || null)}
            />
            <p className="text-sm text-gray-500 mt-1">
              Leave empty to keep current image
            </p>
          </div>

          <div>
            <label className="block font-medium">Description</label>
            <textarea
              className="border rounded px-3 py-2 w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium">Details</label>
            {details.map((d, i) => (
              <div key={i} className="flex gap-2 mb-1">
                <input
                  className="border rounded px-2 py-1 flex-1"
                  value={d}
                  onChange={(e) => handleDetailChange(i, e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveDetail(i)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddDetail}
              className="text-[var(--green)] mt-1"
            >
              + Add Detail
            </button>
          </div>

          <div>
            <label className="block font-medium mb-1">
              Finishing Measurement Table
            </label>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-sm text-center">
                <tbody>
                  {finishingMeasurementTable.map((row, rowIdx) => (
                    <tr key={rowIdx}>
                      {row.map((cell, colIdx) => (
                        <td key={colIdx} className="border px-2 py-1">
                          <input
                            className="w-24 border rounded px-1 py-1 text-center"
                            value={cell}
                            onChange={(e) =>
                              handleMeasurementChange(
                                rowIdx,
                                colIdx,
                                e.target.value
                              )
                            }
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Color Swatches</label>
            {colorSwatches.map((swatch, i) => (
              <div key={i} className="flex gap-2 mb-1 items-center">
                <input
                  className="border rounded px-2 py-1"
                  placeholder="Name"
                  value={swatch.name}
                  onChange={(e) =>
                    handleColorSwatchChange(i, "name", e.target.value)
                  }
                  required
                />
                <input
                  className="border rounded px-2 py-1 w-24"
                  placeholder="#hex"
                  value={swatch.hex}
                  onChange={(e) =>
                    handleColorSwatchChange(i, "hex", e.target.value)
                  }
                  required
                />
                {swatch.image && (
                  <div className="flex items-center gap-2">
                    <Image
                      src={swatch.image}
                      alt={swatch.name}
                      width={40}
                      height={40}
                      className="object-cover rounded border"
                    />
                    <span className="text-xs text-gray-500">Current</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleColorSwatchFile(i, e.target.files?.[0] || null)
                  }
                />
                <button
                  type="button"
                  onClick={() => handleRemoveColorSwatch(i)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddColorSwatch}
              className="text-[var(--green)] mt-1"
            >
              + Add Color Swatch
            </button>
          </div>

          <div>
            <label className="block font-medium mb-1">Prices</label>
            {prices.map((p, i) => (
              <div key={i} className="flex gap-2 mb-1 items-center">
                <input
                  className="border rounded px-2 py-1 w-16"
                  placeholder="Size"
                  value={p.size}
                  onChange={(e) => handlePriceChange(i, "size", e.target.value)}
                  required
                />
                <input
                  className="border rounded px-2 py-1 w-24"
                  type="number"
                  placeholder="Price"
                  value={p.price}
                  onChange={(e) =>
                    handlePriceChange(i, "price", e.target.value)
                  }
                  required
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[var(--green)] text-white"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
