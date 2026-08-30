"use client";

import { useEffect, useMemo, useState } from "react";

type Representative = {
  id: number;
  province: string;
  city: string;
  name: string;
  phone: string;
  address: string;
  description?: string | null;
};

export default function RepresentativesPage() {
  const [representatives, setRepresentatives] = useState<Representative[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [province, setProvince] = useState("همه");

  useEffect(() => {
    fetch("/api/representatives")
      .then((res) => res.json())
      .then((data) => {
        setRepresentatives(Array.isArray(data) ? data : []);
      })
      .catch(() => setRepresentatives([]))
      .finally(() => setLoading(false));
  }, []);

  const provinces = useMemo(() => {
    return [
      "همه",
      ...Array.from(new Set(representatives.map((item) => item.province))),
    ];
  }, [representatives]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return representatives.filter((item) => {
      const provinceMatch =
        province === "همه" || item.province === province;

      const searchMatch =
        !query ||
        `${item.name} ${item.city} ${item.province} ${item.address}`
          .toLowerCase()
          .includes(query);

      return provinceMatch && searchMatch;
    });
  }, [representatives, search, province]);

  const grouped = useMemo(() => {
    return filtered.reduce<Record<string, Representative[]>>(
      (groups, representative) => {
        if (!groups[representative.province]) {
          groups[representative.province] = [];
        }

        groups[representative.province].push(representative);

        return groups;
      },
      {}
    );
  }, [filtered]);

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#faf9f5] text-slate-800"
    >
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-orange-200/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-5 py-2 text-sm font-bold text-amber-700 shadow-sm backdrop-blur">
              <span>🍯</span>
              <span>شبکه نمایندگان آیگینوبی</span>
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              نمایندگان فروش
              <span className="mt-2 block text-amber-600">
                آیگینوبی در ایران
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              نزدیک‌ترین نماینده آیگینوبی به خودتان را پیدا کنید و برای
              خرید حضوری یا دریافت راهنمایی با او در ارتباط باشید.
            </p>

            <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-3 sm:flex-row">
              <div className="flex flex-1 items-center rounded-2xl border border-slate-200 bg-white px-5 shadow-sm transition focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-100">
                <span className="ml-3 text-xl text-slate-400">⌕</span>

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="جستجوی نام، شهر یا استان..."
                  className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-slate-400"
                />
              </div>

              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold shadow-sm outline-none focus:border-amber-400"
              >
                {provinces.map((item) => (
                  <option key={item} value={item}>
                    {item === "همه" ? "همه استان‌ها" : item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
              نمایندگان فروش
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {filtered.length} نماینده
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-3xl bg-slate-200"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="text-5xl">🔎</div>

            <h3 className="mt-5 text-xl font-black text-slate-900">
              نماینده‌ای پیدا نشد
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              عبارت جستجو یا استان انتخابی را تغییر دهید.
            </p>
          </div>
        ) : (
          <div className="space-y-14">
            {Object.entries(grouped).map(
              ([provinceName, provinceRepresentatives]) => (
                <div key={provinceName}>
                  <div className="mb-6 flex items-center gap-3">
                    <div className="h-10 w-1.5 rounded-full bg-amber-500" />

                    <h3 className="text-xl font-black text-slate-900 sm:text-2xl">
                      {provinceName}
                    </h3>

                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                      {provinceRepresentatives.length} نماینده
                    </span>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {provinceRepresentatives.map((item) => (
                      <article
                        key={item.id}
                        className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-xl"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-bold text-amber-600">
                              {item.city}
                            </p>

                            <h4 className="mt-1 text-xl font-black text-slate-900">
                              {item.name}
                            </h4>
                          </div>

                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-2xl transition group-hover:scale-110">
                            🍯
                          </div>
                        </div>

                        <div className="mt-7 space-y-4">
                          <a
                            href={`tel:${item.phone}`}
                            className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 text-sm font-bold transition hover:bg-amber-50 hover:text-amber-700"
                          >
                            <span>📞</span>
                            <span>{item.phone}</span>
                          </a>

                          <div className="flex gap-3 text-sm leading-7 text-slate-600">
                            <span>📍</span>
                            <span>{item.address}</span>
                          </div>

                          {item.description && (
                            <div className="border-t border-slate-100 pt-4 text-sm leading-7 text-slate-500">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </section>
    </main>
  );
}