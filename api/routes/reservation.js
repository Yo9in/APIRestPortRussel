var express = require('express');


var router = express.Router();

const service = require('../services/reservation');


  

router.get('/catways/:id/reservations', service.getAll);

router.get('/catways/:id/reservations/:ReservationId', service.getById);

router.post('/catways/:id/reservations',  service.add);
console.log("📥 Route POST /catways/:id/reservations enregistrée");


router.patch('/catways/:id/reservations/:ReservationId', service.update);

router.delete('/catways/:id/reservations/:ReservationId', service.delete);

module.exports = router;
