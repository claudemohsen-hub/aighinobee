// ============================================================
// کتابخانه‌ی ارسال پیامک — ملی‌پیامک (سیستم الگو/پترن)
// ============================================================
//
// این فایل یه تابع عمومی داره که با استفاده از "الگو" (Pattern)
// پیامک می‌فرسته. هر الگو یه کد اختصاصی داره که از پنل ملی‌پیامک
// می‌گیری و توی .env می‌ذاری.
//
// نکته‌ی امنیتی: هیچ‌وقت Username/Password یا API Key رو مستقیم
// اینجا ننویس — همیشه از process.env بخون.

const MELIPAYAMAK_USERNAME = process.env.MELIPAYAMAK_USERNAME
const MELIPAYAMAK_PASSWORD = process.env.MELIPAYAMAK_PASSWORD

// آدرس API ارسال پیامک با الگو (پترن) — این آدرس رسمی سرویس REST ملی‌پیامکه
const MELIPAYAMAK_PATTERN_URL = "https://console.melipayamak.com/api/send/shared/" + MELIPAYAMAK_USERNAME

// کدهای الگو (Pattern Code) — این‌ها رو از پنل ملی‌پیامک می‌گیری
// و اینجا با اسم مناسب جایگزین می‌کنی (فعلاً placeholder هستن)
export const SMS_PATTERNS = {
    REGISTER_SUCCESS: "PATTERN_CODE_REGISTER_SUCCESS", // کاربر عزیز ثبت‌نام شما با موفقیت انجام گردید. آیگینوبی
    LOGIN_OTP: "PATTERN_CODE_LOGIN_OTP", // کد ورود شما {0} می‌باشد. آیگینوبی
    FORGOT_PASSWORD_OTP: "PATTERN_CODE_FORGOT_PASSWORD", // کد فراموشی رمز عبور شما {0} می‌باشد. آیگینوبی
    ORDER_REGISTERED: "PATTERN_CODE_ORDER_REGISTERED", // {نام مشتری} سفارش شما ثبت شد. آیگینوبی
    ORDER_SHIPPED: "PATTERN_CODE_ORDER_SHIPPED", // {نام مشتری} سفارش شما با کد رهگیری {1} تحویل تیپاکس گردید.
    NEW_ORDER_ADMIN: "PATTERN_CODE_NEW_ORDER_ADMIN", // سفارش جدید ثبت شد (برای خود محسن)
}

/**
 * ارسال پیامک با الگو (Pattern)
 * @param to شماره موبایل گیرنده (مثل 09123456789)
 * @param patternCode کد الگو (از SMS_PATTERNS)
 * @param args آرایه‌ی مقادیری که باید جای {0}, {1} و... توی الگو قرار بگیرن
 */
export async function sendPatternSms(to: string, patternCode: string, args: string[] = []) {
    if (!MELIPAYAMAK_USERNAME || !MELIPAYAMAK_PASSWORD) {
        console.error("SMS ERROR: MELIPAYAMAK_USERNAME یا MELIPAYAMAK_PASSWORD در .env تنظیم نشده")
        return { success: false, message: "تنظیمات پیامک کامل نیست" }
    }

    try {
        const response = await fetch(MELIPAYAMAK_PATTERN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                bodyId: patternCode,
                to: to,
                args: args,
            }),
        })

        const data = await response.json()

        if (!response.ok) {
            console.error("SMS SEND ERROR:", data)
            return { success: false, message: "خطا در ارسال پیامک", data }
        }

        return { success: true, data }
    } catch (error) {
        console.error("SMS SEND EXCEPTION:", error)
        return { success: false, message: "خطا در اتصال به سرویس پیامک" }
    }
}

// ============================================================
// توابع کمکی برای هر نوع پیامک (این‌ها رو توی API Route ها صدا می‌زنیم)
// ============================================================

export async function sendRegisterSuccessSms(phone: string) {
    return sendPatternSms(phone, SMS_PATTERNS.REGISTER_SUCCESS, [])
}

export async function sendLoginOtpSms(phone: string, code: string) {
    return sendPatternSms(phone, SMS_PATTERNS.LOGIN_OTP, [code])
}

export async function sendForgotPasswordOtpSms(phone: string, code: string) {
    return sendPatternSms(phone, SMS_PATTERNS.FORGOT_PASSWORD_OTP, [code])
}

export async function sendOrderRegisteredSms(phone: string, customerName: string) {
    return sendPatternSms(phone, SMS_PATTERNS.ORDER_REGISTERED, [customerName])
}

export async function sendOrderShippedSms(phone: string, customerName: string, trackingCode: string) {
    return sendPatternSms(phone, SMS_PATTERNS.ORDER_SHIPPED, [customerName, trackingCode])
}

export async function sendNewOrderAdminSms(adminPhone: string) {
    return sendPatternSms(adminPhone, SMS_PATTERNS.NEW_ORDER_ADMIN, [])
}