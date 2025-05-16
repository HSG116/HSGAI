# HSG AI Platform

منصة HSG AI هي منصة ذكية متطورة تقدم خدمات متنوعة للمستخدمين.

## المتطلبات

- Node.js (v14 أو أحدث)
- MongoDB
- npm أو yarn

## التثبيت

1. قم بتثبيت التبعيات:
```bash
npm install
```

2. قم بإنشاء ملف `.env` في المجلد الرئيسي وأضف المتغيرات التالية:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/hsg-ai
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

3. قم بتشغيل السيرفر:
```bash
npm start
```

## المميزات

- نظام تسجيل دخول آمن
- تشفير كلمات المرور
- تتبع تاريخ كلمات المرور
- حماية من هجمات Brute Force
- ضغط الاستجابات
- معالجة الأخطاء
- دعم CORS
- تقييد معدل الطلبات

## المسارات API

### تسجيل مستخدم جديد
```
POST /api/auth/register
Body: { username, password }
```

### تسجيل الدخول
```
POST /api/auth/login
Body: { username, password }
```

### الحصول على معلومات المستخدم
```
GET /api/auth/profile
Header: Authorization: Bearer <token>
```

## الأمان

- تشفير كلمات المرور باستخدام bcrypt
- JWT للمصادقة
- تقييد معدل الطلبات
- رؤوس HTTP آمنة
- حماية من هجمات CORS 