type SmsResult = { success: boolean; recId?: string; error?: string }

const BASE_URL = "https://rest.payamak-panel.com/api/SendSMS/BaseServiceNumber"

async function sendSms(text: string, to: string, bodyId: number): Promise<SmsResult> {
    try {
        const res = await fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: process.env.MELIPAYAMAK_USERNAME,
                password: process.env.MELIPAYAMAK_PASSWORD, // اینجا apikey میره
                text,
                to,
                bodyId,
            }),
        })
        const data = await res.json()
        if (data.RetStatus === 1) {
            return { success: true, recId: data.Value }
        }
        return { success: false, error: data.Value }
    } catch (err) {
        return { success: false, error: String(err) }
    }
}

// کدهای الگوی تاییدشده توی پنل ملی‌پیامک
const BODY_IDS = {
    loginCode: 525733,
    forgotPasswordCode: 525734,
    orderShipped: 525741,
    registerSuccess: 525737,
    orderPlacedCustomer: 525740,
    newOrderAdmin: 525745,
    orderPreparing: 525749,
}

export function sendLoginCode(to: string, code: string) {
    return sendSms(code, to, BODY_IDS.loginCode)
}

export function sendForgotPasswordCode(to: string, code: string) {
    return sendSms(code, to, BODY_IDS.forgotPasswordCode)
}

export function sendOrderShipped(to: string, customerName: string, trackingCode: string) {
    return sendSms(`${customerName};${trackingCode}`, to, BODY_IDS.orderShipped)
}

export function sendRegisterSuccess(to: string, customerName: string) {
    return sendSms(customerName, to, BODY_IDS.registerSuccess)
}

export function sendOrderPlacedCustomer(to: string, orderCode: string) {
    return sendSms(orderCode, to, BODY_IDS.orderPlacedCustomer)
}

export function sendNewOrderAdmin(to: string, orderCode: string) {
    return sendSms(orderCode, to, BODY_IDS.newOrderAdmin)
}

export function sendOrderPreparing(to: string, orderCode: string) {
    return sendSms(orderCode, to, BODY_IDS.orderPreparing)
}