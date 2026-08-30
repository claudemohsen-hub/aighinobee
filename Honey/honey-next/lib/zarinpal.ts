const MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID
const REQUEST_URL = "https://payment.zarinpal.com/pg/v4/payment/request.json"
const VERIFY_URL = "https://payment.zarinpal.com/pg/v4/payment/verify.json"
const STARTPAY_URL = "https://payment.zarinpal.com/pg/StartPay/"

type RequestResult = { success: boolean; authority?: string; url?: string; error?: string }
type VerifyResult = { success: boolean; refId?: string; error?: string }

/**
 * درخواست پرداخت — مبلغ به تومان
 */
export async function requestPayment(
    amountToman: number,
    description: string,
    callbackUrl: string,
    mobile?: string
): Promise<RequestResult> {
    try {
        const res = await fetch(REQUEST_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                merchant_id: MERCHANT_ID,
                amount: amountToman,
                callback_url: callbackUrl,
                description,
                metadata: mobile ? { mobile } : {},
            }),
        })
        const data = await res.json()

        console.log("ZARINPAL REQUEST RESPONSE:", JSON.stringify(data))

        if (data.data && data.data.code === 100) {
            const authority = data.data.authority
            return { success: true, authority, url: STARTPAY_URL + authority }
        }

        return { success: false, error: data.errors?.message || "خطا در ایجاد درخواست پرداخت" }
    } catch (err) {
        console.error("ZARINPAL REQUEST EXCEPTION:", err)
        return { success: false, error: String(err) }
    }
}

/**
 * تأیید پرداخت — مبلغ باید دقیقاً همان مبلغ درخواست اولیه باشد
 */
export async function verifyPayment(amountToman: number, authority: string): Promise<VerifyResult> {
    try {
        const res = await fetch(VERIFY_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                merchant_id: MERCHANT_ID,
                amount: amountToman,
                authority,
            }),
        })
        const data = await res.json()

        console.log("ZARINPAL VERIFY RESPONSE:", JSON.stringify(data))

        // کد 100 یعنی تأیید موفق، کد 101 یعنی قبلاً تأیید شده (هر دو موفقیت محسوب می‌شن)
        if (data.data && (data.data.code === 100 || data.data.code === 101)) {
            return { success: true, refId: String(data.data.ref_id) }
        }

        return { success: false, error: data.errors?.message || "پرداخت تأیید نشد" }
    } catch (err) {
        console.error("ZARINPAL VERIFY EXCEPTION:", err)
        return { success: false, error: String(err) }
    }
}