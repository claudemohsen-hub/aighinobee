# 📍 فایل پیشرفت — کوچ Frontend/Backend محسن

## پروفایل یادگیرنده
- **نام:** محسن عامنش
- **پروژه:** آیگینوبی (فروش عسل) — هدف نهایی: سایت واقعی و حرفه‌ای برای فروش عمومی
- **سیستم‌عامل:** Mac Air M5 + Windows (هر دو استفاده می‌شن)
- **هدف کلی:** یادگیری فرانت‌اند حرفه‌ای، سپس بک‌اند با زبان‌های روز دنیا
- **ریتم فعلی:** جلسات پیوسته و طولانی؛ گاهی چند جلسه در یک نشست

## ⚠️ روش تدریس فعلی (تعادل)
- **برای مفاهیم جدید و منطقی/تصمیمات معماری:** سوال بپرس، بگذار خودش فکر کند.
- **برای سینتکس، الگوهای تکراری، و کدهای پیچیده/تخصصی:** مستقیم‌تر کد بده و توضیح بده چرا، به‌خصوص وقتی محسن می‌گوید «خودت بگو» یا «نمی‌دونم».
- وقتی محسن می‌گوید کد را خودش نمی‌نویسد، فایل کامل را بساز و بده دانلود کند.

## ⚠️⚠️ قانون طلایی جدید (حتماً اول هر جلسه رعایت شود!)
**همیشه در ابتدای هر جلسه از محسن بپرس: «الان روی Mac هستی یا Windows؟»**
چون او مدام بین این دو سیستم جابه‌جا می‌شود و این باعث مشکلات مکرر (نصب‌های ناقص، فایل‌های گم‌شده) شده است.

### چک‌لیست اجباری هر بار عوض کردن سیستم (Mac ↔ Windows):
1. `git pull`
2. `npm install` (چون `node_modules` هیچ‌وقت منتقل نمی‌شود)
3. **چک کن فایل `.env` وجود دارد** — این فایل به‌خاطر `.gitignore` هرگز با گیت منتقل نمی‌شود! باید **دستی** روی هر سیستم جدید دوباره ساخته شود با محتوای:
   ```
   DATABASE_URL="postgres://0668edc26f6ba816336bd34afd74286539969369847f3c07d68f41a1d07aad47:sk_qY3WrH2Lvi4M2YFQJgMop@db.prisma.io:5432/postgres?sslmode=require"
   ```
4. اگر خطای مربوط به `app/generated/prisma` آمد: `npx prisma generate`
5. اگر با نصب Prisma نسخه‌ی جدید (`8.0.0-rc`) مواجه شدی که دستورهای متفاوتی دارد، حتماً نسخه‌ی پایدار را نصب کن: `npm install prisma@7 --save-dev` یا مطمئن شو `package.json` نسخه‌ی درست را مشخص کرده

---

## 🗺 نقشه‌ی راه کامل

| مرحله | موضوع | وضعیت |
|-------|--------|--------|
| ۱-۷ | HTML تا تثبیت کامل فرانت‌اند | ✅ تموم شد (تا جلسه ۶۷) |
| ۸ | شروع بک‌اند: Next.js API Routes | ✅ **تموم شد (جلسه ۶۸-۶۹)** |
| ۹ | دیتابیس واقعی (Prisma + PostgreSQL) | ✅ **تموم شد (جلسه ۷۰-۷۱)** |
| ۱۰ | پنل ادمین ساده برای دیدن سفارش‌ها | ⏳ **بعدی (پیشنهادی)** |
| ۱۱ | اتصال API درگاه پرداخت واقعی محسن | ⏳ |
| ۱۲ | دیپلوی روی Vercel | ⏳ |
| ۱۳ | احراز هویت (Login/Auth) | ⏳ |

**در پایان جلسه ۷۱ از محسن پرسیده شد کدام را ترجیح می‌دهد: پنل ادمین یا اتصال درگاه پرداخت. جواب هنوز دریافت نشده — این باید اولین سوال جلسه‌ی بعد باشد (بعد از سوال Mac/Windows).**

---

## 📚 جلسه‌ی بعدی: جلسه ۷۲
۱. اول بپرس: Mac یا Windows؟
۲. چک‌لیست بالا را در صورت نیاز اجرا کن (خصوصاً `.env` و `npx prisma generate`)
۳. بپرس: پنل ادمین (دیدن سفارش‌ها) یا اتصال درگاه پرداخت واقعی؟
۴. ادامه بده

---

## ✅ خلاصه‌ی مفاهیم یادگرفته‌شده (جلسات ۱-۷۱)

