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
    <main style={{ padding: 20 }}>
      <h1>Login</h1>

      <input
        type="text"
        placeholder="Masukkan nama"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <button onClick={handleLogin}>Masuk</button>
    </main>
  );
}