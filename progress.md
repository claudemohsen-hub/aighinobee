# 📍 فایل پیشرفت — کوچ Frontend/Backend محسن

## پروفایل یادگیرنده
- **نام:** محسن عامنش
- **پروژه:** آیگینوبی (فروش عسل) — هدف نهایی: سایت واقعی و حرفه‌ای برای فروش عمومی
- **سیستم‌عامل:** Mac Air M5 + Windows (هر دو استفاده می‌شن)
- **هدف کلی:** یادگیری فرانت‌اند حرفه‌ای، سپس بک‌اند، ساخت سایت کاملاً واقعی و کامل قبل از دیپلوی

## ⚠️ روش تدریس فعلی (تعادل)
- **مفاهیم جدید/منطقی:** سوال بپرس، بگذار خودش فکر کند.
- **سینتکس، الگوهای تکراری، کد پیچیده:** مستقیم‌تر کد بده وقتی محسن می‌گوید «خودت بگو» یا وقت کمه.
- وقتی کد پیچیده می‌شود یا محسن می‌ترسد اشتباه کند، فایل کامل بساز.

## ⚠️⚠️ قانون طلایی: اول هر جلسه بپرس Mac یا Windows
چون محسن مدام جابه‌جا می‌شود. چک‌لیست انتقال سیستم:
1. `git pull`
2. `npm install`
3. **فایل `.env` را چک کن** — همیشه با گیت منتقل نمی‌شود، دستی بساز با `DATABASE_URL` واقعی
4. اگر خطای `app/generated/prisma`: `npx prisma generate`
5. بعد از هر schema change: سرور را کامل ری‌استارت کن

---

## 🗺 نقشه‌ی راه (وضعیت جدید بعد از جلسه ۷۶+)

| مرحله | موضوع | وضعیت |
|-------|--------|--------|
| ۱ | امنیت پنل ادمین (رمز ساده) | ✅ تموم (جلسه ۷۳) |
| ۲ | مدیریت وضعیت سفارش (status) | ✅ تموم — بعد از کشف اینکه Prisma Client به دلیل "Drift" هیچ‌وقت واقعاً sync نمی‌شد (جلسه ۷۴-۷۶) |
| ۲.۵ | اعتبارسنجی فرم checkout + فیلد پلاک/طبقه/واحد | ✅ تموم (جلسه ۷۵) |
| ۳ | **سیستم ورود/عضویت کاربر (Login واقعی)** | ✅ **تموم — پیاده‌سازی کامل شد خارج از این گفتگو (توضیح در پایین)** |
| ۴ | پنل کاربری مشتری (`/account`) | ⏳ **بعدی — پیشنهاد شده در مستندات محسن** |
| ۵ | اتصال Order به User | ⏳ (بعد از پنل کاربری) |
| ۶ | پیامک (SMS) تایید سفارش | ⏳ |
| ۷ | مدیریت محصولات از پنل ادمین | ⏳ |
| ۸ | دیپلوی روی Vercel | ⏳ |
| ۹ | درگاه پرداخت واقعی محسن | ⏳ |

---

## 🚨 مهم: بخش بزرگی از کار (سیستم احراز هویت) خارج از این گفتگو انجام شد

در جلسه‌ای بعد از حل مشکل `status`، محسن یک سند Word کامل آپلود کرد که نشان می‌داد یک سیستم کامل احراز هویت پیاده‌سازی و تست شده — این کار به‌صورت مستقل (احتمالاً با کمک ابزار دیگر مثل ChatGPT یا مستقل) انجام شده، نه در این گفتگو. **باید در ابتدای جلسه‌ی بعد از محسن پرسیده شود که آیا این کار را خودش/با چه ابزاری انجام داد**، تا مشخص شود چقدر این مفاهیم را واقعاً فهمیده در مقابل کپی کرده.

### خلاصه‌ی کامل سیستم احراز هویت که ساخته شده:

