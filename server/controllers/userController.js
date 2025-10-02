const User = require('../models/User');

// @desc    Get current logged in user
// @route   GET /api/users/me
// @access  Private 
exports.getMe = (req, res, next) => {
    const { _id, username, role } = req.user;
    res.status(200).json({
        id: _id,
        username,
        role
    });
};