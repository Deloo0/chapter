# Chapter - AI Image Enhancement Platform

أداة احترافية لتحسين وتوليد الصور باستخدام الذكاء الاصطناعي المفتوح المصدر

## ✨ الميزات

- ✅ تحسين الصور إلى 4K بدقة عالية جداً (Real-ESRGAN)
- ✅ توليد صور احترافية من النصوص (Stable Diffusion XL)
- ✅ إزالة الضوضاء والتحسين التلقائي
- ✅ واجهة مستخدم احترافية وجميلة
- ✅ Chrome Extension متقدمة
- ✅ معالجة Prompts احترافية
- ✅ معاينة قبل/بعد فورية
- ✅ تحميل الصور بجودة عالية
- ✅ تشغيل على Termux (خوادم محمولة)

## 🚀 التكنولوجيا

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Node.js + Express
- **AI:** Hugging Face API (Stable Diffusion, Real-ESRGAN)
- **Storage:** Local Storage + Cloud
- **Server:** يعمل على أي جهاز (Windows, Mac, Linux, Termux)

## 📦 هيكل المشروع

```
chapter/
├── web-app/
│   ├── index.html          # الواجهة الرئيسية
│   ├── styles.css          # التنسيق
│   ├── app.js              # التطبيق الأساسي
│   ├── api.js              # تكامل Hugging Face
│   └── config.js           # الإعدادات
│
├── backend/
│   ├── server.js           # خادم Express
│   ├── package.json        # المكتبات
│   ├── setup.sh            # سكريبت التثبيت
│   └── README.md           # تعليمات Termux
│
└── README.md               # هذا الملف
```

## 🎯 البدء السريع

### **على Windows/Mac/Linux:**

```bash
# 1. انسخ المستودع
git clone https://github.com/Deloo0/chapter.git
cd chapter/backend

# 2. ثبّت المكتبات
npm install

# 3. شغّل السيرفر
npm start

# 4. افتح في Chrome
http://localhost:3000
```

### **على Termux (الهاتف الذكي):**

```bash
# انسخ المستودع
cd /sdcard/Download
git clone https://github.com/Deloo0/chapter.git
cd chapter/backend

# شغّل التثبيت
bash setup.sh

# ثم شغّل السيرفر
npm start

# افتح الرابط الذي سيظهر في Chrome
```

## 📝 الاستخدام

### **تحسين الصور:**
1. افتح الأداة في المتصفح
2. اضغط "تحسين الصور"
3. اختر صورة من جهازك
4. اختر مستوى التكبير (2x, 4x, 8x)
5. اضغط "✨ تحسين الصورة"
6. حمّل النتيجة

### **توليد الصور:**
1. اضغط "توليد الصور"
2. اكتب وصف تفصيلي للصورة
3. اختر الأسلوب والحجم
4. اضغط "🎨 توليد الصور"
5. حمّل الصورة المُولدة

## 🔐 مفتاح API

تحتاج إلى مفتاح Hugging Face مجاني:

1. انتقل إلى https://huggingface.co
2. سجل حساباً مجانياً
3. اذهب إلى Settings → Access Tokens
4. أنشئ token جديد
5. الصقه في الإعدادات

## 📱 تشغيل على Termux

### **المتطلبات:**
- Termux
- Node.js (سيتم تثبيته تلقائياً)
- npm (سيتم تثبيته تلقائياً)

### **الخطوات:**
```bash
bash setup.sh    # التثبيت
npm start        # التشغيل
```

ثم افتح الرابط الذي يظهر في Chrome!

## 🛠️ تخصيص المشروع

### **تغيير البورت:**
```bash
PORT=8000 npm start
```

### **إضافة متغيرات البيئة:**
أنشئ ملف `.env`:
```
PORT=3000
NODE_ENV=production
```

## 📚 الموارد

- [Hugging Face API](https://huggingface.co/docs/api-inference)
- [Real-ESRGAN](https://huggingface.co/nightmareai/real-esrgan)
- [Stable Diffusion XL](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0)
- [Express.js](https://expressjs.com/)

## 🐛 المشاكل الشائعة

| المشكلة | الحل |
|--------|------|
| Port already in use | غيّر البورت: `PORT=3001 npm start` |
| npm command not found | ثبّت Node.js من nodejs.org |
| API Key error | تأكد من صحة المفتاح من Hugging Face |
| Connection timeout | تحقق من الإنترنت |

## 📝 الترخيص

MIT License - استخدم المشروع بحرية!

## 👨‍💻 المطور

صنعت بـ ❤️ من قبل **Deloo0**

---

**استمتع باستخدام Chapter! 🚀**
