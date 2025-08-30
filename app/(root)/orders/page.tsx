"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "../../../hooks/useAuth";
import axios from "axios";
import Image from "next/image";
import {
  Loader2,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";

interface OrderItem {
  productId?: string;
  title: string;
  imageUrl?: string;
  size?: string;
  sizeAndQuantity?: Record<string, number>;
  colorsName?: string;
  options?: string[];
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  imprintFiles?: string[];
  imprintLocations?: string[];
  orderNotes?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  orderDate: string;
  status:
    | "order_placed"
    | "in_printing"
    | "order_dispatched"
    | "completed"
    | "cancelled";
  statusHistory: Array<{
    status: string;
    timestamp: string;
    note?: string;
  }>;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  payment: {
    method: string;
    transactionId: string;
    amount: number;
    currency: string;
    status: "pending" | "completed" | "failed" | "refunded";
    authCode?: string;
    paymentDate?: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  shipping: {
    method: string;
    trackingNumber?: string;
    estimatedDelivery?: string;
    actualDelivery?: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

const ORDERS_PER_PAGE = 10;

const getStatusIcon = (status: string) => {
  switch (status) {
    case "order_placed":
      return <Clock className="w-4 h-4 text-blue-500" />;
    case "in_printing":
      return <Package className="w-4 h-4 text-yellow-500" />;
    case "order_dispatched":
      return <Truck className="w-4 h-4 text-purple-500" />;
    case "completed":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "cancelled":
      return <XCircle className="w-4 h-4 text-red-500" />;
    default:
      return <Clock className="w-4 h-4 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "order_placed":
      return "bg-blue-100 text-blue-800";
    case "in_printing":
      return "bg-yellow-100 text-yellow-800";
    case "order_dispatched":
      return "bg-purple-100 text-purple-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "order_placed":
      return "Order Placed";
    case "in_printing":
      return "In Printing";
    case "order_dispatched":
      return "Order Dispatched";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
};

const OrderHistoryTable = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reordering, setReordering] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/orders`,
        { withCredentials: true }
      );
      setOrders(response.data as Order[]);
      setTotalPages(
        Math.ceil((response.data as Order[]).length / ORDERS_PER_PAGE)
      );
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (orderId: string) => {
    try {
      setReordering(orderId);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/orders/${orderId}/reorder`,
        {},
        { withCredentials: true }
      );
      alert("Items added to cart successfully!");
    } catch (error) {
      console.error("Error reordering:", error);
      alert("Failed to add items to cart. Please try again.");
    } finally {
      setReordering(null);
    }
  };

  const paginatedOrders = orders.slice(
    (page - 1) * ORDERS_PER_PAGE,
    page * ORDERS_PER_PAGE
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--green)]" />
        <span className="ml-2">Loading orders...</span>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No orders yet
        </h3>
        <p className="text-gray-500 mb-6">
          Start shopping to see your order history here.
        </p>
        <Link
          href="/"
          className="bg-[var(--green)] text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Your Order History</h2>
        <p className="text-gray-600 mt-1">
          Track your orders and manage your purchases
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              <th className="py-4 px-4 font-semibold text-gray-900 text-left">
                Order
              </th>
              <th className="py-4 px-4 font-semibold text-gray-900 text-left">
                Status
              </th>
              <th className="py-4 px-4 font-semibold text-gray-900 text-left">
                Items
              </th>
              <th className="py-4 px-4 font-semibold text-gray-900 text-left">
                Total
              </th>
              <th className="py-4 px-4 font-semibold text-gray-900 text-left">
                Date
              </th>
              <th className="py-4 px-4 font-semibold text-gray-900 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order) => (
              <tr
                key={order._id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="text-[var(--green)] font-semibold">
                    {order.orderNumber}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="space-y-2">
                    {order.items.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              width={32}
                              height={32}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              No Img
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {item.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            Qty: {item.quantity} • ${item.unitPrice.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{order.items.length - 2} more items
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="font-semibold text-gray-900">
                    ${order.total.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {order.payment.status === "completed"
                      ? "Paid"
                      : order.payment.status}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/orders/${order._id}`}
                      className="flex items-center gap-1 text-[var(--green)] hover:text-green-600 text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Link>
                    <button
                      onClick={() => handleReorder(order._id)}
                      disabled={reordering === order._id}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
                    >
                      {reordering === order._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <RotateCcw className="w-4 h-4" />
                      )}
                      Reorder
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 p-6 border-t border-gray-200">
          <button
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="mx-4 text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

const OrdersPage = () => {
  return (
    <div className="layout py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">
            Track your orders and view your purchase history
          </p>
        </div>

        <OrderHistoryTable />
      </div>
    </div>
  );
};

export default OrdersPage;
