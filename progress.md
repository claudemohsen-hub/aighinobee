# 📍 فایل پیشرفت — کوچ Frontend/Backend محسن

## پروفایل یادگیرنده
- **نام:** محسن عامنش
- **پروژه:** آیگینوبی (فروش عسل) — هدف نهایی: سایت واقعی و حرفه‌ای برای فروش عمومی
- **هاست اصلی سایت وانیلا:** iginobee.com (cPanel)
- **سیستم‌عامل:** Mac Air M5 + Windows (هر دو استفاده می‌شن)
- **هدف کلی:** یادگیری فرانت‌اند حرفه‌ای، سپس بک‌اند با زبان‌های روز دنیا
- **سبک تدریس:** فارسی + اصطلاحات تخصصی انگلیسی؛ مربی کد آماده نمی‌ده، فقط هدایت و اصلاح می‌کند؛ هر جلسه با جزوه تمام می‌شود
- **ریتم فعلی:** ۲-۳ جلسه در روز (وقتی فعاله)، هر جلسه ~۱۵-۲۵ دقیقه

---

## 🗺 نقشه‌ی راه کامل (اصلی + توسعه‌یافته)

| مرحله | موضوع | وضعیت |
|-------|--------|--------|
| ۱ | HTML | ✅ تموم شد |
| ۲ | CSS (Flexbox/Grid/Responsive/Variables) | ✅ تموم شد |
| ۳ | JavaScript کامل (DOM, Array, Object, Cart, localStorage, Form, Fetch, async/await) | ✅ تموم شد |
| ۴ | Tailwind CSS | ✅ تموم شد |
| ۵ | React (Props, State, map, Cart با useState) | ✅ تموم شد |
| ۶ | Next.js (Routing, Layout, صفحات چندگانه) | ✅ تموم شد |
| **--- نقشه‌ی اصلی ۱۰۰٪ تکمیل شد در جلسه ۵۲ --- ** | | |
| ۷ | تثبیت فرانت‌اند (تکمیل واقعی آیگینوبی: عکس محصولات، صفحه جزئیات، سبد کامل، طراحی نهایی) | ⏳ **بعدی — جلسه ۵۳** |
| ۸ | TypeScript عمیق‌تر | ⏳ |
| ۹ | Node.js / Next.js API Routes (بک‌اند) | ⏳ |
| ۱۰ | PostgreSQL + Prisma (دیتابیس) | ⏳ |
| ۱۱ | دیپلوی روی Vercel | ⏳ |
| ۱۲ | احراز هویت (Login/Auth) | ⏳ |
| ۱۳ | پرداخت آنلاین | ⏳ |

**تخمین کلی مسیر باقی‌مانده:** ۷۵-۹۵ جلسه (با ریتم فعلی ~۲.۵-۳.۵ ماه، اگر پیوسته انجام شود)

---

## 📚 جلسه‌ی بعدی: جلسه ۵۳
شروع «مرحله ۱: تثبیت فرانت‌اند» — تکمیل واقعی سایت آیگینوبی روی Next.js (honey-next)

---

## ✅ خلاصه‌ی مفاهیم یادگرفته‌شده (جلسات ۱-۵۲)

### HTML (جلسات ۱-۶)
ساختار پایه، تگ‌های معنایی، لیست‌ها، جدول‌ها، فرم‌ها، لینک‌ها، عکس‌ها

### CSS (جلسات ۷-۱۴)
سه روش CSS، Flexbox (flex, gap, justify-content, align-items, flex-wrap)، Grid (grid-template-columns/areas)، Responsive (@media)، CSS Variables (:root, var())

### JavaScript (جلسات ۱۵-۳۴)
- متغیر (let/const)، انواع داده، if/else، function
- DOM: getElementById، innerText/innerHTML
- Event: addEventListener
- Array + Loop + Object + Array of Objects
- Ternary Operator
- **سبد خرید کامل:** push/splice، محاسبه جمع قیمت، نمایش/حذف/خالی‌کردن سبد
- **localStorage:** ذخیره دائمی سبد با JSON.stringify/parse
- **فرم تماس:** preventDefault، Validation
- **Fetch + async/await:** کار با API واقعی (jsonplaceholder)

### Tailwind CSS (جلسات ۳۵-۴۱)
نصب CDN، Flexbox/Grid با کلاس، Responsive با sm:/md:/lg:، hover:، رنگ سفارشی (tailwind.config → theme.extend.colors)

### React + TypeScript (جلسات ۴۲-۴۸)
- پروژه‌ی `honey-react` (Vite + TypeScript)
- Component، JSX، export default
- Props (تعریف نوع با TypeScript، مثل `{ name: string; price: number }`)
- `.map()` برای رندر لیست + قانون `key`
- useState (شمارنده، سپس سبد خرید کامل با Array)
- Spread operator (`...cart`) به‌جای mutate مستقیم
- فیلتر کردن با `.filter()` برای حذف از سبد
- toLocaleString('fa-IR') برای نمایش صحیح اعداد فارسی

