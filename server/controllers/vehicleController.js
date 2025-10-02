const Vehicle = require('../models/Vehicle');

// @desc    Register a vehicle for the current driver
// @route   POST /api/vehicles
// @access  Private (Driver only)
exports.registerVehicle = async (req, res) => {
    try {
        const { licensePlate, routeId } = req.body;
        
        const driverId = req.user.id;

        const existingVehicle = await Vehicle.findOne({ driverId });
        if(existingVehicle) {
            return res.status(400).json({ message: 'คุณได้ลงทะเบียนรถไปแล้ว' });
        }

        const newVehicle = await Vehicle.create({
            licensePlate,
            routeId,
            driverId
        });

        res.status(201).json({
            status: 'success',
            data: {
                vehicle: newVehicle
            }
        });

    } catch (error) {
        res.status(400).json({ message: 'Invalid data sent', error: error.message });
    }
};