const express = require('express');
const router = express.Router();
const pingController = require('../controllers/pingController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.get('/', protect, restrictTo('driver'), pingController.getPingsOnRoute);
router.post('/', protect, restrictTo('passenger'), pingController.createPing);
router.route('/my-ping').get(protect, restrictTo('passenger'), pingController.getMyPing) .delete(protect, restrictTo('passenger'), pingController.deleteMyPing);

module.exports = router;