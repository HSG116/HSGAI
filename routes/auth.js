const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'اسم المستخدم موجود بالفعل' });
        }

        // Create new user
        const user = new User({
            username,
            password,
            createdAt: new Date()
        });

        // Save user to database
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'تم إنشاء الحساب بنجاح',
            token,
            user: {
                username: user.username,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'حدث خطأ أثناء إنشاء الحساب' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'تم تسجيل الدخول بنجاح',
            token,
            user: {
                username: user.username,
                lastLogin: user.lastLogin
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'حدث خطأ أثناء تسجيل الدخول' });
    }
});

// Middleware to verify JWT token
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.userId });

        if (!user) {
            throw new Error();
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'يرجى تسجيل الدخول' });
    }
};

// Get user profile
router.get('/profile', auth, async (req, res) => {
    try {
        res.json({
            username: req.user.username,
            createdAt: req.user.createdAt,
            lastLogin: req.user.lastLogin
        });
    } catch (error) {
        res.status(500).json({ message: 'حدث خطأ أثناء جلب بيانات المستخدم' });
    }
});

module.exports = router; 