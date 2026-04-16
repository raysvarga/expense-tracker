"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [name, setName] = useState("");
  const [nominal, setNominal] = useState("");
  const [kategori, setKategori] = useState("");
  const [catatan, setCatatan] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  function toTitleCase(text: string) {
    return text
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  useEffect(() => {
    const user = localStorage.getItem("user_name");
    if (!user) {
      window.location.href = "/login";
      return;
    }

    setName(user);
    fetchData(user);
  }, []);

  const fetchData = async (user: string) => {
    const res = await fetch(`https://script.google.com/macros/s/AKfycbzjVj0uhavMQEzLIc-pcXu9txaCKCsYLB7vZqmXvs_CjS-_pvPrGB09KbFcxe-QNffbwg/exec?user_id=${user}`);
    const result = await res.json();

    const formatted = result.map((item: any) => ({
      id: Date.now() + Math.random(),
      nominal: Number(item.nominal),
      kategori: toTitleCase(item.kategori),
      catatan: toTitleCase(item.catatan || ""),
    }));

    setData(formatted);
  };

  const handleAdd = async () => {
    if (!nominal || !kategori) {
      alert("Isi nominal & kategori");
      return;
    }

    if (loading) return;

    setLoading(true);

    const user = localStorage.getItem("user_name");

    const payload = {
      user_id: user,
      nominal: Number(nominal),
      kategori: toTitleCase(kategori),
      catatan: toTitleCase(catatan),
    };

    try {
      await fetch("https://script.google.com/macros/s/AKfycbzjVj0uhavMQEzLIc-pcXu9txaCKCsYLB7vZqmXvs_CjS-_pvPrGB09KbFcxe-QNffbwg/exec", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      await fetchData(user as string);

      setNominal("");
      setKategori("");
      setCatatan("");

      alert("Berhasil ditambahkan");
    } catch (e) {
      alert("Gagal menyimpan");
    }

    setLoading(false);
  };

  const total = data.reduce((sum, item) => sum + item.nominal, 0);

  const getCategoryStyle = (kategori: string) => {
    switch (kategori) {
      case "Makanan":
        return { bg: "bg-green-100", text: "text-green-700", color: "#22c55e", icon: "🍔" };
      case "Transport":
        return { bg: "bg-blue-100", text: "text-blue-700", color: "#3b82f6", icon: "🚗" };
      case "Belanja":
        return { bg: "bg-purple-100", text: "text-purple-700", color: "#a855f7", icon: "🛍️" };
      case "Tagihan":
        return { bg: "bg-red-100", text: "text-red-700", color: "#ef4444", icon: "💡" };
      case "Hiburan":
        return { bg: "bg-yellow-100", text: "text-yellow-700", color: "#eab308", icon: "🎮" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-700", color: "#6b7280", icon: "📦" };
    }
  };

  const grouped = Object.values(
    data.reduce((acc: any, item) => {
      if (!acc[item.kategori]) {
        acc[item.kategori] = { name: item.kategori, value: 0 };
      }
      acc[item.kategori].value += item.nominal;
      return acc;
    }, {})
  );

  return (
    <main className="min-h-screen bg-gray-200 p-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6">

        <h1 className="text-2xl font-bold mb-2 text-gray-900">Dashboard</h1>
        <p className="mb-4 text-gray-700">Halo, {name} 👋</p>

        <div className="border-t border-gray-300 pt-4">
          <h2 className="font-semibold mb-2 text-gray-800">Tambah Pengeluaran</h2>

          <input
            type="number"
            placeholder="Rp 0"
            value={nominal}
            onChange={(e) => setNominal(e.target.value)}
            className="w-full border border-gray-500 rounded-lg p-2 mb-2 
                       placeholder-gray-700 bg-white text-gray-900 font-medium
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="w-full border border-gray-500 rounded-lg p-2 mb-2 
                       bg-white text-gray-900 font-medium
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Pilih Kategori</option>
            <option value="makanan">Makanan</option>
            <option value="transport">Transport</option>
            <option value="belanja">Belanja</option>
            <option value="tagihan">Tagihan</option>
            <option value="hiburan">Hiburan</option>
            <option value="lainnya">Lainnya</option>
          </select>

          <input
            type="text"
            placeholder="Catatan"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            className="w-full border border-gray-500 rounded-lg p-2 mb-3 
                       placeholder-gray-700 bg-white text-gray-900 font-medium
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleAdd}
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold transition text-white
              ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? "Menyimpan..." : "Tambah"}
          </button>
        </div>

        <div className="border-t border-gray-300 mt-6 pt-4">
          <h2 className="font-semibold mb-2 text-gray-900">
            Total: Rp {total.toLocaleString()}
          </h2>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={grouped}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                >
                  {grouped.map((entry: any, index) => {
                    const style = getCategoryStyle(entry.name);
                    return <Cell key={index} fill={style.color} />;
                  })}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <h3 className="text-sm text-gray-600 mb-2 mt-4">List Pengeluaran</h3>

          <div className="space-y-2">
            {data.map((item) => {
              const style = getCategoryStyle(item.kategori);

              return (
                <div
                  key={item.id}
                  className={`flex justify-between p-3 rounded-lg border ${style.bg}`}
                >
                  <div>
                    <p className={`font-semibold ${style.text}`}>
                      {style.icon} {item.kategori}
                    </p>
                    <p className="text-xs text-gray-700">{item.catatan}</p>
                  </div>
                  <p className="font-bold text-gray-900">
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