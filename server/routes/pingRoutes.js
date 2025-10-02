const express = require('express');
const router = express.Router();
const pingController = require('../controllers/pingController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.get('/', protect, restrictTo('driver'), pingController.getPingsOnRoute);
router.post('/', protect, restrictTo('passenger'), pingController.createPing);
router.delete('/my-ping', protect, restrictTo('passenger'), pingController.deleteMyPing);

module.exports = router;