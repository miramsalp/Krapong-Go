const mongoose = require('mongoose');

const PIN_LIFESPAN_MS = 1 * 60 * 1000; 

const pinSchema = new mongoose.Schema({
    latitude: { 
        type: Number,
        required: true 
    },
    longitude: { 
        type: Number, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    expiresAt: { 
        type: Date, 
        required: true 
    },
    is_active: { 
        type: Boolean, 
        default: true 
    }
});

pinSchema.methods.toClientFormat = function() {
    return {
        id: this._id.toString(), 
        lat: this.latitude,
        lon: this.longitude,
        createdAt: this.createdAt.getTime(), 
        expiresAt: this.expiresAt.getTime(), 
        isActive: this.is_active
    };
};

const Pin = mongoose.model('Pin', pinSchema);

module.exports = Pin;
