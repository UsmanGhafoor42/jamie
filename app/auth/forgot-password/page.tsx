"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";

// Set NEXT_PUBLIC_API_URL in your .env file, e.g.
// NEXT_PUBLIC_API_URL=http://localhost:5000/api

type AxiosErrorLike = {
  response?: { data?: { message?: string } };
  message?: string;
};

const Page = () => {
  const [form, setForm] = useState({
    email: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      await axios.post(`${API_URL}/auth/forgot-password`, form);
      setSubmitted(true);
    } catch (error: unknown) {
      const err = error as AxiosErrorLike;
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to send reset email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-50 font-poppins">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <Link href="/">
          <Image
            src="/icons/secondary-logo.png"
            alt="logo"
            width={152}
            height={69}
          />
        </Link>
        {submitted ? (
          <div className="text-center mt-8">
            <h2 className="text-2xl font-bold mb-4">Check your email</h2>
            <p>
              If an account with that email exists, you’ll receive a link to
              reset your password.
              <br />
              Please check your inbox and follow the instructions.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold my-6 text-center">
              Forgot Password
            </h2>
            <p>
              Don’t worry! It happens. Please enter the email associated with
              your account, then check your email for verification.
            </p>
            {error && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-4 mt-4">
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
              <button
                type="submit"
                className="w-full bg-[var(--green)] text-white py-2 rounded font-poppins transition-colors disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
};

export default Page;
