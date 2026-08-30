/**
 * تبدیل اعداد فارسی و عربی به انگلیسی
 * مثال: "۰۹۱۲۳۴۵۶۷۸۹" → "09123456789"
 */
export function toEnglishDigits(input: string): string {
    if (!input) return ""

    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]
    const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"]

    let result = input
    for (let i = 0; i < 10; i++) {
        result = result
            .split(persianDigits[i]).join(String(i))
            .split(arabicDigits[i]).join(String(i))
    }
    return result
}

/**
 * تبدیل به انگلیسی و حذف هر چیزی جز رقم
 * برای فیلدهایی که فقط عدد قبول می‌کنند (موبایل، کد پستی، پلاک و...)
 */
export function onlyEnglishDigits(input: string): string {
    return toEnglishDigits(input).replace(/[^0-9]/g, "")
}