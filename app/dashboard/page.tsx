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

const URL = "https://script.google.com/macros/s/AKfycbx4kqVF7EbAya4mbI8yp_3-lq6ZDu78sUuayhrikITytL1nE_wDF3Mq2waVMN16gtpJ5Q/exec";

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
    const [editItem, setEditItem] = useState<any>(null);

    function toTitleCase(text: string) {
        return text
            .toLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }

    function formatNumber(value: string) {
        const number = value.replace(/\D/g, "");
        return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    function parseNumber(value: string) {
        return Number(value.replace(/\./g, ""));
    }

    useEffect(() => {
        const user = localStorage.getItem("user_name");
        if (!user) {
            window.location.href = "/login";
            return;
        }

        setName(user);
        const now = new Date();
        setMonth(String(now.getMonth() + 1).padStart(2, "0"));
        fetchData(user);
    }, []);

    const fetchData = async (user: string) => {
        const res = await fetch(`${URL}?user_id=${user}`);
        const result = await res.json();

        const formatted = result.map((item: any) => {
            const d = new Date(item.tanggal);
            return {
                id: item.id,
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

        await fetch(URL, {
            method: "POST",
            body: JSON.stringify({
                user_id: user,
                nominal: parseNumber(nominal),
                kategori: toTitleCase(kategori),
                catatan: toTitleCase(catatan),
                type: type,
            }),
        });

        await fetchData(user as string);

        setNominal("");
        setKategori("");
        setCatatan("");
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Hapus transaksi?")) return;

        await fetch(URL, {
            method: "POST",
            body: JSON.stringify({
                action: "delete",
                id: id,
            }),
        });

        setData((prev) => prev.filter((item) => item.id !== id));
    };

    const handleUpdate = async () => {
        if (!editItem.nominal || !editItem.kategori) return;

        await fetch(URL, {
            method: "POST",
            body: JSON.stringify({
                action: "update",
                id: editItem.id,
                nominal: parseNumber(editItem.nominal),
                kategori: editItem.kategori,
                catatan: editItem.catatan,
                type: editItem.type,
            }),
        });

        await fetchData(localStorage.getItem("user_name") as string);
        setEditItem(null);
    };

    const logout = () => {
        localStorage.removeItem("user_name");
        window.location.href = "/login";
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
            case "Dana":
                return { color: "#10b981", icon: "💰" };
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

                <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl p-5 shadow-lg">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-sm opacity-90">{mode === "monthly" ? "Saldo Bulan Ini" : "Total Saldo"}</p>
                        <div className="flex gap-2">
                            <select value={mode} onChange={(e) => setMode(e.target.value)} className="text-xs bg-white text-gray-800 rounded px-2 py-1">
                                <option value="monthly">Bulanan</option>
                                <option value="all">Semua</option>
                            </select>
                            <button onClick={logout} className="bg-white text-gray-800 rounded px-2 py-1 text-xs">Logout</button>
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold">Rp {balance.toLocaleString()}</h1>

                    <div className="flex justify-between mt-3 text-sm">
                        <span className="text-green-200">+ Rp {totalIncome.toLocaleString()}</span>
                        <span className="text-red-200">- Rp {totalExpense.toLocaleString()}</span>
                    </div>
                </div>

                {mode === "monthly" && (
                    <select value={month} onChange={(e) => setMonth(e.target.value)} className="w-full border p-2 rounded-lg bg-white">
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
                )}

                <div className="bg-white p-4 rounded-2xl shadow-sm border">
                    <select
                        value={type}
                        onChange={(e) => {
                            setType(e.target.value);
                            setKategori("");
                        }}
                        className="w-full border border-gray-300 p-2 mb-2 rounded bg-white text-gray-900"
                    >
                        <option value="expense">Pengeluaran</option>
                        <option value="income">Pemasukan</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Rp 0"
                        value={nominal}
                        onChange={(e) => setNominal(formatNumber(e.target.value))}
                        className="w-full border border-gray-300 p-2 mb-2 rounded bg-white text-gray-900 placeholder-gray-500"
                    />

                    <select
                        value={kategori}
                        onChange={(e) => setKategori(e.target.value)}
                        className="w-full border border-gray-300 p-2 mb-2 rounded bg-white text-gray-900"
                    >
                        <option value="">Kategori</option>

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
                                <option value="dana">Dana</option>
                                <option value="bisnis">Bisnis</option>
                                <option value="lainnya">Lainnya</option>
                            </>
                        )}
                    </select>

                    <input
                        type="text"
                        placeholder="Catatan"
                        value={catatan}
                        onChange={(e) => setCatatan(e.target.value)}
                        className="w-full border border-gray-300 p-2 mb-2 rounded bg-white text-gray-900 placeholder-gray-500"
                    />

                    <button
                        onClick={handleAdd}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg font-semibold transition"
                    >
                        {loading ? "Menyimpan..." : "Tambah"}
                    </button>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-sm border">
                    <div className="h-40">
                        <ResponsiveContainer>
                            <BarChart data={incomeVsExpense}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="h-48 mt-4">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={groupedExpense} dataKey="value" nameKey="name">
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

                <div className="bg-white p-4 rounded-2xl shadow-sm border space-y-2">
                    {filtered.map((item) => {
                        const style = getCategoryStyle(item.kategori);
                        return (
                            <div key={item.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50">
                                <div>
                                    <p className="font-medium">{style.icon} {item.kategori}</p>
                                    <p className="text-xs text-gray-500">{item.catatan}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`font-semibold ${item.type === "income" ? "text-green-600" : "text-red-600"}`}>
                                        Rp {item.nominal.toLocaleString()}
                                    </p>
                                    <div className="text-xs text-gray-400 space-x-2">
                                        <button onClick={() => setEditItem(item)} className="hover:text-blue-600">Edit</button>
                                        <button onClick={() => handleDelete(item.id)} className="hover:text-red-600">Hapus</button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>

            {editItem && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white p-5 rounded-xl w-80 shadow-lg">
                        <h2 className="font-semibold mb-3">Edit Transaksi</h2>

                        <input
                            value={editItem.nominal}
                            onChange={(e) =>
                                setEditItem({ ...editItem, nominal: formatNumber(e.target.value) })
                            }
                            className="w-full border p-2 mb-2 rounded"
                        />

                        <select
                            value={editItem.kategori}
                            onChange={(e) =>
                                setEditItem({ ...editItem, kategori: e.target.value })
                            }
                            className="w-full border p-2 mb-2 rounded"
                        >
                            <option value="makanan">Makanan</option>
                            <option value="transport">Transport</option>
                            <option value="belanja">Belanja</option>
                            <option value="tagihan">Tagihan</option>
                            <option value="hiburan">Hiburan</option>
                            <option value="gaji">Gaji</option>
                            <option value="dana">Dana</option>
                            <option value="bonus">Bonus</option>
                            <option value="freelance">Freelance</option>
                        </select>

                        <input
                            value={editItem.catatan}
                            onChange={(e) =>
                                setEditItem({ ...editItem, catatan: e.target.value })
                            }
                            className="w-full border p-2 mb-3 rounded"
                        />

                        <div className="flex gap-2">
                            <button onClick={() => setEditItem(null)} className="w-full bg-gray-200 py-2 rounded">
                                Batal
                            </button>
                            <button onClick={handleUpdate} className="w-full bg-blue-600 text-white py-2 rounded">
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}