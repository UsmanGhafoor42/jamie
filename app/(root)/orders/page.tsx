"use client";
import DtfButton from "@/components/custom/DtfButton";
import React, { useState } from "react";
import Image from "next/image";

const ORDERS_PER_PAGE = 5;

const dummyOrders = [
  {
    id: 1623,
    date: "13-3-2025",
    status: "Pre Production",
    shipped: false,
    items: [
      {
        name: "Design",
        quantity: 20,
        cost: 175,
        image: "/images/product-image.png",
      },
      {
        name: "Design",
        quantity: 20,
        cost: 175,
        image: "/images/product-image.png",
      },
    ],
    shipping: 0,
    total: 175,
    tracking: "Add On",
    via: "",
  },
  {
    id: 1623,
    date: "13-3-2025",
    status: "Shipped",
    shipped: true,
    items: [
      {
        name: "Design",
        quantity: 20,
        cost: 175,
        image: "/images/product-image.png",
      },
      {
        name: "Design",
        quantity: 20,
        cost: 175,
        image: "/images/product-image.png",
      },
    ],
    shipping: 0,
    total: 175,
    tracking: "1296746584",
    via: "UPS",
  },
  {
    id: 1623,
    date: "13-3-2025",
    status: "Shipped",
    shipped: true,
    items: [
      {
        name: "Design",
        quantity: 20,
        cost: 175,
        image: "/images/product-image.png",
      },
      {
        name: "Design",
        quantity: 20,
        cost: 175,
        image: "/images/product-image.png",
      },
    ],
    shipping: 0,
    total: 175,
    tracking: "1296746584",
    via: "UPS",
  },
  {
    id: 1623,
    date: "13-3-2025",
    status: "Shipped",
    shipped: true,
    items: [
      {
        name: "Design",
        quantity: 20,
        cost: 175,
        image: "/images/product-image.png",
      },
      {
        name: "Design",
        quantity: 20,
        cost: 175,
        image: "/images/product-image.png",
      },
    ],
    shipping: 0,
    total: 175,
    tracking: "1296746584",
    via: "UPS",
  },
  {
    id: 1623,
    date: "13-3-2025",
    status: "Shipped",
    shipped: true,
    items: [
      {
        name: "Design",
        quantity: 20,
        cost: 175,
        image: "/images/product-image.png",
      },
      {
        name: "Design",
        quantity: 20,
        cost: 175,
        image: "/images/product-image.png",
      },
    ],
    shipping: 0,
    total: 175,
    tracking: "1296746584",
    via: "UPS",
  },
  {
    id: 1623,
    date: "13-3-2025",
    status: "Shipped",
    shipped: true,
    items: [
      {
        name: "Design",
        quantity: 20,
        cost: 175,
        image: "/images/product-image.png",
      },
      {
        name: "Design",
        quantity: 20,
        cost: 175,
        image: "/images/product-image.png",
      },
    ],
    shipping: 0,
    total: 175,
    tracking: "1296746584",
    via: "UPS",
  },
  {
    id: 1623,
    date: "13-3-2025",
    status: "Shipped",
    shipped: true,
    items: [
      {
        name: "Design",
        quantity: 20,
        cost: 175,
        image: "/images/product-image.png",
      },
      {
        name: "Design",
        quantity: 20,
        cost: 175,
        image: "/images/product-image.png",
      },
    ],
    shipping: 0,
    total: 175,
    tracking: "1296746584",
    via: "UPS",
  },
  {
    id: 1623,
    date: "13-3-2025",
    status: "Shipped",
    shipped: true,
    items: [
      {
        name: "Design",
        quantity: 20,
        cost: 175,
        image: "/images/product-image.png",
      },
      {
        name: "Design",
        quantity: 20,
        cost: 175,
        image: "/images/product-image.png",
      },
    ],
    shipping: 0,
    total: 175,
    tracking: "1296746584",
    via: "UPS",
  },
  {
    id: 1623,
    date: "13-3-2025",
    status: "Shipped",
    shipped: true,
    items: [
      {
        name: "Design",
        quantity: 20,
        cost: 175,
        image: "/images/product-image.png",
      },
      {
        name: "Design",
        quantity: 20,
        cost: 175,
        image: "/images/product-image.png",
      },
    ],
    shipping: 0,
    total: 175,
    tracking: "1296746584",
    via: "UPS",
  },
  // ...repeat or add more dummy orders for pagination demo
  {
    id: 1623,
    date: "13-3-2025",
    status: "Pre Production",
    shipped: false,
    items: [
      {
        name: "Design",
        quantity: 20,
        cost: 175,
        image: "/images/product-image.png",
      },
      {
        name: "Design",
        quantity: 20,
        cost: 175,
        image: "/images/product-image.png",
      },
    ],
    shipping: 0,
    total: 175,
    tracking: "1296746584",
    via: "UPS",
  },
  {
    id: 1623,
    date: "13-3-2025",
    status: "Shipped",
    shipped: true,
    items: [
      {
        name: "Design",
        quantity: 20,
        cost: 175,
        image: "/images/product-image.png",
      },
      {
        name: "Design",
        quantity: 20,
        cost: 175,
        image: "/images/product-image.png",
      },
    ],
    shipping: 0,
    total: 175,
    tracking: "Add On",
    via: "",
  },
  {
    id: 1623,
    date: "13-3-2025",
    status: "Pre Production",
    shipped: false,
    items: [
      {
        name: "Design",
        quantity: 20,
        cost: 175,
        image: "/images/product-image.png",
      },
      {
        name: "Design",
        quantity: 20,
        cost: 175,
        image: "/images/product-image.png",
      },
    ],
    shipping: 0,
    total: 175,
    tracking: "1296746584",
    via: "UPS",
  },
];