**۱. حل مشکل Drift دیتابیس (که ما در جلسات قبل نتوانستیم حلش کنیم):**
```
npx prisma db pull
npx prisma migrate resolve --applied 20260825065721_add_order_model
npx prisma migrate status   → "Database schema is up to date!"
```
سپس چون از دست دادن داده مشکلی نداشت:
```
npx prisma migrate reset
```
این دقیقاً همان روش درستی بود که ما باید در جلسات قبل امتحان می‌کردیم — دستور `migrate resolve --applied` یک قدم حیاتی بود که در جلسات قبلی امتحان نشده بود.

**۲. مدل User اضافه شد:**
```prisma
model User {
  id       Int    @id @default(autoincrement())
  phone    String @unique
  password String
  name     String?
}
```
Migration: `npx prisma migrate dev --name add_user_model` سپس `add_user_name`

**۳. نصب bcryptjs برای هش کردن رمز:**
```
npm install bcryptjs
```

**۴. ساختار نهایی `lib/prisma.ts` (بدون تغییر از قبل):**
```typescript
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
export default prisma;
```
⚠️ نکته مهم: export به صورت `default` است، پس همه‌جا باید `import prisma from "@/lib/prisma"` (بدون آکولاد) استفاده شود.

**۵. API‌های ساخته‌شده:**
- `app/api/register/route.ts` — دریافت name/phone/password، بررسی تکراری نبودن شماره، هش کردن رمز با `bcrypt.hash(password, 10)`، ساخت User
- `app/api/login/route.ts` — بررسی phone، مقایسه رمز با `bcrypt.compare()`، ساخت Cookie با نام `userId` (HttpOnly, SameSite=Lax, Path=/)
- `app/api/me/route.ts` — خواندن Cookie، برگرداندن `{ id, phone, name }` (بدون رمز عبور)
- `app/api/logout/route.ts` — حذف Cookie با `cookieStore.delete("userId")`

**۶. صفحات:**
- `app/register/page.tsx` — فرم سه‌فیلدی (نام، موبایل، رمز)
- `app/login/page.tsx` — فرم دوفیلدی، بعد از موفقیت `router.push("/")`
- **نکته‌ی مهم دیباگ:** یک بار صفحه‌ی `page.tsx` اشتباهی داخل `app/api/register/` ساخته شد که با `route.ts` تداخل داشت (خطای "Conflicting route and page") — راه‌حل: انتقال صفحه به مسیر جدای `app/register/page.tsx`

**۷. Navbar داینامیک (`app/Navbar.tsx`):**
Client Component که موقع لود، `/api/me` را fetch می‌کند:
- کاربر مهمان → نمایش «ورود | ثبت‌نام»
- کاربر واردشده → نمایش «نام کاربر | خروج»
- نکته‌ی دیباگ: اول Navbar بعد از Login آپدیت نمی‌شد چون Cookie جدید را دوباره چک نمی‌کرد — حل شد با `router.push("/")` بعد از login موفق که باعث می‌شود کل صفحه (و Navbar) دوباره mount/fetch شود

**۸. `layout.tsx` آپدیت شد:**
```tsx
<CartContext>
  <Navbar />
  {children}
</CartContext>
```
CartContext, فونت Vazirmatn, و RTL حفظ شدند (چیزی خراب نشد).

### همه‌ی موارد زیر با curl تست و تایید شدند:
ثبت‌نام، جلوگیری از شماره تکراری، هش رمز، Login، ساخت Cookie، `/api/me`، نمایش نام، Logout، حذف Cookie، نمایش صحیح Navbar برای مهمان/کاربر، انتقال بعد از Login.

### ساختار نهایی فایل‌ها:
```
app/
├── api/
│   ├── register/route.ts
│   ├── login/route.ts
│   ├── me/route.ts
│   └── logout/route.ts
├── register/page.tsx
├── login/page.tsx
├── Navbar.tsx
└── layout.tsx

prisma/
├── schema.prisma
└── migrations/
    ├── 20260825065721_add_order_model
    ├── 20260827070443_add_user_model
    └── (migration مربوط به add_user_name)

lib/
└── prisma.ts
```

