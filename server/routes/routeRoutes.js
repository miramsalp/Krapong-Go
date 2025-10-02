const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').get(routeController.getAllRoutes).post(protect, routeController.createRoute);

module.exports = router;