var express = require('express');
var router = express.Router();

const userRoute = require('../routes/users');
const catwayRoute = require('../routes/catways');
const reservationRoute = require('../routes/reservation');
const dashboardRoute = require('../routes/dashboard');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Acceuil'});
});

router.use('/users', userRoute);
router.use('/catways', catwayRoute);
router.use('/catways', reservationRoute);
router.use('/dashboard', dashboardRoute);



module.exports = router;
