export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #ffd6e0, #ffe9f3)",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "30px 40px",
          borderRadius: "20px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          textAlign: "center",
          maxWidth: "400px",
          animation: "fadeIn 1s ease",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "10px" }}>
          Hello 👋✨
        </h1>

        <p style={{ fontSize: "1.2rem", color: "#555" }}>
          Sayangku...
        </p>

        <h2 style={{ color: "#ff4d88", marginTop: "5px" }}>
          Zahra Sabillah 💖
        </h2>

        <p style={{ marginTop: "15px", fontSize: "0.9rem", color: "#888" }}>
          Kamu cantik banget tau 😳💕
        </p>

        <button
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            borderRadius: "999px",
            border: "none",
            background: "#ff4d88",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "0.2s",
          }}
          onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          onClick={() => alert("Ih kamu juga sayang aku kan? 😳💖")}
        >
          Klik aku dong 👉👈
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}