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

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchProducts = async (): Promise<ApparelProduct[]> => {
  if (!API_URL) throw new Error("API URL not set");
  const res = await axios.get(`${API_URL}/apparel/products`);
  const data = res.data as { products: ApparelProduct[] };
  return data.products;
};

const AddProductModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}> = ({ open, onClose, onProductAdded }) => {
  const [title, setTitle] = useState("");
  const [productImage, setProductImage] = useState<File | null>(null);
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
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      if (!API_URL) throw new Error("API URL not set");
      const formData = new FormData();
      formData.append("title", title);
      if (productImage) formData.append("productImage", productImage);
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
      formData.append("prices", JSON.stringify(prices)); // ✅ Send as single string
      formData.append("id", crypto.randomUUID()); // ✅ Ensure an ID is provided
      colorSwatchFiles.forEach((file) => {
        if (file) formData.append("colorSwatchImages", file);
      });
      await axios.post(`${API_URL}/apparel/products`, formData);
      setSuccess(true);
      onProductAdded();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error adding product");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 relative overflow-y-auto max-h-[90vh]">
        <button className="absolute top-2 right-2 text-2xl" onClick={onClose}>
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Add Apparel Product</h2>
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            {error}
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
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleProductImage(e.target.files?.[0] || null)}
              required
            />
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
              Add Detail
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
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleColorSwatchFile(i, e.target.files?.[0] || null)
                  }
                  required
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
              Add Color Swatch
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
              {loading ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
        {success && (
          <div className="text-green-600 mt-2">Product added successfully!</div>
        )}
      </div>
    </div>
  );
};

const ProductTable: React.FC<{ products: ApparelProduct[] }> = ({
  products,
}) => (
  <div className="overflow-x-auto mt-6">
    <table className="min-w-full border border-gray-300 text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-2 py-2 border">Image</th>
          <th className="px-2 py-2 border">Title</th>
          <th className="px-2 py-2 border">Description</th>
          <th className="px-2 py-2 border">Details</th>
          <th className="px-2 py-2 border">Colors</th>
          <th className="px-2 py-2 border">Prices</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p._id || p.title}>
            <td className="border px-2 py-1">
              <Image
                src={p.productImage}
                alt={p.title}
                width={60}
                height={60}
                className="object-cover rounded"
              />
            </td>
            <td className="border px-2 py-1 font-semibold">{p.title}</td>
            <td className="border px-2 py-1 max-w-xs truncate">
              {p.description}
            </td>
            <td className="border px-2 py-1 max-w-xs truncate">
              <ul className="list-disc list-inside">
                {p.details.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </td>
            <td className="border px-2 py-1">
              <div className="flex flex-wrap gap-1">
                {p.colorSwatches.map((c, i) => (
                  <span
                    key={i}
                    className="inline-block w-5 h-5 rounded-full border"
                    style={{ background: c.hex }}
                    title={c.name}
                  ></span>
                ))}
              </div>
            </td>
            <td className="border px-2 py-1">
              <ul>
                {p.prices.map((pr, i) => (
                  <li key={i}>
                    {pr.size}: ${pr.price}
                  </li>
                ))}
              </ul>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const AddProductPage: React.FC = () => {
  const [products, setProducts] = useState<ApparelProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error loading products");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <main className="p-4 lg:p-12 layout">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Apparel Products</h1>
        <button
          className="bg-[var(--green)] text-white px-4 py-2 rounded shadow hover:bg-green-700"
          onClick={() => setModalOpen(true)}
        >
          + Add Product
        </button>
      </div>
      {loading ? (
        <div>Loading products...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <ProductTable products={products} />
      )}
      <AddProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onProductAdded={loadProducts}
      />
    </main>
  );
};

export default AddProductPage;
