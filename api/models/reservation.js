const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  ReservationId: { type: Number, required: true, unique: true,},
  catwayNumber: { type: Number, required: true },
  clientName: { type: String, required: true },
  boatName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true }
});

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation; 