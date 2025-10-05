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

// @desc    Update location for the current driver's vehicle
// @route   PATCH /api/vehicles/my-vehicle/location
// @access  Private (Driver only)
exports.updateMyVehicleLocation = async (req, res) => {
    try {
        const { longitude, latitude } = req.body;
        
        const vehicle = await Vehicle.findOne({ driverId: req.user.id });
        if (!vehicle) {
            return res.status(404).json({ message: 'ไม่พบรถของคุณ กรุณาลงทะเบียนรถก่อน' });
        }

        vehicle.location = {
            type: 'Point',
            coordinates: [longitude, latitude]
        };
        await vehicle.save();

        const io = req.app.get('socketio');
        io.to(vehicle.routeId.toString()).emit('vehicleLocationUpdate', {
            vehicleId: vehicle._id,
            location: vehicle.location
        });

        res.status(200).json({
            status: 'success',
            data: {
                location: vehicle.location
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update status for the current driver's vehicle
// @route   PATCH /api/vehicles/my-vehicle/status
// @access  Private (Driver only)
exports.updateMyVehicleStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['offline', 'waiting-at-depot', 'en-route'].includes(status)) {
            return res.status(400).json({ message: 'สถานะไม่ถูกต้อง' });
        }
        
        const vehicle = await Vehicle.findOneAndUpdate(
            { driverId: req.user.id }, 
            { status: status }, 
            { new: true, runValidators: true } 
        );

        if (!vehicle) {
            return res.status(404).json({ message: 'ไม่พบรถของคุณ' });
        }
        
        const io = req.app.get('socketio');
        io.to(vehicle.routeId._id.toString()).emit('vehicleStatusChanged', vehicle);

        res.status(200).json({
            status: 'success',
            data: {
                status: vehicle.status
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all active vehicles on a specific route
// @route   GET /api/vehicles?routeId=...
// @access  Public
exports.getActiveVehiclesOnRoute = async (req, res) => {
    try {
        const { routeId } = req.query;
        if (!routeId) {
            return res.status(400).json({ message: 'กรุณาระบุสายรถ' });
        }

        const vehicles = await Vehicle.find({
            routeId: routeId,
            status: 'en-route'
        });

        res.status(200).json({
            status: 'success',
            results: vehicles.length,
            data: {
                vehicles
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get the vehicle for the current logged in driver
// @route   GET /api/vehicles/my-vehicle
// @access  Private (Driver only)
exports.getMyVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findOne({ driverId: req.user.id });
        if (!vehicle) {
            return res.status(404).json({ message: 'No vehicle registered for this driver.' });
        }
        res.status(200).json({ status: 'success', data: { vehicle } });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};