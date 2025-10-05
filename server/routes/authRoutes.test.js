const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); 
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
});

beforeEach(async () => {
    await User.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});


describe('POST /api/auth/register', () => {
    
    it('ควรจะสมัครสมาชิกผู้ใช้ใหม่ได้สำเร็จ', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                password: 'password123',
                role: 'passenger',
            });
        
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('token');
    });

    it('ควรจะสมัครสมาชิกล้มเหลวถ้ามีชื่อผู้ใช้นี้อยู่แล้ว', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({ username: 'existinguser', password: 'password123', role: 'passenger' });

        const response = await request(app)
            .post('/api/auth/register')
            .send({ username: 'existinguser', password: 'newpassword', role: 'driver' });
        
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('ชื่อผู้ใช้นี้ถูกใช้ไปแล้ว');
    });
});