const router = require('express').Router();

const adminPublicController = require('../controllers/publicAPI/admin/adminPublicController');
const authController = require('../controllers/user/userAuthController');

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
	.route('/callMe/')
	.get(adminPublicController.getAll)
	.post(adminPublicController.create);

router
	.route('/callMe/:id')
	.get(adminPublicController.get)
	.patch(adminPublicController.update)
	.delete(adminPublicController.delete);

router.route('/callMe/count/data').get(adminPublicController.getAllCounter);

module.exports = router;
