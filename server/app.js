const express = require("express");
const cors = require("cors");
const app = express();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); 
const routeRoutes = require('./routes/routeRoutes'); 
const vehicleRoutes = require('./routes/vehicleRoutes');
const pingRoutes = require('./routes/pingRoutes'); 

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to Krapong-Go API!" });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/routes', routeRoutes); 
app.use('/api/vehicles', vehicleRoutes); 
app.use('/api/pings', pingRoutes);

module.exports = app;
