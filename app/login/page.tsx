"use client";

import { useState } from "react";

export default function LoginPage() {
  const [name, setName] = useState("");

  const handleLogin = () => {
    if (!name) return alert("Isi nama dulu");

    localStorage.setItem("user_name", name);
    window.location.href = "/dashboard";
  };

  return (
    <main className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">

        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Expense Tracker by Rays
        </h1>

        <p className="text-gray-600 text-sm mb-6 text-center">
          Masuk untuk mulai mencatat pengeluaran
        </p>

        <input
          type="text"
          placeholder="Nama Kamu"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-500 rounded-lg p-3 mb-4 
                     placeholder-gray-700 bg-white text-gray-900 font-medium
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
        >
          Masuk
        </button>

      </div>
    </main>
  );
}