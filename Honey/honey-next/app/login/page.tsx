"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleLogin() {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone,
        password,
      }),
    });

    const data = await response.json();

   if (response.ok) {
  router.push("/");
} else {
  setMessage(data.error);
}
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">ورود</h1>

      <div className="flex flex-col gap-4 max-w-sm">
        <input
          type="text"
          placeholder="شماره موبایل"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-2"
        />

        <input
          type="password"
          placeholder="رمز عبور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2"
        />

        <button
          onClick={handleLogin}
          className="bg-amber-800 text-white p-2"
        >
          ورود
        </button>

        {message && <p>{message}</p>}
      </div>
    </main>
  );
}