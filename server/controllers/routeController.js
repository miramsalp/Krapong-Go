const Route = require('../models/Route');

// @desc    Get all routes
// @route   GET /api/routes
// @access  Public
exports.getAllRoutes = async (req, res) => {
    try {
        const routes = await Route.find();
        res.status(200).json({
            status: 'success',
            results: routes.length,
            data: {
                routes
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create a new route
// @route   POST /api/routes
// @access  Private 
exports.createRoute = async (req, res) => {
    try {
        const { routeName, description } = req.body;
        const newRoute = await Route.create({ routeName, description });
        res.status(201).json({
            status: 'success',
            data: {
                route: newRoute
            }
        });
    } catch (error) {
        res.status(400).json({ message: 'Invalid data sent', error: error.message });
    }
};