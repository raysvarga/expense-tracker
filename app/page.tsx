"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const user = localStorage.getItem("user_name");

    if (user) {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/login";
    }
  }, []);

  return (
    <main className="flex items-center justify-center min-h-screen">
      <p>Loading...</p>
    </main>
  );
}