const mongoose = require('mongoose');

const PING_LIFESPAN_SECONDS = 5 * 60;

const pingSchema = new mongoose.Schema({
    passengerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    routeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: PING_LIFESPAN_SECONDS
    }
});

pingSchema.index({ routeId: 1 });

const Ping = mongoose.model('Ping', pingSchema);
module.exports = Ping;