### پیشنهاد بعدی (از سند خود محسن)
مرحله‌ی منطقی بعدی: **صفحه‌ی حساب کاربری** در مسیر `/account` شامل نام، شماره، سفارش‌ها، وضعیت سفارش‌ها، خروج — و سپس **اتصال Order به User** (اضافه کردن رابطه‌ی foreign key بین دو مدل) تا هر سفارش مشخص باشد مال کدام کاربر است.

---

## 📚 جلسه‌ی بعدی: جلسه ۷۷
۱. بپرس Mac یا Windows، اجرای چک‌لیست همگام‌سازی
۲. بپرس این سیستم احراز هویت را خودش نوشته یا با کمک ابزار دیگری — برای درک سطح فهم محسن از این مفاهیم (Cookie, bcrypt, session) و تصمیم گرفتن چقدر باید توضیح داد
۳. تایید کن سیستم لاگین هنوز کار می‌کند (چون ممکن است بین این دو سیستم دوباره sync لازم باشد)
۴. شروع مرحله‌ی بعدی: صفحه‌ی `/account` + اتصال Order به User

---

## ✅ خلاصه‌ی مفاهیم یادگرفته‌شده در این گفتگو (جلسات ۱-۷۶)

برای جزئیات کامل جلسات ۱-۷۱ (HTML تا دیتابیس پایه) به نسخه‌های قبلی این فایل مراجعه شود. خلاصه‌ی جلسات اخیر:

### جلسات ۷۲-۷۳: پنل ادمین + امنیت پایه
- API GET برای خواندن سفارش‌ها (`prisma.order.findMany`)
- صفحه‌ی `/admin/orders` با گرید ۴ ستونه
- رمز عبور ساده با منطق `if (!isLoggedIn) return (...)` — امنیت سطح پایه، نه واقعی

### جلسات ۷۴-۷۶: حل مشکل عمیق status + PUT + validation
- **مشکل بزرگ حل‌شده:** فیلد `status` علیرغم چندین تلاش (migrate dev, db push, حتی force-reset) در Prisma Client ظاهر نمی‌شد — نهایتاً با SQL مستقیم (`ALTER TABLE`) در جلسه ۷۴ حل شد، ولی مشکل مشابه دوباره برای PUT/update برگشت
- **ریشه‌ی واقعی مشکل (کشف‌شده در سند محسن):** این یک "Drift" واقعی بین migration history و دیتابیس واقعی بود. راه‌حل درست: `npx prisma db pull` + `npx prisma migrate resolve --applied [نام_migration]` + در نهایت `npx prisma migrate reset`
- API `PUT` برای آپدیت وضعیت سفارش:
  ```typescript
  export async function PUT(request: Request) {
      const data = await request.json()
      const updatedOrder = await prisma.order.update({
          where: { id: data.id },
          data: { status: data.status }
      })
      return Response.json({ success: true, order: updatedOrder })
  }
  ```
- دراپ‌داون تغییر وضعیت در پنل ادمین با `handleStatusChange`
- اعتبارسنجی کامل فرم checkout: فقط عدد برای موبایل/کدپستی (`replace(/[^0-9]/g, "")`)، چک اجباری بودن فیلدها قبل از پرداخت با سری `if...return`
- فیلدهای پلاک/طبقه/واحد کنار هم با `flex gap-2`، هرکدام `useState` جدا و ذخیره‌ی جدا در دیتابیس

### جلسات ۷۷+: سیستم احراز هویت کامل (خارج از این گفتگو، شرح کامل در بالا)

---

## 🔧 وضعیت نهایی پروژه (honey-next)

**صفحات:** `/`, `/products`, `/products/[id]`, `/cart`, `/checkout` (با validation کامل)، `/contactus`, `/admin/orders` (با امنیت رمز و تغییر وضعیت)، `/register`, `/login`

**API Routes:**
- `app/api/hello/route.ts`, `app/api/products/route.ts`
- `app/api/order/route.ts` — POST/GET/PUT کامل
- `app/api/register/route.ts`, `app/api/login/route.ts`, `app/api/me/route.ts`, `app/api/logout/route.ts`

**مدل‌های دیتابیس (`prisma/schema.prisma`):**
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
  status      String   @default("در حال بررسی")
  plate       String
  floor       String?
  unit        String?
}

