const axios = require('axios');
const { BookingRepository } = require('../repositories');
const db = require('../models');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');
const { FLIGHT_SERVICE_URL } = require('../config/server-config');
const bookingRepository = new BookingRepository();
async function createBooking(data) {
  console.log('data', data);
  const transaction = await db.sequelize.transaction();
  try {
    const flight = await axios.get(
      `${FLIGHT_SERVICE_URL}/api/v1/flights/${data.flightId}`
    );
    if (data.noOfSeats > flight.data.data.totalSeats) {
      throw new AppError(
        'Required Number Of Seats Not Available',
        StatusCodes.BAD_REQUEST
      );
    }
    const totalBill = flight.data.data.price * data.noOfSeats;
    const bookingPayload = { ...data, totalCost: totalBill };
    const booking = await bookingRepository.create(bookingPayload, transaction);
    await axios.patch(
      `${FLIGHT_SERVICE_URL}/api/v1/flights/${data.flightId}/seats`,
      { seats: data.noOfSeats }
    );
    await transaction.commit();
    return booking;
  } catch (error) {
    console.log('Error in booking-service', error);
    await transaction.rollback();

    throw new AppError('Transaction Failed', StatusCodes.BAD_REQUEST);
  }
}
module.exports = { createBooking };
