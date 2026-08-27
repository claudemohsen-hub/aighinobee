"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleRegister() {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        phone,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("ثبت‌نام با موفقیت انجام شد");
    } else {
      setMessage(data.error);
    }
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">ثبت‌نام</h1>

      <div className="flex flex-col gap-4 max-w-sm">
        <input
          type="text"
          placeholder="نام"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2"
        />

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
          onClick={handleRegister}
          className="bg-amber-800 text-white p-2"
        >
          ثبت‌نام
        </button>

        {message && <p>{message}</p>}
      </div>
    </main>
  );
}