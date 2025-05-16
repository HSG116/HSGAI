// بيانات المستخدمين المخزنة بشكل آمن
const users = [
    {
        username: "admin",
        password: "admin123", // في التطبيق الحقيقي يجب تشفير كلمة المرور
        createdAt: "2024-01-01T00:00:00.000Z"
    }
];

// تصدير البيانات للاستخدام في الملفات الأخرى
export default users; 