model User {
  id       Int     @id @default(autoincrement())
  phone    String  @unique
  password String
  name     String?
}
```
⚠️ Order و User هنوز به هم متصل نیستند (بدون رابطه/foreign key) — این کار بعدی است.

**دیتابیس:** بعد از `migrate reset` در جریان حل مشکل Drift، دوباره از نو ساخته شد.

---

## 🌐 گیت‌هاب و همگام‌سازی
- **Repository:** `github.com/claudemohsen-hub/aighinobee`
- push.sh (Mac) / push.bat (Windows) در ریشه‌ی `Code Learning`
- آخرین وضعیت شناخته‌شده در این گفتگو: کار روی Mac در حال انجام مشکل status بود؛ سیستم احراز هویت بعد از آن (احتمالاً روی Windows، طبق مستندات که "محیط توسعه: Windows" نوشته) ساخته شد

---

## ⚠️ الگوهای خطای رایج محسن
- فراموشی `className=`، بستن ناقص تگ‌ها/`<div>` بی‌جفت
- تکرار یا جا انداختن خط هنگام کپی/ادیت دستی
- سردرگمی بین اسم‌های مشابه یا مسیرهای مشابه فایل‌ها
- فراموشی ری‌استارت سرور بعد از تغییرات سراسری
- گاهی فایل اشتباه/بیرون از پروژه را باز می‌کند
- ترجیح می‌دهد وقتی کد پیچیده می‌شود، فایل کامل را بگیرد و کپی کند
- گاهی بخشی از کار را مستقل یا با ابزار دیگر انجام می‌دهد و بعد نتیجه را می‌آورد — باید همیشه پرسیده شود این کار در همین گفتگو انجام شده یا جای دیگر

---

## 📝 نکات فنی کلیدی (Cheat sheet سریع)
- **اجرای پروژه:** `cd honey-next && npm run dev` → پورت 3000
- **بعد از pull روی سیستم جدید:** `npm install` + `.env` دستی + `npx prisma generate`
- **دیدن دیتابیس بصری:** `npx prisma studio`
- **حل مشکل Drift دیتابیس (روش درست کشف‌شده):**
  ```
  npx prisma db pull
  npx prisma migrate resolve --applied [نام_migration]
  npx prisma migrate status
  # اگر لازم بود و از دست دادن داده مشکلی نداشت:
  npx prisma migrate reset
  ```
- **بعد از هر schema change:** `npx prisma generate` + ری‌استارت کامل سرور (`rm -rf .next` در موارد حاد)
- **API Route با چند متد در یک فایل:** `POST`, `GET`, `PUT` همه با `export async function` جدا در یک `route.ts`
- **الگوی احراز هویت با Cookie:**
  ```typescript
  // ساخت
  cookieStore.set("userId", String(user.id), { httpOnly: true, sameSite: "lax", path: "/" })
  // خواندن
  const userId = cookieStore.get("userId")?.value
  // حذف
  cookieStore.delete("userId")
  ```
- **هش کردن رمز:** `bcrypt.hash(password, 10)` برای ساخت، `bcrypt.compare(password, hashedPassword)` برای مقایسه
- **نمایش شرطی کل صفحه:** `if (!isLoggedIn) { return (<div>فرم</div>) }` سپس `return (<div>محتوای اصلی</div>)`

---

## 🔐 یادداشت مهم برای بک‌اند آینده
محسن یک **کلید/کد API درگاه پرداخت واقعی** دارد که باید در آینده (بعد از پنل کاربری و اتصال Order به User) به دکمه‌ی پرداخت در `/checkout` وصل شود.

---

**آخرین آپدیت:** بعد از دریافت سند Word محسن درباره‌ی سیستم احراز هویت کامل
**وضعیت:** فرانت‌اند + بک‌اند + دیتابیس + پنل ادمین + **سیستم کامل احراز هویت** (ثبت‌نام/ورود/خروج/Cookie) — همگی عملیاتی و تست‌شده
**بعدی:** جلسه ۷۷ — تایید نحوه‌ی انجام کار احراز هویت، سپس شروع صفحه‌ی `/account` و اتصال Order به User
