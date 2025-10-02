const express = require("express");
const cors = require("cors");
const app = express();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); 

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to Krapong-Go API!" });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

module.exports = app;