### Next.js (جلسات ۴۹-۵۲)
- پروژه‌ی `honey-next` (App Router, TypeScript, Tailwind از پیش‌فرض)
- File-based Routing: `app/page.tsx` = `/`, `app/products/page.tsx` = `/products`
- `layout.tsx`: قالب مشترک با Navbar، `{children}`
- `lang="fa" dir="rtl"` روی تگ html در layout.tsx
- `"use client"` برای صفحاتی که useState/onClick دارند
- ترکیب نهایی: کارت محصول + سبد خرید کامل داخل صفحه‌ی `/products`

---

## 🔧 پروژه‌های موجود (چند نسخه از آیگینوبی — باید یکی نهایی انتخاب شود!)
1. **نسخه‌ی وانیلا (اصلی، آپلودشده روی هاست):** `index.html`, `style.css`, `script.js` — پوشه‌ی Code Learning، آپلود در iginobee.com/honey/
2. **نسخه‌ی React تمرینی:** پوشه‌ی `honey-react` (Vite) — فقط برای یادگیری، شامل Counter تمرینی (حذف‌شده)، ProductCard، Cart
3. **نسخه‌ی Next.js (آخرین و نهایی):** پوشه‌ی `honey-next` — دارای layout مشترک، صفحات `/`, `/products`, `/contactus`

⚠️ **نکته‌ی مهم برای جلسه بعد:** باید مشخص شود کدام نسخه ادامه پیدا می‌کند برای سایت واقعی — به احتمال زیاد honey-next چون جدیدترین و کامل‌ترین معماریست.

---

## 🌐 گیت‌هاب و همگام‌سازی
- **Repository:** `github.com/claudemohsen-hub/aighinobee`
- **push.sh** (Mac، در پوشه‌ی Code Learning):
```bash
cd "$(dirname "$0")"
git add .
git commit -m "auto update"
git push
```
اجرا با `./push.sh` (نیاز به `chmod +x push.sh` یک‌بار)
- **push.bat** (Windows): مسیر `E:\Code Learning`، دابل‌کلیک برای اجرا
- روتین طلایی: **همیشه قبل از عوض کردن سیستم (Mac↔Windows)، push بزن؛ بعد از اومدن سراغ سیستم دیگه، اول pull بزن**
- [حادثه‌ی حل‌شده] یک بار اجرای push.sh در پوشه‌ی اشتباه باعث حذف `index.html`/`script.js` از گیت‌هاب شد؛ با `git checkout <commit-qadimi> -- index.html script.js` بازیابی و دوباره push شد

---

## ⚠️ الگوهای خطای رایج محسن (برای کمک دقیق‌تر در آینده)
- فاصله‌ی اضافه یا جاافتاده در کلمات کلیدی (`let`, `const`, `function`)
- بزرگ/کوچیک بودن حروف (خصوصاً در نام Component های React که باید حرف اول بزرگ باشد؛ و در HTML id ها)
- اشتباه گرفتن عدد `1`/حرف `l`، در نام کلاس‌های Tailwind (`rounded-lg` نه `rounded-1g`)
- فراموشی بستن پرانتز/آکولاد در `.map()` (الگوی درست: `))}`)
- کپی/پیست جزئی که باعث تکرار کد یا جا افتادن خط می‌شود
- نیاز به توضیح "خط به خط" و بسیار ساده برای جا افتادن مفهوم — روش پاسخ‌گویی مناسب: تشریح کامل + مثال ساده قبل از رفتن به سوال بعد

---

## 📝 نکات فنی کلیدی (Cheat sheet سریع)
- **RTL همیشه اول کار:** در `index.html` وانیلا → `<html lang="fa" dir="rtl">`؛ در Next.js → همین را در `layout.tsx` بگذار
- **اعداد فارسی درست:** `price.toLocaleString('fa-IR')` – هم رقم فارسی می‌شود هم جهت درست می‌شود
- **صداکردن پروژه‌ها:**
  - وانیلا: مستقیم باز کردن `index.html` (Live Server، پورت 5500)
  - React (Vite): `cd honey-react && npm run dev` → پورت 5173
  - Next.js: `cd honey-next && npm run dev` → پورت 3000
- **انتقال پروژه بین سیستم‌ها:** بعد از pull، حتماً یک‌بار `npm install` بزن (چون node_modules منتقل نمی‌شود)

---

**آخرین آپدیت:** پایان جلسه‌ی ۵۲ (تکمیل کامل نقشه‌ی راه اصلی Next.js developer)
**وضعیت:** ✅ HTML+CSS+JS+Tailwind+React+Next.js همگی تکمیل شدند؛ سبد خرید کامل در Next.js پیاده‌سازی شد
**بعدی:** جلسه ۵۳ — شروع مرحله‌ی توسعه‌یافته: تثبیت فرانت‌اند و تکمیل واقعی سایت آیگینوبی
