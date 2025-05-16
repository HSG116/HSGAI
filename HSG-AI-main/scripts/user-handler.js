import users from './users.js';

class UserHandler {
    constructor() {
        this.users = users;
    }

    // البحث عن مستخدم
    findUser(username) {
        return this.users.find(user => user.username === username);
    }

    // التحقق من صحة بيانات تسجيل الدخول
    verifyCredentials(username, password) {
        const user = this.findUser(username);
        return user && user.password === password;
    }

    // إضافة مستخدم جديد
    addUser(userData) {
        if (this.findUser(userData.username)) {
            throw new Error('اسم المستخدم موجود بالفعل');
        }
        this.users.push(userData);
        return true;
    }

    // تحديث بيانات المستخدم
    updateUser(username, newData) {
        const userIndex = this.users.findIndex(user => user.username === username);
        if (userIndex === -1) {
            throw new Error('المستخدم غير موجود');
        }
        this.users[userIndex] = { ...this.users[userIndex], ...newData };
        return true;
    }

    // حذف مستخدم
    deleteUser(username) {
        const userIndex = this.users.findIndex(user => user.username === username);
        if (userIndex === -1) {
            throw new Error('المستخدم غير موجود');
        }
        this.users.splice(userIndex, 1);
        return true;
    }
}

export default UserHandler; 