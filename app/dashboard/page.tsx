"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const [name, setName] = useState("");
  const [nominal, setNominal] = useState("");
  const [kategori, setKategori] = useState("");
  const [catatan, setCatatan] = useState("");
  const [type, setType] = useState("expense");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState("");
  const [mode, setMode] = useState("monthly");

  function toTitleCase(text: string) {
    return text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  useEffect(() => {
    const user = localStorage.getItem("user_name");
    if (!user) {
      window.location.href = "/login";
      return;
    }

    setName(user);
    const now = new Date();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    setMonth(m);
    fetchData(user);
  }, []);

  const fetchData = async (user: string) => {
    const res = await fetch(
      `https://script.google.com/macros/s/AKfycbwI0bBz4oOXEYLSY0tx-aUDA4N13VYgzzPnDW7jY0m27Q4EEjXRtIx3VvwOVmhTaBjghg/exec?user_id=${user}`
    );
    const result = await res.json();

    const formatted = result.map((item: any) => {
      const d = new Date(item.tanggal);
      return {
        id: Date.now() + Math.random(),
        nominal: Number(item.nominal),
        kategori: toTitleCase(item.kategori),
        catatan: toTitleCase(item.catatan || ""),
        type: item.type || "expense",
        month: String(d.getMonth() + 1).padStart(2, "0"),
      };
    });

    setData(formatted);
  };

  const handleAdd = async () => {
    if (!nominal || !kategori) return alert("Isi nominal & kategori");
    if (loading) return;

    setLoading(true);

    const user = localStorage.getItem("user_name");

    const payload = {
      user_id: user,
      nominal: Number(nominal),
      kategori: toTitleCase(kategori),
      catatan: toTitleCase(catatan),
      type: type,
    };

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbwI0bBz4oOXEYLSY0tx-aUDA4N13VYgzzPnDW7jY0m27Q4EEjXRtIx3VvwOVmhTaBjghg/exec",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      await fetchData(user as string);

      setNominal("");
      setKategori("");
      setCatatan("");
    } catch (e) {
      alert("Gagal menyimpan");
    }

    setLoading(false);
  };

  const monthlyData = data.filter((item) => item.month === month);
  const filtered = mode === "monthly" ? monthlyData : data;

  const totalIncome = filtered
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.nominal, 0);

  const totalExpense = filtered
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.nominal, 0);

  const balance = totalIncome - totalExpense;

  const getCategoryStyle = (kategori: string) => {
    switch (kategori) {
      case "Makanan":
        return { color: "#22c55e", icon: "🍔" };
      case "Transport":
        return { color: "#3b82f6", icon: "🚗" };
      case "Belanja":
        return { color: "#a855f7", icon: "🛍️" };
      case "Tagihan":
        return { color: "#ef4444", icon: "💡" };
      case "Hiburan":
        return { color: "#eab308", icon: "🎮" };
      case "Gaji":
        return { color: "#10b981", icon: "💼" };
      case "Budget":
        return { color: "#0e1421", icon: "💰" };
      case "Bonus":
        return { color: "#06b6d4", icon: "🎁" };
      case "Freelance":
        return { color: "#6366f1", icon: "🧑‍💻" };
      default:
        return { color: "#6b7280", icon: "📦" };
    }
  };

  const groupedExpense = Object.values(
    filtered
      .filter((item) => item.type === "expense")
      .reduce((acc: any, item) => {
        if (!acc[item.kategori]) {
          acc[item.kategori] = { name: item.kategori, value: 0 };
        }
        acc[item.kategori].value += item.nominal;
        return acc;
      }, {})
  );

  const incomeVsExpense = [
    { name: "Income", value: totalIncome },
    { name: "Expense", value: totalExpense },
  ];

  return (
    <main className="min-h-screen bg-gray-100 p-4 text-gray-900">
      <div className="max-w-md mx-auto space-y-4">

        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl p-5 shadow-xl">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm opacity-90">
              {mode === "monthly" ? "Saldo Bulan Ini" : "Total Saldo"}
            </p>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="text-xs bg-white text-gray-900 rounded px-2 py-1"
            >
              <option value="monthly">Bulanan</option>
              <option value="all">Semua</option>
            </select>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Rp {balance.toLocaleString()}
          </h1>
          <div className="flex justify-between mt-3 text-sm">
            <span className="text-green-200">
              + {totalIncome.toLocaleString()}
            </span>
            <span className="text-red-200">
              - {totalExpense.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-200">
          <h2 className="font-semibold mb-2">Tambah Transaksi</h2>

          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setKategori("");
            }}
            className="w-full border border-gray-300 rounded-lg p-2 mb-2 bg-white text-gray-900"
          >
            <option value="expense">Pengeluaran</option>
            <option value="income">Pemasukan</option>
          </select>

          <input
            type="number"
            placeholder="Rp 0"
            value={nominal}
            onChange={(e) => setNominal(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 mb-2 bg-white text-gray-900 placeholder-gray-500"
          />

          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 mb-2 bg-white text-gray-900"
          >
            <option value="">Pilih Kategori</option>

            {type === "expense" ? (
              <>
                <option value="makanan">Makanan</option>
                <option value="transport">Transport</option>
                <option value="belanja">Belanja</option>
                <option value="tagihan">Tagihan</option>
                <option value="hiburan">Hiburan</option>
                <option value="lainnya">Lainnya</option>
              </>
            ) : (
              <>
                <option value="gaji">Gaji</option>
                <option value="bonus">Bonus</option>
                <option value="freelance">Freelance</option>
                <option value="bisnis">Bisnis</option>
                <option value="budget">Budget</option>
                <option value="lainnya">Lainnya</option>
              </>
            )}
          </select>

          <input
            type="text"
            placeholder="Catatan"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 mb-3 bg-white text-gray-900 placeholder-gray-500"
          />

          <button
            onClick={handleAdd}
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Menyimpan..." : "Tambah"}
          </button>
        </div>

        {mode === "monthly" && (
          <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-200">
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 mb-4"
            >
              <option value="01">Januari</option>
              <option value="02">Februari</option>
              <option value="03">Maret</option>
              <option value="04">April</option>
              <option value="05">Mei</option>
              <option value="06">Juni</option>
              <option value="07">Juli</option>
              <option value="08">Agustus</option>
              <option value="09">September</option>
              <option value="10">Oktober</option>
              <option value="11">November</option>
              <option value="12">Desember</option>
            </select>

            <div className="h-52 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeVsExpense}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={groupedExpense} dataKey="value" nameKey="name" outerRadius={80}>
                    {groupedExpense.map((entry: any, index) => {
                      const style = getCategoryStyle(entry.name);
                      return <Cell key={index} fill={style.color} />;
                    })}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-200">
          <div className="space-y-2">
            {filtered.map((item) => {
              const style = getCategoryStyle(item.kategori);
              return (
                <div key={item.id} className="flex justify-between bg-gray-100 p-3 rounded-lg">
                  <div>
                    <p className="font-semibold">
                      {style.icon} {item.kategori}
                    </p>
                    <p className="text-xs text-gray-600">{item.catatan}</p>
                  </div>
                  <p className={`font-bold ${item.type === "income" ? "text-green-600" : "text-red-600"}`}>
                    Rp {item.nominal.toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </main>
  );
}