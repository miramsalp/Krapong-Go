const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.post('/', protect, restrictTo('driver'), vehicleController.registerVehicle);

module.exports = router;