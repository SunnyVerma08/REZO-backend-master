const express = require('express');

// Importing Controllers
const userController = require('../controllers/user/userController');

// Authentication Controller
const authController = require('../controllers/user/userAuthController');

const router = express.Router();

// URL prefix path '/api/v1/users'

router.post('/auth/signup', authController.signup);
router.post('/auth/signupWorkshop', authController.signupWorkshop);
router.post('/auth/login', authController.login);

router.post('/auth/forgotPassword', authController.forgotPassword);
router.patch('/auth/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
// 👇 comment the below line and uncomment the next line to bypass following routes without login
router.use(authController.protect);
// router.use((req, res, next) => {
// 	console.log(
// 		'🟥 protecting routes bypass is activated => file userRouter.js line 20'
// 	);
// 	next();
// });

// logout is in protected route is to make sure logout timestamps are captured perfectly
router.get('/auth/logout', authController.logout);

router.patch('/auth/updateMyPassword', authController.updatePassword);
router.get('/auth/me', userController.getMe, userController.getUser);
router.patch(
	'/auth/updateMe',
	// userController.uploadUserPhoto,
	// userController.resizeUserPhoto,
	userController.updateMe,
);
router.delete('/auth/deleteMe', userController.deleteMe);

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

// shows all timestamps of users and admin logins
router
	.route('/activitydata')
	.get(userController.activitydata)
	.link(userController.activitydataCounter);

// Count Number of Users
router.route('/count').get(userController.getCount);
router.route('/count/:role').get(userController.getCountByRole);

// activate and deactivate User
router.delete('/auth/:activity/:id', userController.activateAndDeactivateUser);

router
	.route('/auth')
	.get(userController.getAllUsers)
	.post(userController.createUser)
	.link(userController.getUserCounter);

router
	.route('/auth/:id')
	.get(userController.getUser)
	.patch(userController.updateUser)
	.delete(userController.deleteUser);

module.exports = router;
