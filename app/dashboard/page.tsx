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

  const handleAdd = () => {
    if (!nominal || !kategori) {
      alert("Isi nominal & kategori");
      return;
    }

    const newItem = {
      id: Date.now(),
      nominal: Number(nominal),
      kategori,
      catatan,
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