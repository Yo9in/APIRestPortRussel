var express = require('express');


var router = express.Router();

const service = require('../services/reservation');

const private = require('../middlewares/private');


  

router.get('/', service.getAllAll);

router.get('/catways/:id/reservations/:ReservationId', private.checkJWT, service.getById);

router.post('/catways/:id/reservations' ,private.checkJWT,  service.add);



router.patch('/catways/:id/reservations/:ReservationId',private.checkJWT, service.update);

router.delete('/catways/:id/reservations/:ReservationId',private.checkJWT, service.delete);

module.exports = router;
