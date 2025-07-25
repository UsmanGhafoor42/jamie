"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// Set NEXT_PUBLIC_API_URL in your .env file, e.g.
// NEXT_PUBLIC_API_URL=http://localhost:5000/api

type AxiosErrorLike = {
  response?: { data?: { message?: string } };
  message?: string;
};

const Page = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!API_URL) {
      setError(
        "API URL is not set. Please set NEXT_PUBLIC_API_URL in your .env file."
      );
      setLoading(false);
      return;
    }
    try {
      await axios.post(`${API_URL}/auth/register`, form, {
        withCredentials: true, // send cookies if backend uses them
      });
      router.push("/auth/login");
    } catch (error: unknown) {
      const err = error as AxiosErrorLike;
      setError(
        err.response?.data?.message ||
          err.message ||
          "Register failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-50 font-poppins">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <Link href="/">
          <Image
            src="/icons/secondary-logo.png"
            alt="logo"
            width={152}
            height={69}
          />
        </Link>
        <h2 className="text-2xl font-bold my-6 text-center uppercase">
          Register
        </h2>
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="fullname" className="block text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="fullname"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 "
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 "
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[var(--green)] text-white py-2 rounded font-poppins transition-colors disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Register ..." : "Register"}
        </button>
        <h4 className="text-sm font-poppins text-right mt-4">
          Already have an account{" "}
          <Link
            className="font-bold text-[var(--green))] uppercase"
            href={"/auth/login"}
          >
            Login now
          </Link>
        </h4>
      </form>
    </section>
  );
};

export default Page;
