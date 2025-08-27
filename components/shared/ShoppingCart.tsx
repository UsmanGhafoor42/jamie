"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Trash2, Loader2 } from "lucide-react";
import axios from "axios";
import { useUser } from "../../hooks/useAuth";
import Link from "next/link";

interface CartItem {
  _id: string;
  imageUrl?: string;
  stikersImgeUrl?: string[];
  title: string;
  total: number;
  quantity: number;
  size?: string;
  sizeAndQuantity?: Record<string, number>;
  colorsName?: string;
  options?: string[];
  orderNotes?: string;
  createdAt: string;
}

const ShoppingCart: React.FC = () => {
  const { user, loading: authLoading } = useUser();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [deleteMultipleLoading, setDeleteMultipleLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/mine`,
        {
          withCredentials: true,
        }
      );
      setCart(response.data as CartItem[]);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch cart data on component mount
  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  const handleDelete = async (id: string) => {
    if (!user) {
      alert("Please login to delete cart items");
      return;
    }

    try {
      setDeleting(id);
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/delete/${user._id}/${id}`,
        { withCredentials: true }
      );

      setCart((prev) => prev.filter((item) => item._id !== id));
      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (error) {
      console.error("Error deleting cart item:", error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: unknown; status?: number };
        };
        console.error("Response data:", axiosError.response?.data);
        console.error("Response status:", axiosError.response?.status);
      }
      alert("Failed to delete item. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.size === cart.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cart.map((item) => item._id)));
    }
  };

  const handleDeleteMultiple = async () => {
    if (!user) {
      alert("Please login to delete cart items");
      return;
    }

    if (selectedItems.size === 0) return;

    try {
      setDeleteMultipleLoading(true);
      const cartItemIds = Array.from(selectedItems);

      await axios({
        method: "delete",
        url: `${process.env.NEXT_PUBLIC_API_URL}/cart/delete-multiple/${user._id}`,
        data: { cartItemIds },
        withCredentials: true,
      });

      setCart((prev) => prev.filter((item) => !selectedItems.has(item._id)));
      setSelectedItems(new Set());
    } catch (error) {
      console.error("Error deleting multiple cart items:", error);
      alert("Failed to delete selected items. Please try again.");
    } finally {
      setDeleteMultipleLoading(false);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.total || 0), 0);

  if (authLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--green)]" />
          <span className="ml-2">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full max-w-5xl mx-auto p-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          Your Shopping Cart
        </h1>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            Please login to view your cart
          </p>
          <p className="text-gray-400">
            You need to be authenticated to access your shopping cart.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--green)]" />
          <span className="ml-2">Loading cart...</span>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="w-full max-w-5xl mx-auto p-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          Your Shopping Cart
        </h1>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
          <p className="text-gray-400">Add some products to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Your Shopping Cart
          </h1>
          <p className="text-gray-600 mt-1">
            {cart.length} item{cart.length !== 1 ? "s" : ""} in your cart
          </p>
        </div>
        {selectedItems.size > 0 && (
          <button
            onClick={handleDeleteMultiple}
            disabled={deleteMultipleLoading}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-colors duration-200 shadow-sm"
          >
            {deleteMultipleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Delete Selected</span>
            <span className="sm:hidden">Delete</span>
            <span className="bg-red-600 px-2 py-1 rounded-full text-xs font-medium">
              {selectedItems.size}
            </span>
          </button>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              <th className="text-left p-6 font-semibold text-gray-900">
                <input
                  type="checkbox"
                  checked={selectedItems.size === cart.length}
                  onChange={handleSelectAll}
                  className="accent-[var(--green)] w-5 h-5 rounded border-gray-300"
                />
              </th>
              <th className="text-left p-6 font-semibold text-gray-900">
                Product
              </th>
              <th className="text-left p-6 font-semibold text-gray-900">
                Price
              </th>
              <th className="text-left p-6 font-semibold text-gray-900">
                Quantity
              </th>
              <th className="text-left p-6 font-semibold text-gray-900">
                Subtotal
              </th>
              <th className="p-6"></th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr
                key={item._id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="p-6">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item._id)}
                    onChange={() => handleSelectItem(item._id)}
                    className="accent-[var(--green)] w-5 h-5 rounded border-gray-300"
                  />
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      ) : item.stikersImgeUrl &&
                        item.stikersImgeUrl.length > 0 ? (
                        <Image
                          src={item.stikersImgeUrl[0]}
                          alt={item.title}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                          <span className="text-xs">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-gray-900 text-lg">
                        {item.title}
                      </span>
                      {item.size && (
                        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full inline-block">
                          Size: {item.size}
                        </span>
                      )}
                      {item.sizeAndQuantity && (
                        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full inline-block">
                          Size:&nbsp;
                          {Object.entries(item.sizeAndQuantity)
                            .filter(([, qty]) => qty > 0)
                            .map(([size, qty]) => `${size} (${qty})`)
                            .join(", ") || "N/A"}
                        </span>
                      )}
                      {item.colorsName && (
                        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full inline-block">
                          Color: {item.colorsName}
                        </span>
                      )}
                      {item.options && item.options.length > 0 && (
                        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full inline-block">
                          Options: {item.options.join(", ")}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <span className="text-lg font-semibold text-gray-900">
                    ${(item.total || 0).toFixed(2)}
                  </span>
                </td>
                <td className="p-6">
                  <span className="text-lg font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                    {item.quantity}
                  </span>
                </td>
                <td className="p-6">
                  <span className="text-lg font-bold text-[var(--green)]">
                    ${(item.total || 0).toFixed(2)}
                  </span>
                </td>
                <td className="p-6">
                  <button
                    onClick={() => handleDelete(item._id)}
                    disabled={deleting === item._id}
                    className="text-red-500 hover:text-red-700 disabled:opacity-50 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                    title="Remove item"
                  >
                    {deleting === item._id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {cart.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={selectedItems.has(item._id)}
                onChange={() => handleSelectItem(item._id)}
                className="accent-[var(--green)] w-5 h-5 rounded border-gray-300 mt-1"
              />
              <div className="flex-1">
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    ) : item.stikersImgeUrl &&
                      item.stikersImgeUrl.length > 0 ? (
                      <Image
                        src={item.stikersImgeUrl[0]}
                        alt={item.title}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                        <span className="text-xs">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-base mb-2">
                      {item.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.size && (
                        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                          Size: {item.size}
                        </span>
                      )}
                      {item.sizeAndQuantity && (
                        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                          Size:&nbsp;
                          {Object.entries(item.sizeAndQuantity)
                            .filter(([, qty]) => qty > 0)
                            .map(([size, qty]) => `${size} (${qty})`)
                            .join(", ") || "N/A"}
                        </span>
                      )}
                      {item.colorsName && (
                        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                          Color: {item.colorsName}
                        </span>
                      )}
                      {item.options && item.options.length > 0 && (
                        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                          Options: {item.options.join(", ")}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <span>Qty: {item.quantity}</span>
                        <span className="mx-2">•</span>
                        <span>${(item.total || 0).toFixed(2)} each</span>
                      </div>
                      <button
                        onClick={() => handleDelete(item._id)}
                        disabled={deleting === item._id}
                        className="text-red-500 hover:text-red-700 disabled:opacity-50 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                        title="Remove item"
                      >
                        {deleting === item._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Subtotal:</span>
                    <span className="font-bold text-lg text-[var(--green)]">
                      ${((item.total || 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Order Summary
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">
              Subtotal ({cart.length} items):
            </span>
            <span className="font-medium text-gray-900">
              ${subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Shipping:</span>
            <span className="font-medium text-green-600">Free</span>
          </div>
          <hr className="border-gray-200" />
          <div className="flex justify-between items-center py-2">
            <span className="text-xl font-semibold text-gray-900">Total:</span>
            <span className="text-2xl font-bold text-[var(--green)]">
              ${subtotal.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button className="flex-1 bg-[var(--green)] hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 cursor-pointer shadow-sm">
            Proceed to Checkout
          </button>
          <Link
            href="/"
            className="sm:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
