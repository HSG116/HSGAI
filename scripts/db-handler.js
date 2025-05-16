class DBHandler {
    constructor() {
        this.initStorage();
    }

    initStorage() {
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify([]));
        }
        if (!localStorage.getItem('passwordHistory')) {
            localStorage.setItem('passwordHistory', JSON.stringify({}));
        }
    }

    // Hash password using a simple algorithm (in production, use a proper hashing library)
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    }

    getUsers() {
        try {
            return JSON.parse(localStorage.getItem('users')) || [];
        } catch (error) {
            console.error('Error getting users:', error);
            return [];
        }
    }

    getPasswordHistory() {
        try {
            return JSON.parse(localStorage.getItem('passwordHistory')) || {};
        } catch (error) {
            console.error('Error getting password history:', error);
            return {};
        }
    }

    saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    savePasswordHistory(history) {
        localStorage.setItem('passwordHistory', JSON.stringify(history));
    }

    addUser(user) {
        const users = this.getUsers();
        const hashedPassword = this.hashPassword(user.password);
        
        // Add user with hashed password
        users.push({
            ...user,
            id: Date.now().toString(),
            password: hashedPassword,
            createdAt: new Date().toISOString()
        });
        
        // Initialize password history for the user
        const history = this.getPasswordHistory();
        history[user.username] = [{
            password: hashedPassword,
            changedAt: new Date().toISOString()
        }];
        
        this.saveUsers(users);
        this.savePasswordHistory(history);
    }

    findUser(username) {
        const users = this.getUsers();
        return users.find(u => u.username.toLowerCase() === username.toLowerCase());
    }

    verifyCredentials(username, password) {
        const user = this.findUser(username);
        if (!user) return false;
        
        const hashedPassword = this.hashPassword(password);
        return user.password === hashedPassword;
    }

    updateUser(username, updates) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
        
        if (index !== -1) {
            // If password is being updated, hash it and update history
            if (updates.password) {
                const hashedPassword = this.hashPassword(updates.password);
                updates.password = hashedPassword;
                
                // Update password history
                const history = this.getPasswordHistory();
                if (!history[username]) {
                    history[username] = [];
                }
                
                // Add new password to history
                history[username].push({
                    password: hashedPassword,
                    changedAt: new Date().toISOString()
                });
                
                // Keep only last 12 months of password history
                const oneYearAgo = new Date();
                oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
                
                history[username] = history[username].filter(entry => 
                    new Date(entry.changedAt) > oneYearAgo
                );
                
                this.savePasswordHistory(history);
            }
            
            users[index] = { ...users[index], ...updates };
            this.saveUsers(users);
            return true;
        }
        return false;
    }

    getPasswordHistoryForUser(username) {
        const history = this.getPasswordHistory();
        return history[username] || [];
    }
}

export default DBHandler; 