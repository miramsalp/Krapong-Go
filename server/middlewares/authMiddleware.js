const jwt = require('jsonwebtoken');
const { promisify } = require('util'); 
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'คุณยังไม่ได้เข้าสู่ระบบ กรุณา login' });
        }

        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({ message: 'ผู้ใช้ที่ถือ Token นี้ไม่มีอยู่ในระบบแล้ว' });
        }

        req.user = currentUser;
        next();

    } catch (error) {
        return res.status(401).json({ message: 'Token ไม่ถูกต้องหรือหมดอายุ', error: error.message });
    }
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // spare 
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: 'คุณไม่มีสิทธิ์ในการเข้าถึงส่วนนี้' 
            });
        }
        next();
    };
};