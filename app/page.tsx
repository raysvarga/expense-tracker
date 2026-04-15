"use client";

import { useState } from "react";

export default function Home() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [answered, setAnswered] = useState(false);

  const moveButton = () => {
    const x = Math.random() * 160 - 80;
    const y = Math.random() * 160 - 80;
    setPos({ x, y });
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f7fb", // soft blue-gray biar netral
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          padding: "32px",
          borderRadius: "18px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          textAlign: "center",
          width: "340px",
        }}
      >
        {!answered ? (
          <>
            <h1 style={{ marginBottom: "8px", color: "#1f2937" }}>
              Hai 👋
            </h1>

            <p style={{ color: "#6b7280", marginBottom: "4px" }}>
              Sayangku...
            </p>

            <h2 style={{ color: "#ec4899", marginBottom: "18px" }}>
              Zahra Sabillah 💖
            </h2>

            <p
              style={{
                marginBottom: "20px",
                fontSize: "0.95rem",
                color: "#374151",
              }}
            >
              Kamu sayang aku nggak? 😳
            </p>

            <div
              style={{
                position: "relative",
                height: "60px",
              }}
            >
              {/* YES */}
              <button
                onClick={() => setAnswered(true)}
                style={{
                  padding: "10px 18px",
                  borderRadius: "999px",
                  border: "none",
                  background: "#ec4899", // pink tapi solid
                  color: "#ffffff",
                  cursor: "pointer",
                  fontWeight: "600",
                  boxShadow: "0 4px 10px rgba(236,72,153,0.3)",
                }}
              >
                Sayang banget 💕
              </button>

              {/* NO (kabur) */}
              <button
                onMouseEnter={moveButton}
                style={{
                  padding: "10px 18px",
                  borderRadius: "999px",
                  border: "1px solid #d1d5db",
                  background: "#f9fafb",
                  color: "#374151",
                  cursor: "pointer",
                  position: "absolute",
                  left: "150px",
                  transform: `translate(${pos.x}px, ${pos.y}px)`,
                  transition: "0.2s",
                }}
              >
                Engga 😝
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 style={{ color: "#16a34a" }}>YEAYYY 🥰</h1>

            <p
              style={{
                marginTop: "10px",
                color: "#374151",
                fontSize: "1rem",
              }}
            >
              Aku juga sayang kamu 💖✨
            </p>

            <p
              style={{
                fontSize: "0.85rem",
                color: "#6b7280",
                marginTop: "8px",
              }}
            >
              yaudah kita bahagia terus ya 😆💕
            </p>
          </>
        )}
      </div>
    </main>
  );
}