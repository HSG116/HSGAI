// التحقق من حالة تسجيل الدخول
function checkAuth() {
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) {
        // إذا لم يكن المستخدم مسجل الدخول، قم بتوجيهه إلى صفحة تسجيل الدخول
        window.location.href = 'login/l0gin.html';
    }
}

// تنفيذ التحقق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', checkAuth);