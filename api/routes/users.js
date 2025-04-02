var express = require('express');
var router = express.Router();

const service = require('../services/users');

const private = require('../middlewares/private');
  
router.get('/', private.checkJWT, service.getAll); // ← affiche tous les utilisateurs


router.get('/:id', private.checkJWT, service.getById);

router.post('/', service.add);

router.patch('/:id', private.checkJWT, service.update);

router.delete('/:email', private.checkJWT, service.delete);

router.post('/authenticate', service.authenticate);


module.exports = router;
