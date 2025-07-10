'use client'
import React, { useState } from 'react'

const page = () => {
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log(form);
  };

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-50 font-poppins">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <div className="mb-4">
          <label htmlFor="fullname" className="block text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            id="fullname"
            name="fullname"
            value={form.fullname}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
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
          <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
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
          className="w-full bg-[var(--green)] text-white py-2 rounded font-poppins transition-colors"
        >
          Login
        </button>
      </form>
    </section>
  );
}

export default page