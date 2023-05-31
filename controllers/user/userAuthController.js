/* eslint-disable no-nested-ternary */
const crypto = require('crypto');

// promisify for token verification
const { promisify } = require('util');

// JWT for stateless applications
const jwt = require('jsonwebtoken');

// Model Imports (only models that have login and passwords 🔐)
const User = require('../../models/user/userModel');

// Ulitiles import (for details go their respective files to read about in detail)
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const checkIndianPhoneNumber = require('../../utils/functions/IndianPhoneNumberCheck');

// Importing Model for logging purposes
const UserActivityData = require('../../models/user/userActivityDataModel');

// Email function is not yet made, will make it and implement it later  🟥 🟥 🟥

const signToken = (id) =>
	jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});

const createSendToken = (user, statusCode, req, res) => {
	const token = signToken(user._id);

	res.cookie('jwt', token, {
		expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
		httpOnly: true,
		secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
	});

	// Remove password from output
	user.password = undefined;
	res.status(statusCode).json({
		status: 'success',
		token,
		data: {
			user,
		},
	});
};

exports.signup = catchAsync(async (req, res, next) => {
	// getting data from body
	// : TODO:  Email to be added later
	const { name, phone, password, passwordConfirm } = req.body;

	if (
		name === undefined ||
		name === '' ||
		phone === undefined ||
		phone === '' ||
		// username === undefined ||
		// username === '' ||
		password === undefined ||
		password === '' ||
		passwordConfirm === undefined ||
		passwordConfirm === ''
	) {
		return next(
			new AppError( // The code contains the ternary operator and is just used as if else block
				`🙅‍♀️🙅‍♂️🚫⛔ Please provide ${
					name === undefined || name === ''
						? 'name'
						: phone === undefined || phone === ''
						? 'correct phone number'
						: password === undefined || password === ''
						? 'Please enter your password'
						: passwordConfirm === undefined || passwordConfirm === ''
						? 'Something went wrong with password confirmation'
						: 'God'
				}! ⛔🚫🙅‍♂️🙅‍♀️`,
				400
			)
		);
	}

	// phone number check
	const checkedPhone = checkIndianPhoneNumber(phone);
	if (!checkedPhone) {
		return next(new AppError('🙅‍♀️🙅‍♂️🚫⛔ Invalid Phone Number ⛔🚫🙅‍♂️🙅‍♀️', 400));
	}

	// create mongoDB new document with body data
	const newUser = await User.create({
		name,
		phone,
		password,
		passwordConfirm,
	});

	// Send welcome email to new user
	// const url = `${req.protocol}://${req.get('host')}/me`;
	// console.log(url);
	// await new Email(newUser, url).sendWelcome();

	// Log User timestamp in the database (no need to await this)
	UserActivityData.create({
		user: newUser.id,
		name: newUser.name,
		phone: newUser.phone,
		role: newUser.role,
		activity: 'newUser',
	});

	createSendToken(newUser, 201, req, res);
});

