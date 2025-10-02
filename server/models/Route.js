const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
    routeName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    }
}, { timestamps: true });

const Route = mongoose.model('Route', routeSchema);
module.exports = Route;