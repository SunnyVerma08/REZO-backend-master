const router = require('express').Router();

const bookingController = require('../controllers/bookingController');
const factory = require('../controllers/handlerFactory');
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

router
	.route('/')
	.get(bookingController.getAllBookings)
	.post(factory.attachUserIdToObj('user'), bookingController.createBooking);

router
	.route('/:id')
	.get(bookingController.getBooking)
	.patch(bookingController.updateBooking)
	.delete(bookingController.deleteBooking);

router.route('/count/data').get(bookingController.getAllBookingCounter);

module.exports = router;
