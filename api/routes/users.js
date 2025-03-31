var express = require('express');
var router = express.Router();

const service = require('../services/users');

const private = require('../middlewares/private');
  

router.get('/:id', private.checkJWT, service.getById);

router.post('/add', service.add);

router.patch('/:id', private.checkJWT, service.update);

router.delete('/:id', private.checkJWT, service.delete);

router.post('/authenticate', service.authenticate);


module.exports = router;
