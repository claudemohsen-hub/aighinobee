"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    const navItems = [
        { href: "/admin/orders", label: "سفارش‌ها و تیکت‌ها" },
        { href: "/admin/products", label: "محصولات" },
    ]

    return (
        <div className="min-h-screen flex flex-col sm:flex-row">
            <aside className="sm:w-56 bg-black/30 border-b sm:border-b-0 sm:border-l border-amber-900/40 p-4">
                <h2 className="text-amber-200 font-bold text-lg mb-6 px-2">پنل مدیریت آیگینوبی</h2>
                <nav className="flex sm:flex-col gap-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`px-3 py-2 rounded-lg text-sm transition ${
                                pathname.startsWith(item.href)
                                    ? "bg-amber-800 text-white"
                                    : "text-amber-100 hover:bg-white/10"
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>
            <main className="flex-1">{children}</main>
        </div>
    )
}