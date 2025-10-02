const Ping = require('../models/Ping');
const Vehicle = require('../models/Vehicle');

// @desc    Create a ping for the current passenger
// @route   POST /api/pings
// @access  Private (Passenger only)
exports.createPing = async (req, res) => {
    try {
        const { latitude, longitude, routeId } = req.body;
        const passengerId = req.user.id;

        const existingPing = await Ping.findOne({ passengerId });
        if (existingPing) {
            return res.status(400).json({ message: 'คุณได้ส่งสัญญาณเรียกรถไปแล้ว' });
        }

        const newPing = await Ping.create({
            passengerId,
            routeId,
            location: {
                type: 'Point',
                coordinates: [longitude, latitude]
            }
        });

        res.status(201).json({
            status: 'success',
            data: {
                ping: newPing
            }
        });

    } catch (error) {
        res.status(400).json({ message: 'Invalid data sent', error: error.message });
    }
};

// @desc    Get all pings on the driver's current route
// @route   GET /api/pings
// @access  Private (Driver only)
exports.getPingsOnRoute = async (req, res) => {
    try {
        const vehicle = await Vehicle.findOne({ driverId: req.user.id });
        if (!vehicle) {
            return res.status(404).json({ message: 'คุณยังไม่ได้ลงทะเบียนรถ' });
        }

        const pings = await Ping.find({ routeId: vehicle.routeId });

        res.status(200).json({
            status: 'success',
            results: pings.length,
            data: {
                pings
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


// @desc    Delete the current passenger's ping
// @route   DELETE /api/pings/my-ping
// @access  Private (Passenger only)
exports.deleteMyPing = async (req, res) => {
    try {
        const ping = await Ping.findOneAndDelete({ passengerId: req.user.id });

        if (!ping) {
            return res.status(404).json({ message: 'ไม่พบ Ping ของคุณ' });
        }

        res.status(204).json({
            status: 'success',
            data: null
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};