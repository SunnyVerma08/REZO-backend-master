const router = require('express').Router();

const servicesController = require('../../controllers/services/geoLocationController');

// get location data from corordinate system
router.route('/').post(servicesController.getLocation);

// get nearest workshop locations
router.route('/workshopNearMe').post(servicesController.getNearestLocation);

module.exports = router;
