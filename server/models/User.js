const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'กรุณาตั้งชื่อผู้ใช้'],
        unique: true,
        lowercase: true,
        trim: true,
        minlength: 3
    },
    password: {
        type: String,
        required: [true, 'กรุณาตั้งรหัสผ่าน'],
        minlength: 6,
        select: false 
    },
    role: {
        type: String,
        enum: ['passenger', 'driver'],
        default: 'passenger'
    }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;