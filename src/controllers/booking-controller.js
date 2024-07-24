const { StatusCodes } = require('http-status-codes');
const { BookingService } = require('../services/index');
const { SuccessResponse, ErrorResponse } = require('../utils/common/index');
const createBooking = async (req, res) => {
  try {
    const booking = await BookingService.createBooking({
      userId: req.body.userId,
      flightId: req.body.flightId,
      noOfSeats: req.body.noOfSeats,
    });
    SuccessResponse.data = booking;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    console.log('Error in booking-controller', error);
    ErrorResponse.error = error;
    throw res.status(error.statusCode).json(ErrorResponse);
  }
};

module.exports = {
  createBooking,
};
