class ExcelHandler {
    constructor() {
        this.initStorage();
    }

    initStorage() {
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify([]));
        }
    }

    saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
        this.updateExcelFile(users);
    }

    getUsers() {
        try {
            return JSON.parse(localStorage.getItem('users')) || [];
        } catch (error) {
            console.error('Error getting users:', error);
            return [];
        }
    }

    addUser(user) {
        const users = this.getUsers();
        users.push({
            ...user,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
        });
        this.saveUsers(users);
    }

    findUser(username) {
        const users = this.getUsers();
        return users.find(u => u.username.toLowerCase() === username.toLowerCase());
    }

    verifyCredentials(username, password) {
        const user = this.findUser(username);
        return user && user.password === password;
    }

    updateUser(username, updates) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
        
        if (index !== -1) {
            users[index] = { ...users[index], ...updates };
            this.saveUsers(users);
            return true;
        }
        return false;
    }

    async updateExcelFile(users) {
        try {
            const ws = XLSX.utils.json_to_sheet(users.map(u => ({
                ...u,
                password: '********' // لا نحفظ كلمات المرور في ملف Excel
            })));
            
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Users');
            
            // حفظ الملف
            XLSX.writeFile(wb, 'users.xlsx');
        } catch (error) {
            console.error('Error updating Excel file:', error);
        }
    }
}

// تصدير الكلاس ليمكن استخدامه في الملفات الأخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExcelHandler;
}