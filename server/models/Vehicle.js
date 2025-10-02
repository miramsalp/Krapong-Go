// models/Vehicle.js
const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    routeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
        required: true
    },
    licensePlate: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['offline', 'waiting-at-depot', 'en-route'],
        default: 'offline'
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], 
            index: '2dsphere' 
        }
    }
}, { timestamps: true });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
module.exports = Vehicle;