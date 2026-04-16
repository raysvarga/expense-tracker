"use client";

import { useState } from "react";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  function toTitleCase(text: string) {
    return text
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const handleLogin = () => {
    if (!name) return alert("Isi nama dulu");

    if (loading) return;

    setLoading(true);

    const formattedName = toTitleCase(name);

    setTimeout(() => {
      localStorage.setItem("user_name", formattedName);
      window.location.href = "/dashboard";
    }, 500);
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
          placeholder="Nama Panggilan (pakai huruf kecil aja ya :v)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          className="w-full border border-gray-500 rounded-lg p-3 mb-4 
                     placeholder-gray-700 bg-white text-gray-900 font-medium
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold transition text-white
            ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading ? "Masuk..." : "Masuk"}
        </button>

      </div>
    </main>
  );
}