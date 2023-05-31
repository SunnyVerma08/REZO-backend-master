// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// const catchAsync = require('../utils/catchAsync');
// const Project = require('../models/Projects');
// const User = require('../models/User');
const Booking = require('../models/services/bookingModel');
// // const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// // model import
// const PaidProject = require('../models/PaidProjectForStudent');

// exports.getCheckoutSession = catchAsync(async (req, res, next) => {
// 	// 1 get the current project to be booked
// 	const project = await Project.findById(req.params.projectId);

// 	// 2 create checkout session
// 	const session = await stripe.checkout.sessions.create({
// 		payment_method_types: ['card'],
// 		// success_url: `${req.protocol}://${req.get('host')}/?project=${req.params.projectId}&user=${req.user.id}&price=${project.price}`,
// 		success_url: `https://taghunger.com/success`,
// 		cancel_url: `https://taghunger.com/cancel`,
// 		customer_email: req.user.email,
// 		client_reference_id: req.params.projectId,
// 		line_items: [
// 			{
// 				name: `${project.title} Project`,
// 				description: project.description,
// 				images: [
// 					`https://s3.ap-southeast-1.amazonaws.com/storage.collegey/static/1628514354307-Collegey_Logo_Blue%5B1%5D.png`,
// 				],
// 				amount: project.projectPrice.amount * 100,
// 				currency: 'inr',
// 				quantity: 1,
// 			},
// 		],
// 	});
// 	//  3 create session as response
// 	res.status(200).json({
// 		status: 'success',
// 		session,
// 	});
// });

// // exports.createBookingCheckout = catchAsync(async (req, res, next) => {
// // 	const { project, user, price } = req.query;

// // 	if (!project && !user && !price) return next();
// // 	await Booking.create({ project, user, price });

// // 	res.redirect(req.originalUrl.split('?')[0]);
// // });
// const createBookingCheckout = async session => {
// 	const project = session.client_reference_id;
// 	const user = (await User.findOne({ email: session.customer_email })).id;
// 	const price = session.amount_total / 100;
// 	const paid = true;
// 	await Booking.create({ project, user, price, paid });

// 	// 0 create user document if user has paid
// 	const id = project;
// 	const loggedInUserID = user;

// 	// 4 check if the user paid Database Exist
// 	const checkDocumentExist = await PaidProject.find({ user: loggedInUserID }).countDocuments();
// 	if (checkDocumentExist === 0) {
// 		// if it doesn't exist, then create a paid'
// 		await PaidProject.create({ user: loggedInUserID, paidProject: [] });
// 	}
// 	// add the id of the project you want to watch
// 	const query = {
// 		user: loggedInUserID,
// 	};

// 	const update = {
// 		$addToSet: { paidProject: { project: id } },
// 	};

// 	// Query One execution
// 	await PaidProject.findOneAndUpdate(query, update, {
// 		new: true,
// 		runValidators: true,
// 	});
// };

// exports.webhookCheckout = catchAsync(async (req, res, next) => {
// 	const signature = req.headers['stripe-signature'];
// 	let event;
// 	try {
// 		event = stripe.webhooks.constructEvent(
// 			req.body,
// 			signature,
// 			process.env.STRIPE_WEBHOOK_SECRET_KEY
// 		);
// 	} catch (err) {
// 		return res.status(400).send('webhook error', err.message);
// 	}

// 	if (event.type === 'checkout.session.completed') {
// 		createBookingCheckout(event.data.object);

// 		res.status(200).json({ recieved: true });
// 	} else res.status(200).json({ recieved: false });
// });

// using default factory functions

exports.getAllBookings = factory.getAll(Booking);
exports.getAllBookingCounter = factory.getAllCounter(Booking);
exports.getBooking = factory.getOne(Booking);
exports.createBooking = factory.createOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
