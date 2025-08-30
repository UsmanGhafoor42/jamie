"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../../hooks/useAuth";
import axios from "axios";
import { Loader2, CreditCard, Truck, Shield, CheckCircle } from "lucide-react";
import Image from "next/image";

interface CartItem {
  _id: string;
  title: string;
  total: number;
  quantity: number;
  imageUrl?: string;
  stikersImgeUrl?: string[];
  size?: string;
  sizeAndQuantity?: Record<string, number>;
  colorsName?: string;
  options?: string[];
  orderNotes?: string;
}

interface CheckoutForm {
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  shippingInfo: {
    method: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  paymentData: {
    cardNumber: string;
    expirationDate: string;
    cvv: string;
    cardholderName: string;
  };
}

const SHIPPING_METHODS = [
  {
    id: "standard",
    name: "Standard Shipping",
    price: 0,
    days: "5-7 business days",
  },
  {
    id: "express",
    name: "Express Shipping",
    price: 15,
    days: "2-3 business days",
  },
  { id: "overnight", name: "Overnight", price: 25, days: "1 business day" },
];

const CheckoutPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [form, setForm] = useState<CheckoutForm>({
    customerInfo: {
      firstName: "",
      lastName: "",
      email: user?.email || "",
      phone: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "US",
      },
    },
    shippingInfo: {
      method: "standard",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "US",
      },
    },
    paymentData: {
      cardNumber: "",
      expirationDate: "",
      cvv: "",
      cardholderName: "",
    },
  });

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/mine`,
        { withCredentials: true }
      );
      setCart(response.data as CartItem[]);
    } catch (error) {
      console.error("Error fetching cart:", error);
      router.push("/cart");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    section: keyof CheckoutForm,
    field: string,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleAddressChange = (
    section: "customerInfo" | "shippingInfo",
    field: string,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        address: {
          ...prev[section].address,
          [field]: value,
        },
      },
    }));
  };

  const handleShippingMethodChange = (method: string) => {
    setForm((prev) => ({
      ...prev,
      shippingInfo: { ...prev.shippingInfo, method },
    }));
  };

  const validateForm = (): boolean => {
    const { customerInfo, shippingInfo, paymentData } = form;

    // Basic validation
    if (
      !customerInfo.firstName ||
      !customerInfo.lastName ||
      !customerInfo.email
    ) {
      alert("Please fill in all required customer information");
      return false;
    }

    if (
      !customerInfo.address.street ||
      !customerInfo.address.city ||
      !customerInfo.address.state ||
      !customerInfo.address.zipCode
    ) {
      alert("Please fill in all required address information");
      return false;
    }

    if (
      !paymentData.cardNumber ||
      !paymentData.expirationDate ||
      !paymentData.cvv ||
      !paymentData.cardholderName
    ) {
      alert("Please fill in all required payment information");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setProcessing(true);

    try {
      const selectedShipping = SHIPPING_METHODS.find(
        (method) => method.id === form.shippingInfo.method
      );

      const pricing = {
        subtotal: cart.reduce((sum, item) => sum + item.total, 0),
        tax: 0, // You can add tax calculation logic
        shipping: selectedShipping?.price || 0,
        discount: 0, // You can add discount logic
        total:
          cart.reduce((sum, item) => sum + item.total, 0) +
          (selectedShipping?.price || 0),
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/process`,
        {
          paymentData: form.paymentData,
          customerInfo: form.customerInfo,
          shippingInfo: {
            method: selectedShipping?.name || "Standard Shipping",
            address: form.shippingInfo.address,
          },
          cartItems: cart,
          pricing,
        },
        { withCredentials: true }
      );

      // Check if the response contains order data (successful order creation)
      const responseData = response.data as any;
      if (responseData.order && responseData.order.orderNumber) {
        alert(
          "Order placed successfully! Order ID: " +
            responseData.order.orderNumber
        );
        router.push("/orders");
      } else {
        // Handle case where order creation failed
        alert("Order creation failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      alert(
        error.response?.data?.message || "Checkout failed. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--green)]" />
      </div>
    );
  }

  if (cart.length === 0) {
    router.push("/cart");
    return null;
  }

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const selectedShipping = SHIPPING_METHODS.find(
    (method) => method.id === form.shippingInfo.method
  );
  const shippingCost = selectedShipping?.price || 0;
  const total = subtotal + shippingCost;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your order securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[var(--green)]" />
                Customer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={form.customerInfo.firstName}
                    onChange={(e) =>
                      handleInputChange(
                        "customerInfo",
                        "firstName",
                        e.target.value
                      )
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={form.customerInfo.lastName}
                    onChange={(e) =>
                      handleInputChange(
                        "customerInfo",
                        "lastName",
                        e.target.value
                      )
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={form.customerInfo.email}
                    onChange={(e) =>
                      handleInputChange("customerInfo", "email", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={form.customerInfo.phone}
                    onChange={(e) =>
                      handleInputChange("customerInfo", "phone", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
                  />
                </div>
              </div>

              {/* Billing Address */}
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Billing Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={form.customerInfo.address.street}
                      onChange={(e) =>
                        handleAddressChange(
                          "customerInfo",
                          "street",
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={form.customerInfo.address.city}
                      onChange={(e) =>
                        handleAddressChange(
                          "customerInfo",
                          "city",
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      value={form.customerInfo.address.state}
                      onChange={(e) =>
                        handleAddressChange(
                          "customerInfo",
                          "state",
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      value={form.customerInfo.address.zipCode}
                      onChange={(e) =>
                        handleAddressChange(
                          "customerInfo",
                          "zipCode",
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <select
                      value={form.customerInfo.address.country}
                      onChange={(e) =>
                        handleAddressChange(
                          "customerInfo",
                          "country",
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-[var(--green)]" />
                Shipping Information
              </h2>

              {/* Shipping Methods */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Shipping Method
                </h3>
                <div className="space-y-3">
                  {SHIPPING_METHODS.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        form.shippingInfo.method === method.id
                          ? "border-[var(--green)] bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={method.id}
                        checked={form.shippingInfo.method === method.id}
                        onChange={() => handleShippingMethodChange(method.id)}
                        className="mr-3 text-[var(--green)] focus:ring-[var(--green)]"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {method.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {method.days}
                        </div>
                      </div>
                      <div className="font-semibold text-gray-900">
                        {method.price === 0
                          ? "Free"
                          : `$${method.price.toFixed(2)}`}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Shipping Address
                </h3>
                <label className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    checked={true}
                    className="mr-2 text-[var(--green)] focus:ring-[var(--green)]"
                    readOnly
                  />
                  <span className="text-sm text-gray-600">
                    Same as billing address
                  </span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={form.shippingInfo.address.street}
                      onChange={(e) =>
                        handleAddressChange(
                          "shippingInfo",
                          "street",
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={form.shippingInfo.address.city}
                      onChange={(e) =>
                        handleAddressChange(
                          "shippingInfo",
                          "city",
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      value={form.shippingInfo.address.state}
                      onChange={(e) =>
                        handleAddressChange(
                          "shippingInfo",
                          "state",
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      value={form.shippingInfo.address.zipCode}
                      onChange={(e) =>
                        handleAddressChange(
                          "shippingInfo",
                          "zipCode",
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <select
                      value={form.shippingInfo.address.country}
                      onChange={(e) =>
                        handleAddressChange(
                          "shippingInfo",
                          "country",
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[var(--green)]" />
                Payment Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cardholder Name *
                  </label>
                  <input
                    type="text"
                    value={form.paymentData.cardholderName}
                    onChange={(e) =>
                      handleInputChange(
                        "paymentData",
                        "cardholderName",
                        e.target.value
                      )
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
                    placeholder="Name on card"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    value={form.paymentData.cardNumber}
                    onChange={(e) =>
                      handleInputChange(
                        "paymentData",
                        "cardNumber",
                        e.target.value
                      )
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiration Date *
                  </label>
                  <input
                    type="text"
                    value={form.paymentData.expirationDate}
                    onChange={(e) =>
                      handleInputChange(
                        "paymentData",
                        "expirationDate",
                        e.target.value
                      )
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV *
                  </label>
                  <input
                    type="text"
                    value={form.paymentData.cvv}
                    onChange={(e) =>
                      handleInputChange("paymentData", "cvv", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
                    placeholder="123"
                    maxLength={4}
                    required
                  />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                Your payment information is secure and encrypted
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-6">
                {cart.map((item) => (
                  <div key={item._id} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      ) : item.stikersImgeUrl &&
                        item.stikersImgeUrl.length > 0 ? (
                        <Image
                          src={item.stikersImgeUrl[0]}
                          alt={item.title}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      ${item.total.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    {shippingCost === 0
                      ? "Free"
                      : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-[var(--green)]">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handleSubmit}
                disabled={processing}
                className="w-full bg-[var(--green)] hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </div>
                ) : (
                  `Place Order - $${total.toFixed(2)}`
                )}
              </button>

              <div className="mt-4 text-xs text-gray-500 text-center">
                By placing your order, you agree to our terms and conditions
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
