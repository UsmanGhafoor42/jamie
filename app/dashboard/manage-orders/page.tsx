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
  Search,
  Filter,
  Download,
  Calendar,
  MapPin,
  CreditCard,
  Edit3,
  Save,
  X,
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
  user: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
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
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

const ORDERS_PER_PAGE = 20;

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

const AdminOrderManagement = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: ORDERS_PER_PAGE,
  });

  // Filters
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    startDate: "",
    endDate: "",
    sortBy: "createdAt",
    sortOrder: "desc" as "asc" | "desc",
  });

  // Editing states
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [editingStatus, setEditingStatus] = useState("");
  const [editingNote, setEditingNote] = useState("");
  const [editingShipping, setEditingShipping] = useState({
    trackingNumber: "",
    estimatedDelivery: "",
    actualDelivery: "",
    shippingMethod: "",
  });
  const [editingAdminNotes, setEditingAdminNotes] = useState("");

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, filters, pagination.currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: ORDERS_PER_PAGE.toString(),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        ...(filters.status !== "all" && { status: filters.status }),
        ...(filters.search && { search: filters.search }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      });

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/orders?${queryParams}`,
        { withCredentials: true }
      );

      const responseData = response.data as any;
      setOrders(responseData.orders || []);
      setPagination(
        responseData.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalOrders: 0,
          hasNextPage: false,
          hasPrevPage: false,
          limit: ORDERS_PER_PAGE,
        }
      );
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/orders/${orderId}/status`,
        {
          status: editingStatus,
          note: editingNote,
        },
        { withCredentials: true }
      );

      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: editingStatus as any,
                statusHistory: [
                  ...order.statusHistory,
                  {
                    status: editingStatus,
                    timestamp: new Date().toISOString(),
                    note: editingNote,
                  },
                ],
              }
            : order
        )
      );

      setEditingOrder(null);
      setEditingStatus("");
      setEditingNote("");
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    }
  };

  const handleShippingUpdate = async (orderId: string) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/orders/${orderId}/shipping`,
        editingShipping,
        { withCredentials: true }
      );

      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? {
                ...order,
                shipping: {
                  ...order.shipping,
                  ...editingShipping,
                },
              }
            : order
        )
      );

      setEditingOrder(null);
      setEditingShipping({
        trackingNumber: "",
        estimatedDelivery: "",
        actualDelivery: "",
        shippingMethod: "",
      });
    } catch (error) {
      console.error("Error updating shipping info:", error);
      alert("Failed to update shipping information");
    }
  };

  const handleAdminNotesUpdate = async (orderId: string) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/orders/${orderId}/notes`,
        { note: editingAdminNotes },
        { withCredentials: true }
      );

      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? { ...order, adminNotes: editingAdminNotes }
            : order
        )
      );

      setEditingOrder(null);
      setEditingAdminNotes("");
    } catch (error) {
      console.error("Error updating admin notes:", error);
      alert("Failed to update admin notes");
    }
  };

  const handleExport = async () => {
    try {
      const queryParams = new URLSearchParams({
        ...(filters.status !== "all" && { status: filters.status }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      });

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/orders/export?${queryParams}`,
        {
          withCredentials: true,
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data as BlobPart])
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `orders-${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting orders:", error);
      alert("Failed to export orders");
    }
  };

  const startEditing = (order: Order, type: string) => {
    setEditingOrder(order._id);
    setEditingStatus(order.status);
    setEditingNote("");
    setEditingShipping({
      trackingNumber: order.shipping.trackingNumber || "",
      estimatedDelivery: order.shipping.estimatedDelivery
        ? new Date(order.shipping.estimatedDelivery).toISOString().split("T")[0]
        : "",
      actualDelivery: order.shipping.actualDelivery
        ? new Date(order.shipping.actualDelivery).toISOString().split("T")[0]
        : "",
      shippingMethod: order.shipping.method || "",
    });
    setEditingAdminNotes(order.adminNotes || "");
  };

  const cancelEditing = () => {
    setEditingOrder(null);
    setEditingStatus("");
    setEditingNote("");
    setEditingShipping({
      trackingNumber: "",
      estimatedDelivery: "",
      actualDelivery: "",
      shippingMethod: "",
    });
    setEditingAdminNotes("");
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--green)]" />
        <span className="ml-2">Loading orders...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        <p className="text-gray-600 mt-2">
          Manage and track all customer orders
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Order number, customer name, or email"
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
            >
              <option value="all">All Statuses</option>
              <option value="order_placed">Order Placed</option>
              <option value="in_printing">In Printing</option>
              <option value="order_dispatched">Order Dispatched</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, startDate: e.target.value }))
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, endDate: e.target.value }))
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, sortBy: e.target.value }))
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
            >
              <option value="createdAt">Order Date</option>
              <option value="total">Total Amount</option>
              <option value="status">Status</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order
            </label>
            <select
              value={filters.sortOrder}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  sortOrder: e.target.value as "asc" | "desc",
                }))
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            {pagination.totalOrders} orders found
          </div>
          <button
            onClick={handleExport}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] text-sm">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="py-4 px-4 font-semibold text-gray-900 text-left">
                  Order
                </th>
                <th className="py-4 px-4 font-semibold text-gray-900 text-left">
                  Customer
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
              {orders.map((order) => (
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
                    <div className="font-medium text-gray-900">
                      {order.customerInfo.firstName}{" "}
                      {order.customerInfo.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.customerInfo.email}
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
                    <div className="space-y-1">
                      {order.items.slice(0, 2).map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                            {item.imageUrl ? (
                              <Image
                                src={item.imageUrl}
                                alt={item.title}
                                width={24}
                                height={24}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                No Img
                              </div>
                            )}
                          </div>
                          <div className="text-sm text-gray-900 truncate max-w-[150px]">
                            {item.title}
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
                        href={`/dashboard/manage-orders/${order._id}`}
                        className="flex items-center gap-1 text-[var(--green)] hover:text-green-600 text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </Link>

                      {editingOrder === order._id ? (
                        <div className="space-y-2">
                          <select
                            value={editingStatus}
                            onChange={(e) => setEditingStatus(e.target.value)}
                            className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="order_placed">Order Placed</option>
                            <option value="in_printing">In Printing</option>
                            <option value="order_dispatched">
                              Order Dispatched
                            </option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Status note (optional)"
                            value={editingNote}
                            onChange={(e) => setEditingNote(e.target.value)}
                            className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                          />
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleStatusUpdate(order._id)}
                              className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                            >
                              <Save className="w-3 h-3" />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="text-xs bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditing(order, "status")}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          <Edit3 className="w-4 h-4" />
                          Update Status
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 p-6 border-t border-gray-200">
            <button
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  currentPage: prev.currentPage - 1,
                }))
              }
              disabled={!pagination.hasPrevPage}
            >
              Previous
            </button>
            <span className="mx-4 text-gray-600">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  currentPage: prev.currentPage + 1,
                }))
              }
              disabled={!pagination.hasNextPage}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrderManagement;
