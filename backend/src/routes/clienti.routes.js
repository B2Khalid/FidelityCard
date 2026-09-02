const router = require('express').Router();
const controller = require('../controllers/clientiController');

router.get('/', controller.getAllClienti);
router.get('/tiers', controller.getTiers);
router.get('/:id', controller.getCliente);
router.post('/:id/transazioni', controller.postTransazione);

module.exports = router;
