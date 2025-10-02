const User = require('../models/User');
const jwt = require('jsonwebtoken');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

exports.register = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'ชื่อผู้ใช้นี้ถูกใช้ไปแล้ว' });
        }

        const newUser = await User.create({
            username,
            password,
            role
        });

        const token = signToken(newUser._id);

        res.status(201).json({
            status: 'success',
            token,
            data: {
                userId: newUser._id,
                username: newUser.username
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในระบบ', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' });
        }

        const user = await User.findOne({ username }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
        }

        const token = signToken(user._id);

        res.status(200).json({
            status: 'success',
            token
        });

    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในระบบ', error: error.message });
    }
};