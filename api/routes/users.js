var express = require('express');
var router = express.Router();

const service = require('../services/users');

router.get('/:id', service.getById);

router.put('/add', service.add);

router.patch('/:id', service.update);

router.delete('/:id', service.delete);

router.post('/authenticate', service.authenticate);


module.exports = router;
