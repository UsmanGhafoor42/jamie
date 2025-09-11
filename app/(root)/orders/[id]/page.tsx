"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "../../../../hooks/useAuth";
import axios from "axios";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  Loader2,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  MapPin,
  CreditCard,
  RotateCcw,
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
  color?: string;
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

const OrderDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();

  const fetchOrderDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/orders/${params.id}`,
        { withCredentials: true }
      );
      setOrder(response.data as Order);
    } catch (error) {
      console.error("Error fetching order details:", error);
      router.push("/orders");
    } finally {
      setLoading(false);
    }
  }, [params.id, router]);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [reordering, setReordering] = useState(false);
  const [showImprintModal, setShowImprintModal] = useState<string | null>(null);

  useEffect(() => {
    if (user && params.id) {
      fetchOrderDetails();
    }
  }, [user, params.id, fetchOrderDetails]);

  const handleReorder = async () => {
    if (!order) return;

    try {
      setReordering(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/orders/${order._id}/reorder`,
        {},
        { withCredentials: true }
      );
      toast.success("Items added to cart successfully!");
      router.push("/cart");
    } catch (error) {
      console.error("Error reordering:", error);
      toast.error("Failed to add items to cart. Please try again.");
    } finally {
      setReordering(false);
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
            href="/orders"
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/orders"
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
              <button
                onClick={handleReorder}
                disabled={reordering}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 transition-colors"
              >
                {reordering ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RotateCcw className="w-4 h-4" />
                )}
                Reorder
              </button>
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
                      ) : item.imprintFiles && item.imprintFiles.length > 0 ? (
                        <div className="relative w-full h-full">
                          {item.imprintFiles.length === 1 ? (
                            <Image
                              src={item.imprintFiles[0]}
                              alt={`${item.title} - Imprint`}
                              width={64}
                              height={64}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="grid grid-cols-2 gap-0.5 w-full h-full">
                              {item.imprintFiles
                                .slice(0, 4)
                                .map((file, imgIndex) => (
                                  <Image
                                    key={imgIndex}
                                    src={file}
                                    alt={`${item.title} - Imprint ${
                                      imgIndex + 1
                                    }`}
                                    width={32}
                                    height={32}
                                    className="object-cover w-full h-full"
                                  />
                                ))}
                            </div>
                          )}
                          {item.imprintFiles.length > 4 && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <span className="text-white text-xs font-medium">
                                +{item.imprintFiles.length - 4}
                              </span>
                            </div>
                          )}
                        </div>
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
                        {item.size ? (
                          <div>
                            <span className="font-medium">Size:</span>{" "}
                            {item.size}
                          </div>
                        ) : item.sizeAndQuantity &&
                          Object.keys(item.sizeAndQuantity).length > 0 ? (
                          <div>
                            <span className="font-medium">Sizes:</span>{" "}
                            {Object.entries(item.sizeAndQuantity)
                              .filter(([, qty]) => qty > 0)
                              .map(([size, qty]) => `${size} (${qty})`)
                              .join(", ")}
                          </div>
                        ) : null}
                        {item.colorsName && (
                          <div>
                            <span className="font-medium">Color:</span>{" "}
                            {item.colorsName}
                          </div>
                        )}
                        {item.color && (
                          <div>
                            <span className="font-medium">Color Code:</span>{" "}
                            <span className="inline-flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: item.color }}
                              ></div>
                              {item.color}
                            </span>
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
                        {item.imprintLocations &&
                          item.imprintLocations.length > 0 && (
                            <div className="col-span-2">
                              <span className="font-medium">
                                Imprint Locations:
                              </span>{" "}
                              {item.imprintLocations.join(", ")}
                            </div>
                          )}
                        {item.imprintFiles && item.imprintFiles.length > 0 && (
                          <div className="col-span-2">
                            <span className="font-medium">Imprint Files:</span>{" "}
                            <button
                              onClick={() =>
                                setShowImprintModal(`${item.title}-${index}`)
                              }
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              View {item.imprintFiles.length} file
                              {item.imprintFiles.length > 1 ? "s" : ""}
                            </button>
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
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Status Timeline
              </h2>
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
                <MapPin className="w-5 h-5 text-[var(--green)]" />
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
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-[var(--green)]" />
                Shipping Information
              </h2>
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
            </div>
          </div>
        </div>
      </div>

      {/* Imprint Files Modal */}
      {showImprintModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Imprint Files
                </h3>
                <button
                  onClick={() => setShowImprintModal(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {order?.items
                  .find(
                    (item, index) =>
                      `${item.title}-${index}` === showImprintModal
                  )
                  ?.imprintFiles?.map((file, fileIndex) => (
                    <div
                      key={fileIndex}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <Image
                        src={file}
                        alt={`Imprint File ${fileIndex + 1}`}
                        width={300}
                        height={300}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-3">
                        <p className="text-sm text-gray-600">
                          File {fileIndex + 1}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;
