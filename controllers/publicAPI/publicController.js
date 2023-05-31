// models mongoDB
const callMe = require('../../models/publicAPI/callMeModel');

// using default factory functions
// const factory = require('../handlerFactory');

// Utility Functions
const checkIndianPhoneNumber = require('../../utils/functions/IndianPhoneNumberCheck');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

exports.callMe = catchAsync(async (req, res, next) => {
	// destrcturing the req.body
	const { phone, name, remarks } = req.body;

	// phone number check
	const checkedPhone = checkIndianPhoneNumber(phone);
	if (!checkedPhone) {
		return next(new AppError('🙅‍♀️🙅‍♂️🚫⛔ Invalid Phone Number ⛔🚫🙅‍♂️🙅‍♀️', 400));
	}
	const doc = await callMe.create({ phone: checkedPhone, name, remarks });
	res.status(201).json({
		status: 'success',
		data: doc,
	});
});
