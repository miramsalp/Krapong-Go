const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.route('/').post(protect, restrictTo('driver'), vehicleController.registerVehicle).get(vehicleController.getActiveVehiclesOnRoute); 

router.patch('/my-vehicle/location', protect, restrictTo('driver'), vehicleController.updateMyVehicleLocation);
router.patch('/my-vehicle/status', protect, restrictTo('driver'), vehicleController.updateMyVehicleStatus);

module.exports = router;