const router = require('express').Router();

const publicController = require('../controllers/publicAPI/publicController');
const brandController = require('../controllers/services/brandController');
const vehicleController = require('../controllers/services/vehicleController');

router.route('/callMe').post(publicController.callMe);

router.route('/brand').get(brandController.getAllInArray);

router.route('/vehicle').get(vehicleController.getAll);
router.route('/vehicle/:id').get(vehicleController.get);

module.exports = router;