### HTML/CSS/JS/Tailwind/React/Next.js پایه (جلسات ۱-۵۲)
تکمیل کامل — به فایل قبلی progress مراجعه شود اگر جزئیات لازم است.

### تثبیت فرانت‌اند (جلسات ۵۳-۶۷)
- Next.js نهایی (`honey-next`)، Dynamic Routes، Context API برای سبد خرید مشترک
- localStorage sync، صفحات کامل: خانه، محصولات، جزئیات، سبد، checkout، تماس با ما
- **Quantity در سبد خرید**: به‌جای آیتم تکراری، `addToCart` چک می‌کند آیا محصول با همان `id` وجود دارد، اگر بله فقط `quantity` زیاد می‌شود
- لیست کشویی وابسته استان→شهر (۳۱ استان ایران، `data/iranLocations.ts`)
- طراحی یکپارچه: پس‌زمینه سرمه‌ای تیره (`#0f172a`)، فونت Vazirmatn، رنگ طلایی (`amber`)
- حل Merge Conflict واقعی بین Mac/Windows

### شروع بک‌اند: API Routes (جلسات ۶۸-۶۹)
- `app/api/hello/route.ts` — اولین API با `GET`
- `app/api/products/route.ts` — برگرداندن `honeyList` واقعی با `Response.json()`
- `app/api/order/route.ts` — دریافت سفارش با `POST`، خواندن با `request.json()`
- اتصال فرانت به بک با `fetch`:
  ```typescript
  const response = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({...}),
  })
  const result = await response.json()
  ```
- نکته‌ی پورت تکراری: اگر سرور قبلی باز بماند، سرور جدید روی پورت دیگر (۳۰۰۱) بالا می‌آید؛ باید با `kill PID` بسته شود

### دیتابیس واقعی با Prisma (جلسات ۷۰-۷۱) — پیچیده‌ترین بخش تا الان
- نصب: `npm install prisma --save-dev` → `npx prisma init`
- **مهم:** حتماً نسخه‌ی پایدار Prisma نصب شود؛ نسخه‌ی `8.0.0-rc` دستورهای متفاوت و ناقص دارد و باعث سردرگمی شد
- ساخت دیتابیس ابری رایگان: `npx create-db` (باید حتماً با لینک Claim، ثبت رسمی شود وگرنه پاک می‌شود)
- `DATABASE_URL` در `.env` ذخیره می‌شود — این فایل **همیشه** در `.gitignore` است و **هرگز با git منتقل نمی‌شود**؛ باید روی هر سیستم جدید دستی دوباره ساخته شود (این یک منبع بزرگ سردرگمی و اتلاف وقت بود در این پروژه)
- مدل در `prisma/schema.prisma`:
  ```prisma
  model Order {
    id          Int      @id @default(autoincrement())
    phone       String
    address     String
    province    String
    city        String
    postalCode  String
    description String?
    items       Json
    totalPrice  Int
    createdAt   DateTime @default(now())
  }
  ```
- اعمال به دیتابیس واقعی: `npx prisma migrate dev --name add_order_model`
- ساخت کلاینت: `npx prisma generate` (باید بعد از هر انتقال بین سیستم‌ها یا اگر پوشه `app/generated/prisma` گم/خراب شود، دوباره اجرا شود)
- **نسخه‌ی جدید Prisma نیاز به Adapter صریح دارد** (فرق مهم با نسخه‌های قدیمی‌تر که فقط `new PrismaClient()` کافی بود):
  ```typescript
  // lib/prisma.ts
  import { PrismaClient } from "../app/generated/prisma/client"
  import { PrismaPg } from "@prisma/adapter-pg"

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
  const prisma = new PrismaClient({ adapter })
  export default prisma
  ```
  نیاز به نصب: `npm install @prisma/adapter-pg` و `npm install @prisma/client`
- اتصال نهایی API به دیتابیس:
  ```typescript
  import prisma from "../../../lib/prisma"
  const order = await prisma.order.create({ data: { phone, address, ... } })
  ```
- **نتیجه‌ی موفق:** فرم checkout واقعاً سفارش را در دیتابیس PostgreSQL ابری ذخیره می‌کند و پیام «سفارش شما با موفقیت ثبت شد» را برمی‌گرداند

### دستاورد مهم فرم checkout در این مرحله
تمام فیلدهای فرم (استان، شهر، آدرس، موبایل، کد پستی، توضیحات) به `useState` وصل شدند و در `handlePayment` همراه با `cart` و `finalTotal` به API ارسال می‌شوند.

---

## 🔧 وضعیت نهایی پروژه (honey-next) تا جلسه ۷۱

**صفحات:** `/`, `/products`, `/products/[id]`, `/cart`, `/checkout` (فرم کامل + اتصال دیتابیس واقعی)، `/contactus`

