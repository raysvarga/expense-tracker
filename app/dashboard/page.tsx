"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [name, setName] = useState("");
  const [nominal, setNominal] = useState("");
  const [kategori, setKategori] = useState("");
  const [catatan, setCatatan] = useState("");
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const user = localStorage.getItem("user_name");
    if (!user) {
      window.location.href = "/login";
    } else {
      setName(user);
    }

    const saved = localStorage.getItem("expenses");
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  const handleAdd = async () => {
    if (!nominal || !kategori) {
        alert("Isi nominal & kategori");
        return;
    }

    const user = localStorage.getItem("user_name");

    const payload = {
        user_id: user,
        nominal: Number(nominal),
        kategori,
        catatan,
    };

    try {
        // 🔥 KIRIM KE GOOGLE SHEETS
        await fetch("https://script.google.com/macros/s/AKfycbygSfaqjs2uHpSpeBVVMCRgt0lwrdTH-rY9wYg9Jiv-IM5RG-snTt8PcgE4f2fEIPoCjA/exec", {
        method: "POST",
        body: JSON.stringify(payload),
        });

        console.log("Berhasil kirim ke Sheets");
    } catch (err) {
        console.error("Error kirim:", err);
    }

    // tetap simpan lokal
    const newItem = {
        id: Date.now(),
        ...payload,
    };

    const newData = [...data, newItem];
    setData(newData);
    localStorage.setItem("expenses", JSON.stringify(newData));

    // reset input
    setNominal("");
    setKategori("");
    setCatatan("");
    };

  const total = data.reduce((sum, item) => sum + item.nominal, 0);

  return (
    <main style={{ padding: 20 }}>
      <h1>Dashboard</h1>
      <p>Halo, {name} 👋</p>

      <hr />

      <h2>Tambah Pengeluaran</h2>

      <input
        type="number"
        placeholder="Nominal"
        value={nominal}
        onChange={(e) => setNominal(e.target.value)}
      />
      <br /><br />

      <input
        type="text"
        placeholder="Kategori (makanan, dll)"
        value={kategori}
        onChange={(e) => setKategori(e.target.value)}
      />
      <br /><br />

      <input
        type="text"
        placeholder="Catatan"
        value={catatan}
        onChange={(e) => setCatatan(e.target.value)}
      />
      <br /><br />

      <button onClick={handleAdd}>Tambah</button>

      <hr />

      <h2>Total: Rp {total}</h2>

      <h3>List Pengeluaran</h3>

      {data.map((item) => (
        <div key={item.id}>
          Rp {item.nominal} - {item.kategori} ({item.catatan})
        </div>
      ))}
    </main>
  );
}