exports.signupWorkshop = catchAsync(async (req, res, next) => {
	// getting data from body
	// : TODO:  Email to be added later
	const { name, phone, password, passwordConfirm } = req.body;

	if (
		name === undefined ||
		name === '' ||
		phone === undefined ||
		phone === '' ||
		// username === undefined ||
		// username === '' ||
		password === undefined ||
		password === '' ||
		passwordConfirm === undefined ||
		passwordConfirm === ''
	) {
		return next(
			new AppError( // The code contains the ternary operator and is just used as if else block
				`🙅‍♀️🙅‍♂️🚫⛔ Please provide ${
					name === undefined || name === ''
						? 'name'
						: phone === undefined || phone === ''
						? 'correct phone number'
						: password === undefined || password === ''
						? 'Please enter your password'
						: passwordConfirm === undefined || passwordConfirm === ''
						? 'Something went wrong with password confirmation'
						: 'God'
				}! ⛔🚫🙅‍♂️🙅‍♀️`,
				400
			)
		);
	}

	// phone number check
	const checkedPhone = checkIndianPhoneNumber(phone);
	if (!checkedPhone) {
		return next(new AppError('🙅‍♀️🙅‍♂️🚫⛔ Invalid Phone Number ⛔🚫🙅‍♂️🙅‍♀️', 400));
	}

	// create mongoDB new document with body data
	const newUser = await User.create({
		name,
		phone,
		password,
		passwordConfirm,
		role: 'workshop',
	});

	// Send welcome email to new user
	// const url = `${req.protocol}://${req.get('host')}/me`;
	// console.log(url);
	// await new Email(newUser, url).sendWelcome();

	// Log User timestamp in the database (no need to await this)
	UserActivityData.create({
		user: newUser.id,
		name: newUser.name,
		phone: newUser.phone,
		role: newUser.role,
		activity: 'newUser',
	});

	createSendToken(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
	const { phone, password } = req.body;

	// 1) Check if phone and password exist
	if (!phone || !password) {
		return next(new AppError('Please provide correct Phone and Password', 400));
	}
	// // 2) Check if user exists && password is correct
	// let user;
	// if (email.includes('@')) {
	const user = await User.findOne({ phone }).select('+password');
	// } else {
	// 	user = await User.findOne({ username: email }).select('+password');
	// }

	if (user.active === false) {
		return next(new AppError('Account is not active', 401));
	}
	if (!user || !(await user.correctPassword(password, user.password))) {
		return next(new AppError('Incorrect email or password', 401));
	}

	// Log User timestamp in the database (no need to await this)
	UserActivityData.create({
		user: user.id,
		name: user.name,
		phone: user.phone,
		role: user.role,
		activity: 'login',
	});

	// 3) If everything ok, send token to client
	createSendToken(user, 200, req, res);
});

exports.logout = (req, res) => {
	res.cookie('jwt', '', {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	});

	// Log User timestamp in the database (no need to await this)
	UserActivityData.create({
		user: req.user.id,
		name: req.user.name,
		phone: req.user.phone,
		role: req.user.role,
		activity: 'logout',
	});

	res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
	// 1) Getting token and check of it's there
	let token;

	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1];
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}

	if (!token) {
		return next(new AppError('You are not logged in! Please log in to get access.', 401));
	}

	// 2) Verification token {promisify for faster result} and error catching
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

	// 3) Check if user still exists
	const currentUser = await User.findById(decoded.id);
	if (!currentUser) {
		return next(new AppError('The user no longer exist.', 401));
	}

	// 4) Check if user changed password after the token was issued
	if (currentUser.changedPasswordAfter(decoded.iat)) {
		return next(new AppError('User recently changed password! Please log in again.', 401));
	}

	// GRANT ACCESS TO PROTECTED ROUTE
	req.user = currentUser;
	res.locals.user = currentUser;
	next();
});

// This Function is used to check roles of all the users when specified
exports.restrictTo =
	(...roles) =>
	(req, res, next) => {
		// roles ['admin', 'user']. role='user'
		if (!roles.includes(req.user.role)) {
			return next(new AppError('You do not have permission to perform this action', 403));
		}

		next();
	};

exports.forgotPassword = catchAsync(async (req, res, next) => {
	// 1) Get user based on POSTed email
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		return next(new AppError('There is no user with email address.', 404));
	}

	// 2) Generate the random reset token
	const resetToken = user.createPasswordResetToken();
	await user.save({ validateBeforeSave: false });

	// 3) Send it to user's email
	try {
		// const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/auth/resetPassword/${resetToken}`;

		// send user email for reseting password
		// await new Email(user, resetURL).sendPasswordReset();

		res.status(200).json({
			status: 'success',
			message: 'Token sent to email!',
			// Reset Url Response to be removed in production : TODO: -
			resetURL: process.env.NODE_ENV === 'development' ? `${resetToken}` : 'Reset Token is Send on Email',
		});
	} catch (err) {
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: false });

		return next(new AppError('There was an error sending the email. Try again later!'), 500);
	}
});

exports.resetPassword = catchAsync(async (req, res, next) => {
	// 1) Get user based on the token
	const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	});

	// 2) If token has not expired, and there is user, set the new password
	if (!user) {
		return next(new AppError('Token is invalid or has expired', 400));
	}
	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	await user.save();

	// 3) Update changedPasswordAt property for the user
	// shifted to user model pre middleware

	// Log User timestamp in the database (no need to await this)
	UserActivityData.create({
		user: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
		activity: 'passwordReset',
	});

	// 4) Log the user in, send JWT
	createSendToken(user, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
	// 1) Get user from collection
	const user = await User.findById(req.user.id).select('+password');

	// 2) Check if POSTed current password is correct
	if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
		return next(new AppError('Your current password is wrong.', 401));
	}

	// 3) If so, update password
	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	await user.save();
	// User.findByIdAndUpdate will NOT work as intended!

	// Log User timestamp in the database (no need to await this)
	UserActivityData.create({
		user: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
		activity: 'passwordUpdate',
	});

	// 4) Log user in, send JWT
	createSendToken(user, 200, req, res);
});