const OrderHistoryTable = () => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(dummyOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = dummyOrders.slice(
    (page - 1) * ORDERS_PER_PAGE,
    page * ORDERS_PER_PAGE
  );

  return (
    <div className="w-full bg-white rounded-xl shadow p-4 mt-12 overflow-x-auto">
      <h2 className="text-2xl font-bold text-center mb-6">
        Your Order History
      </h2>
      <table className="w-full min-w-[900px] text-sm">
        <thead>
          <tr className="border-b text-gray-700">
            <th className="py-3 px-2 font-semibold">Date</th>
            <th className="py-3 px-2 font-semibold">Status</th>
            <th className="py-3 px-2 font-semibold">Items</th>
            <th className="py-3 px-2 font-semibold">Shipping</th>
            <th className="py-3 px-2 font-semibold">Total</th>
            <th className="py-3 px-2 font-semibold">Via/Tracking</th>
          </tr>
        </thead>
        <tbody>
          {paginatedOrders.map((order, idx) => (
            <tr key={idx} className="border-b align-top">
              <td className="py-4 px-2 text-[var(--green)] font-semibold text-center">
                {order.id}
                <div className="text-black font-normal text-xs mt-1">
                  {order.date}
                </div>
              </td>
              <td className="py-4 px-2 text-center">
                <span className="flex items-center gap-2 justify-center">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      order.shipped ? "bg-green-500" : "bg-yellow-400"
                    }`}
                  ></span>
                  <span className="font-medium">{order.status}</span>
                </span>
              </td>
              <td className="py-4 px-2">
                <div className="flex flex-col gap-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={32}
                        height={32}
                        className="rounded"
                      />
                      <span className="text-[var(--green)] font-semibold">
                        {item.name}
                      </span>
                      <span className="ml-2 text-gray-700">Quantity</span>
                      <span className="font-semibold">{item.quantity}</span>
                      <span className="ml-2 text-gray-700">Cost</span>
                      <span className="font-semibold">${item.cost}</span>
                    </div>
                  ))}
                </div>
              </td>
              <td className="py-4 px-2 text-center">
                ${order.shipping.toFixed(2)}
              </td>
              <td className="py-4 px-2 text-center font-bold">
                ${order.total}
              </td>
              <td className="py-4 px-2 text-center">
                <div>{order.via ? order.via : ""}</div>
                <div className="text-xs text-gray-500">{order.tracking}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            className="px-3 py-1 rounded border border-gray-300 bg-gray-100 text-gray-700 disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="mx-2">
            Page {page} of {totalPages}
          </span>
          <button
            className="px-3 py-1 rounded border border-gray-300 bg-gray-100 text-gray-700 disabled:opacity-50"
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

const page = () => {
  return (
    <div className="layout">
      <div className="flex flex-col justify-center items-center gap-10">
        <h1 className="text-4xl font-bold">Want To Place New Order</h1>
        <div className="flex flex-col md:flex-row gap-10">
          <DtfButton
            title="Gang Sheet DTF"
            url="/gang-sheet-builder"
            className="px-12 py-6 w-fit  text-xl"
          />
          <DtfButton
            title="Individual Sheet DTF"
            url="/individual-sheet-builder"
            className="px-12 py-6 w-fit  text-xl"
          />
          <DtfButton
            title="UV Stickers DTF"
            url="/uv-stickers"
            className="px-12 py-6 w-fit  text-xl"
          />
        </div>
      </div>
      <OrderHistoryTable />
    </div>
  );
};

export default page;
