"use client";

import { FormEvent, useEffect, useState } from "react";

type Representative = {
  id: number;
  province: string;
  city: string;
  name: string;
  phone: string;
  address: string;
  description?: string | null;
};

const emptyForm = {
  province: "",
  city: "",
  name: "",
  phone: "",
  address: "",
  description: "",
};

export default function AdminRepresentativesPage() {
  const [items, setItems] = useState<Representative[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadRepresentatives() {
    setLoading(true);

    try {
      const response = await fetch("/api/representatives");
      const data = await response.json();

      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRepresentatives();
  }, []);

  function updateField(
    field: keyof typeof emptyForm,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function startEdit(item: Representative) {
    setEditingId(item.id);

    setForm({
      province: item.province,
      city: item.city,
      name: item.name,
      phone: item.phone,
      address: item.address,
      description: item.description ?? "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);

    try {
      const response = await fetch(
        editingId
          ? `/api/representatives/${editingId}`
          : "/api/representatives",
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) {
        alert("ذخیره اطلاعات انجام نشد.");
        return;
      }

      resetForm();
      await loadRepresentatives();
    } catch {
      alert("خطایی در ارتباط با سرور رخ داد.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteRepresentative(id: number) {
    const confirmed = confirm(
      "آیا از حذف این نماینده مطمئن هستید؟"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/representatives/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        alert("حذف نماینده انجام نشد.");
        return;
      }

      await loadRepresentatives();
    } catch {
      alert("خطایی در ارتباط با سرور رخ داد.");
    }
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-sm font-bold text-amber-600">
            مدیریت سایت
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-900">
            مدیریت نمایندگان فروش
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            نمایندگان فروش را اضافه، ویرایش یا حذف کنید.
          </p>
        </header>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mb-10 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
        >
          <div className="mb-7 flex items-center justify-between gap-4">
            <h2 className="text-xl font-black text-slate-900">
              {editingId
                ? "ویرایش نماینده"
                : "افزودن نماینده جدید"}
            </h2>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200"
              >
                لغو ویرایش
              </button>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <label>
              <span className="mb-2 block text-sm font-bold">
                استان
              </span>

              <input
                required
                value={form.province}
                onChange={(e) =>
                  updateField("province", e.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-amber-400 focus:bg-white"
                placeholder="مثلاً تهران"
              />
            </label>

            <label>
              <span className="mb-2 block text-sm font-bold">
                شهر
              </span>

              <input
                required
                value={form.city}
                onChange={(e) =>
                  updateField("city", e.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-amber-400 focus:bg-white"
                placeholder="مثلاً تهران"
              />
            </label>

            <label>
              <span className="mb-2 block text-sm font-bold">
                نام نماینده
              </span>

              <input
                required
                value={form.name}
                onChange={(e) =>
                  updateField("name", e.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-amber-400 focus:bg-white"
                placeholder="نام و نام خانوادگی"
              />
            </label>

            <label>
              <span className="mb-2 block text-sm font-bold">
                شماره تماس
              </span>

              <input
                required
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  updateField("phone", e.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-amber-400 focus:bg-white"
                placeholder="0912..."
              />
            </label>

            <label className="sm:col-span-2">
              <span className="mb-2 block text-sm font-bold">
                آدرس
              </span>

              <input
                required
                value={form.address}
                onChange={(e) =>
                  updateField("address", e.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-amber-400 focus:bg-white"
                placeholder="آدرس کامل نماینده"
              />
            </label>

            <label className="sm:col-span-2 lg:col-span-3">
              <span className="mb-2 block text-sm font-bold">
                توضیحات
              </span>

              <textarea
                value={form.description}
                onChange={(e) =>
                  updateField("description", e.target.value)
                }
                rows={3}
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-amber-400 focus:bg-white"
                placeholder="توضیحات اختیاری"
              />
            </label>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-slate-900 px-7 py-3 font-bold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "در حال ذخیره..."
                : editingId
                ? "ذخیره تغییرات"
                : "افزودن نماینده"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-2xl bg-slate-100 px-6 py-3 font-bold text-slate-700"
              >
                انصراف
              </button>
            )}
          </div>
        </form>

        {/* List */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <h2 className="text-xl font-black">
              فهرست نمایندگان
            </h2>
          </div>

          {loading ? (
            <div className="p-10 text-center text-slate-500">
              در حال دریافت اطلاعات...
            </div>
          ) : items.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              هنوز نماینده‌ای ثبت نشده است.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="font-black text-slate-900">
                      {item.name}
                    </div>

                    <div className="mt-1 text-sm text-amber-600">
                      {item.province}، {item.city}
                    </div>

                    <div className="mt-2 text-sm text-slate-500">
                      📞 {item.phone}
                    </div>

                    <div className="mt-1 text-sm leading-6 text-slate-400">
                      📍 {item.address}
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="rounded-xl bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700 hover:bg-amber-100"
                    >
                      ویرایش
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteRepresentative(item.id)
                      }
                      className="rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}