const express = require('express');

const { InfoController } = require('../../controllers');
const BookingRoutes = require('./booking');
const router = express.Router();

router.get('/info', InfoController.info);
router.use('/booking', BookingRoutes);
module.exports = router;
