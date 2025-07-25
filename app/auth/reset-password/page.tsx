"use client";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense, useState } from "react";
// If you haven't installed axios, run: npm install axios
import axios from "axios";
import { useSearchParams } from "next/navigation";

// Set NEXT_PUBLIC_API_URL in your .env file, e.g.
// NEXT_PUBLIC_API_URL=http://localhost:5000/api

type AxiosErrorLike = {
  isAxiosError?: boolean;
  message?: string;
  response?: { data?: { message?: string } };
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

// Move your actual page logic into a separate component:
function ResetPasswordContent() {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // Get API URL from env
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
      await axios.post(`${API_URL}/auth/reset-password`, {
        token,
        newPassword,
      });
      setSuccess(true);
    } catch (error: unknown) {
      const err = error as AxiosErrorLike;
      if (err.isAxiosError) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Something went wrong. Please try again."
        );
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
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
        {success ? (
          <div className="text-center mt-8">
            <h2 className="text-2xl font-bold mb-4">
              Password Reset Successful
            </h2>
            <p>
              Your password has been updated. You can now{" "}
              <Link
                href="/auth/login"
                className="text-[var(--green)] underline"
              >
                login
              </Link>{" "}
              with your new password.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold my-6 text-center">
              Reset Password
            </h2>
            <p className="mb-4 text-center">
              Please enter your new password below. This link was sent to your
              email.
            </p>
            {error && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-4 mt-4">
                <label
                  htmlFor="newPassword"
                  className="block text-gray-700 mb-2"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2"
                  required
                  minLength={6}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[var(--green)] text-white py-2 rounded font-poppins transition-colors disabled:opacity-60"
                disabled={loading || !token}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
            {!token && (
              <div className="text-red-600 text-center mt-4">
                Invalid or missing token.
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
