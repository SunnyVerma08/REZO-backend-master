const router = require('express').Router();

const servicesController = require('../../controllers/services/vehicleController');
const authController = require('../../controllers/user/userAuthController');

// Protect all routes after this middleware
// 👇 comment the below line and uncomment the next line to bypass following routes without login
router.use(authController.protect);
// router.use((req, res, next) => {
// 	console.log(
// 		'🟥 protecting routes bypass is activated => file userRouter.js line 20'
// 	);
// 	next();
// });
/*-----------------------------------------------------
 *  ADMIN:  --- All admin path below ------------------
 */

// 👇 comment the below line and uncomment the next line to bypass admin routes without login
router.use(authController.restrictTo('admin', 'superAdmin'));
// router.use((req, res, next) => {
// 	console.log(
// 		'🟥 admin routes bypass is activated => file userRouter.js line 49'
// 	);
// 	next();
// });

// call me routes
router
	.route('/')
	.get(servicesController.getAll)
	.post(servicesController.create);

router
	.route('/:id')
	.get(servicesController.get)
	.patch(servicesController.update)
	.delete(servicesController.delete);

router.route('/count/data').get(servicesController.getAllCounter);

module.exports = router;
