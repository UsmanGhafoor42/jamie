"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "../../../../hooks/useAuth";
import axios from "axios";
import Image from "next/image";
import {
  Loader2,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  CreditCard,
  Edit3,
  Save,
  X,
  User,
  FileText,
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

const getStatusIcon = (status: string) => {
  switch (status) {
    case "order_placed":
      return <Clock className="w-5 h-5 text-blue-500" />;
    case "in_printing":
      return <Package className="w-5 h-5 text-yellow-500" />;
    case "order_dispatched":
      return <Truck className="w-5 h-5 text-purple-500" />;
    case "completed":
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case "cancelled":
      return <XCircle className="w-5 h-5 text-red-500" />;
    default:
      return <Clock className="w-5 h-5 text-gray-500" />;
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

const AdminOrderDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Editing states
  const [editingStatus, setEditingStatus] = useState("");
  const [editingNote, setEditingNote] = useState("");
  const [editingShipping, setEditingShipping] = useState({
    trackingNumber: "",
    estimatedDelivery: "",
    actualDelivery: "",
    shippingMethod: "",
  });
  const [editingAdminNotes, setEditingAdminNotes] = useState("");

  // Edit modes
  const [editMode, setEditMode] = useState<
    "status" | "shipping" | "notes" | null
  >(null);

  const fetchOrderDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/orders/${params.id}`,
        { withCredentials: true }
      );
      const orderData = response.data as Order;
      setOrder(orderData);

      // Initialize editing states
      setEditingStatus(orderData.status);
      setEditingShipping({
        trackingNumber: orderData.shipping.trackingNumber || "",
        estimatedDelivery: orderData.shipping.estimatedDelivery
          ? new Date(orderData.shipping.estimatedDelivery)
              .toISOString()
              .split("T")[0]
          : "",
        actualDelivery: orderData.shipping.actualDelivery
          ? new Date(orderData.shipping.actualDelivery)
              .toISOString()
              .split("T")[0]
          : "",
        shippingMethod: orderData.shipping.method || "",
      });
      setEditingAdminNotes(orderData.adminNotes || "");
    } catch (error) {
      console.error("Error fetching order details:", error);
      router.push("/dashboard/manage-orders");
    } finally {
      setLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    if (user && params.id) {
      fetchOrderDetails();
    }
  }, [user, params.id, fetchOrderDetails]);

  const handleStatusUpdate = async () => {
    if (!order) return;

    try {
      setUpdating(true);
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/orders/${order._id}/status`,
        {
          status: editingStatus,
          note: editingNote,
        },
        { withCredentials: true }
      );

      // Update local state
      setOrder((prev) =>
        prev
          ? {
              ...prev,
              status: editingStatus as Order["status"],
              statusHistory: [
                ...prev.statusHistory,
                {
                  status: editingStatus,
                  timestamp: new Date().toISOString(),
                  note: editingNote,
                },
              ],
            }
          : null
      );

      setEditMode(null);
      setEditingNote("");
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  const handleShippingUpdate = async () => {
    if (!order) return;

    try {
      setUpdating(true);
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/orders/${order._id}/shipping`,
        editingShipping,
        { withCredentials: true }
      );

      // Update local state
      setOrder((prev) =>
        prev
          ? {
              ...prev,
              shipping: {
                ...prev.shipping,
                ...editingShipping,
              },
            }
          : null
      );

      setEditMode(null);
    } catch (error) {
      console.error("Error updating shipping info:", error);
      alert("Failed to update shipping information");
    } finally {
      setUpdating(false);
    }
  };

  const handleAdminNotesUpdate = async () => {
    if (!order) return;

    try {
      setUpdating(true);
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/orders/${order._id}/notes`,
        { note: editingAdminNotes },
        { withCredentials: true }
      );

      // Update local state
      setOrder((prev) =>
        prev ? { ...prev, adminNotes: editingAdminNotes } : null
      );

      setEditMode(null);
    } catch (error) {
      console.error("Error updating admin notes:", error);
      alert("Failed to update admin notes");
    } finally {
      setUpdating(false);
    }
  };

  const startEditing = (mode: "status" | "shipping" | "notes") => {
    setEditMode(mode);
  };

  const cancelEditing = () => {
    setEditMode(null);
    // Reset to original values
    if (order) {
      setEditingStatus(order.status);
      setEditingShipping({
        trackingNumber: order.shipping.trackingNumber || "",
        estimatedDelivery: order.shipping.estimatedDelivery
          ? new Date(order.shipping.estimatedDelivery)
              .toISOString()
              .split("T")[0]
          : "",
        actualDelivery: order.shipping.actualDelivery
          ? new Date(order.shipping.actualDelivery).toISOString().split("T")[0]
          : "",
        shippingMethod: order.shipping.method || "",
      });
      setEditingAdminNotes(order.adminNotes || "");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--green)]" />
        <span className="ml-2">Loading order details...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Order not found
          </h2>
          <Link
            href="/dashboard/manage-orders"
            className="bg-[var(--green)] text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/dashboard/manage-orders"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Orders
            </Link>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Order #{order.orderNumber}
              </h1>
              <p className="text-gray-600 mt-2">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {getStatusIcon(order.status)}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {getStatusLabel(order.status)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Quantity:</span>{" "}
                          {item.quantity}
                        </div>
                        <div>
                          <span className="font-medium">Unit Price:</span> $
                          {item.unitPrice.toFixed(2)}
                        </div>
                        {item.size && (
                          <div>
                            <span className="font-medium">Size:</span>{" "}
                            {item.size}
                          </div>
                        )}
                        {item.colorsName && (
                          <div>
                            <span className="font-medium">Color:</span>{" "}
                            {item.colorsName}
                          </div>
                        )}
                        {item.options && item.options.length > 0 && (
                          <div className="col-span-2">
                            <span className="font-medium">Options:</span>{" "}
                            {item.options.join(", ")}
                          </div>
                        )}
                        {item.orderNotes && (
                          <div className="col-span-2">
                            <span className="font-medium">Notes:</span>{" "}
                            {item.orderNotes}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-lg text-[var(--green)]">
                        ${item.totalPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status History */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Order Status Timeline
                </h2>
                {editMode !== "status" && (
                  <button
                    onClick={() => startEditing("status")}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <Edit3 className="w-4 h-4" />
                    Update Status
                  </button>
                )}
              </div>

              {editMode === "status" ? (
                <div className="mb-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Status
                      </label>
                      <select
                        value={editingStatus}
                        onChange={(e) => setEditingStatus(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
                      >
                        <option value="order_placed">Order Placed</option>
                        <option value="in_printing">In Printing</option>
                        <option value="order_dispatched">
                          Order Dispatched
                        </option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Note (Optional)
                      </label>
                      <input
                        type="text"
                        value={editingNote}
                        onChange={(e) => setEditingNote(e.target.value)}
                        placeholder="Add a note about this status change"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleStatusUpdate}
                      disabled={updating}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 transition-colors"
                    >
                      {updating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Update Status
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : null}

              <div className="space-y-4">
                {order.statusHistory.map((status, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-[var(--green)] flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {getStatusLabel(status.status)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(status.timestamp).toLocaleString()}
                      </div>
                      {status.note && (
                        <div className="text-sm text-gray-600 mt-1">
                          Note: {status.note}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Notes */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[var(--green)]" />
                  Admin Notes
                </h2>
                {editMode !== "notes" && (
                  <button
                    onClick={() => startEditing("notes")}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <Edit3 className="w-4 h-4" />
                    {order.adminNotes ? "Edit Notes" : "Add Notes"}
                  </button>
                )}
              </div>

              {editMode === "notes" ? (
                <div className="mb-4">
                  <textarea
                    value={editingAdminNotes}
                    onChange={(e) => setEditingAdminNotes(e.target.value)}
                    placeholder="Add admin notes about this order..."
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={handleAdminNotesUpdate}
                      disabled={updating}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 transition-colors"
                    >
                      {updating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Save Notes
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-gray-700">
                  {order.adminNotes
                    ? order.adminNotes
                    : "No admin notes added yet."}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">
                    ${order.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    {order.shippingCost === 0
                      ? "Free"
                      : `$${order.shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">${order.tax.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">
                      -${order.discount.toFixed(2)}
                    </span>
                  </div>
                )}
                <hr className="border-gray-200" />
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-[var(--green)]">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[var(--green)]" />
                Customer Information
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Name:</span>
                  <div className="text-gray-900">
                    {order.customerInfo.firstName} {order.customerInfo.lastName}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <div className="text-gray-900">
                    {order.customerInfo.email}
                  </div>
                </div>
                {order.customerInfo.phone && (
                  <div>
                    <span className="font-medium text-gray-700">Phone:</span>
                    <div className="text-gray-900">
                      {order.customerInfo.phone}
                    </div>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-700">Address:</span>
                  <div className="text-gray-900">
                    {order.customerInfo.address.street}
                    <br />
                    {order.customerInfo.address.city},{" "}
                    {order.customerInfo.address.state}{" "}
                    {order.customerInfo.address.zipCode}
                    <br />
                    {order.customerInfo.address.country}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[var(--green)]" />
                Payment Information
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Method:</span>
                  <div className="text-gray-900">{order.payment.method}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <div className="text-gray-900 capitalize">
                    {order.payment.status}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    Transaction ID:
                  </span>
                  <div className="text-gray-900 font-mono text-xs">
                    {order.payment.transactionId}
                  </div>
                </div>
                {order.payment.authCode && (
                  <div>
                    <span className="font-medium text-gray-700">
                      Auth Code:
                    </span>
                    <div className="text-gray-900">
                      {order.payment.authCode}
                    </div>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-700">Amount:</span>
                  <div className="text-gray-900 font-semibold">
                    ${order.payment.amount.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[var(--green)]" />
                  Shipping Information
                </h2>
                {editMode !== "shipping" && (
                  <button
                    onClick={() => startEditing("shipping")}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                )}
              </div>

              {editMode === "shipping" ? (
                <div className="mb-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tracking Number
                    </label>
                    <input
                      type="text"
                      value={editingShipping.trackingNumber}
                      onChange={(e) =>
                        setEditingShipping((prev) => ({
                          ...prev,
                          trackingNumber: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estimated Delivery
                    </label>
                    <input
                      type="date"
                      value={editingShipping.estimatedDelivery}
                      onChange={(e) =>
                        setEditingShipping((prev) => ({
                          ...prev,
                          estimatedDelivery: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Actual Delivery
                    </label>
                    <input
                      type="date"
                      value={editingShipping.actualDelivery}
                      onChange={(e) =>
                        setEditingShipping((prev) => ({
                          ...prev,
                          actualDelivery: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shipping Method
                    </label>
                    <input
                      type="text"
                      value={editingShipping.shippingMethod}
                      onChange={(e) =>
                        setEditingShipping((prev) => ({
                          ...prev,
                          shippingMethod: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleShippingUpdate}
                      disabled={updating}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 transition-colors"
                    >
                      {updating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Update
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Method:</span>
                    <div className="text-gray-900">{order.shipping.method}</div>
                  </div>
                  {order.shipping.trackingNumber && (
                    <div>
                      <span className="font-medium text-gray-700">
                        Tracking Number:
                      </span>
                      <div className="text-gray-900 font-mono text-xs">
                        {order.shipping.trackingNumber}
                      </div>
                    </div>
                  )}
                  {order.shipping.estimatedDelivery && (
                    <div>
                      <span className="font-medium text-gray-700">
                        Estimated Delivery:
                      </span>
                      <div className="text-gray-900">
                        {new Date(
                          order.shipping.estimatedDelivery
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                  {order.shipping.actualDelivery && (
                    <div>
                      <span className="font-medium text-gray-700">
                        Actual Delivery:
                      </span>
                      <div className="text-gray-900">
                        {new Date(
                          order.shipping.actualDelivery
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-gray-700">
                      Shipping Address:
                    </span>
                    <div className="text-gray-900">
                      {order.shipping.address.street}
                      <br />
                      {order.shipping.address.city},{" "}
                      {order.shipping.address.state}{" "}
                      {order.shipping.address.zipCode}
                      <br />
                      {order.shipping.address.country}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailsPage;