**API Routes:**
- `app/api/hello/route.ts` — تست ساده
- `app/api/products/route.ts` — GET لیست محصولات
- `app/api/order/route.ts` — POST ثبت سفارش در دیتابیس واقعی

**فایل‌های کلیدی جدید:**
- `lib/prisma.ts` — اتصال Prisma با Adapter
- `prisma/schema.prisma` — مدل Order
- `.env` — شامل `DATABASE_URL` (هرگز با git منتقل نمی‌شود، باید دستی روی هر سیستم ساخته شود)

**دیتابیس:** PostgreSQL ابری رایگان روی Prisma (claimed و امن)

---

## 🌐 گیت‌هاب و همگام‌سازی
- **Repository:** `github.com/claudemohsen-hub/aighinobee`
- push.sh (Mac) / push.bat (Windows) در ریشه‌ی `Code Learning`
- **[حادثه‌ی حل‌شده] Merge Conflict واقعی بین Mac/Windows** — با انتخاب دستی نسخه‌ی درست حل شد
- **آخرین وضعیت شناخته‌شده:** محسن آخرین بار از روی Mac پوش زده است (پایان جلسه ۷۱)

---

## ⚠️ الگوهای خطای رایج محسن
- فراموشی `className=` قبل از کلاس‌ها
- بستن ناقص تگ‌ها
- تکرار خط‌ها یا جا انداختن هنگام کپی/ادیت دستی
- گاهی به‌جای ویرایش خط موجود، خط جدید کنارش اضافه می‌کند
- سردرگمی بین اسم‌های مشابه فایل‌ها یا مسیرها
- فراموشی ری‌استارت سرور بعد از تغییر فایل‌های سراسری یا export جدید
- گاهی فایل اشتباه/قدیمی یا فایل بیرون از پوشه‌ی پروژه را باز می‌کند و فکر می‌کند مشکل از کد است (مثل `Honey/prisma.ts` به‌جای `Honey/honey-next/lib/prisma.ts`)
- ترجیح می‌دهد وقتی کد پیچیده می‌شود، فایل کامل را بگیرد و کپی کند

---

## 📝 نکات فنی کلیدی (Cheat sheet سریع)
- **RTL:** `<html lang="fa" dir="rtl">` در layout.tsx
- **اعداد فارسی:** `price.toLocaleString('fa-IR')`
- **اجرای پروژه:** `cd honey-next && npm run dev` → پورت 3000 (اگر اشغال بود پورت 3001، باید `kill PID` سرور قبلی زد)
- **بعد از pull روی سیستم جدید:** `npm install` + بازسازی `.env` + `npx prisma generate`
- **بعد از تغییر next.config.ts یا export جدید:** ری‌استارت کامل سرور؛ گاهی `rm -rf .next` لازم است
- **اگر خطای TypeScript روی import عجیب و غریب بود ولی کد واقعاً کار می‌کرد:** `Cmd+Shift+P` → `TypeScript: Restart TS Server`
- **Server vs Client Component:** پیش‌فرض Server؛ با `"use client"` بالای فایل، Client می‌شود.
- **API Route ساختار:**
  ```typescript
  export async function GET() { return Response.json(data) }
  export async function POST(request: Request) {
    const data = await request.json()
    // ...
    return Response.json({ success: true })
  }
  ```
- **fetch از فرانت‌اند:**
  ```typescript
  const response = await fetch("/api/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({...}),
  })
  const result = await response.json()
  ```
- **Prisma با Adapter (نسخه‌ی جدید):**
  ```typescript
  import { PrismaClient } from "../app/generated/prisma/client"
  import { PrismaPg } from "@prisma/adapter-pg"
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
  const prisma = new PrismaClient({ adapter })
  ```

---

## 🔐 یادداشت مهم برای بک‌اند آینده
محسن یک **کلید/کد API درگاه پرداخت واقعی** دارد که می‌خواهد به دکمه‌ی پرداخت در `/checkout` وصل شود، از طریق Next.js API Route (نه Client-side). این یکی از اولویت‌های اصلی است — پرسیده شود آیا این جلسه‌ی بعد یا بعد از پنل ادمین انجام شود.

---

**آخرین آپدیت:** پایان جلسه‌ی ۷۱
**وضعیت:** سیستم کامل فرانت‌اند + بک‌اند + دیتابیس واقعی کار می‌کند؛ سفارش‌ها واقعاً در PostgreSQL ذخیره می‌شوند
**بعدی:** جلسه ۷۲ — اول بپرس Mac/Windows، بعد بپرس پنل ادمین یا درگاه پرداخت، سپس ادامه بده
