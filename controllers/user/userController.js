// Import of Image editing methods and saving methods  🟥 🟥 🟥 >> NOTE : Commented Code is Image file upload code which is not yet Implemented
// const multer = require('multer');
// const sharp = require('sharp');

// User Model Imports --------------------------------
const User = require('../../models/user/userModel');
const ActivityData = require('../../models/user/userActivityDataModel');

// Ulitiles import (for details go their respective files to read about in detail)
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const factory = require('../handlerFactory');

// Importing Model for logging purposes
const UserActivityData = require('../../models/user/userActivityDataModel');

// using multer to save image and cropping it
// const multerStorage = multer.memoryStorage();

// const multerFilter = (req, file, cb) => {
// 	if (file.mimetype.startsWith('image')) {
// 		cb(null, true);
// 	} else {
// 		cb(new AppError('Not an image! Please upload only images.', 400), false);
// 	}
// };

// const upload = multer({
// 	storage: multerStorage,
// 	fileFilter: multerFilter,
// });

// exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
	if (!req.file) return next();

	req.file.filename = `${req.user.role}-${req.user.id}-${Date.now()}.jpeg`;

	// await sharp(req.file.buffer).resize(100, 100).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`client/public/images/users/${req.file.filename}`);

	next();
});

// Filtered out unwanted fields names that are not allowed to be updated 🎃
const filterObj = (obj, ...allowedFields) => {
	const newObj = {};
	Object.keys(obj).forEach((el) => {
		if (allowedFields.includes(el)) newObj[el] = obj[el];
	});
	return newObj;
};

exports.getMe = (req, res, next) => {
	req.params.id = req.user.id;
	next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
	// 1) Create error if user POSTs password data
	if (req.body.password || req.body.passwordConfirm) {
		return next(new AppError('This route is not for password updates. Please use /updateMyPassword.', 400));
	}

	// 2) Filtered out unwanted fields names that are not allowed to be updated
	const filteredBody = filterObj(req.body, 'name', 'email');
	if (req.file) filteredBody.photo = req.file.filename;

	// 3) Update user document
	const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
		new: true,
		runValidators: true,
	});

	// Log User timestamp in the database (no need to await this)
	UserActivityData.create({
		user: updatedUser.id,
		name: updatedUser.name,
		email: updatedUser.email,
		role: updatedUser.role,
		activity: 'userDataUpdate',
	});

	res.status(200).json({
		status: 'success',
		data: {
			user: updatedUser,
		},
	});
});

exports.deleteMe = catchAsync(async (req, res, next) => {
	await User.findByIdAndUpdate(req.user.id, { active: false });

	// Log User timestamp in the database (no need to await this)
	UserActivityData.create({
		user: req.user.id,
		name: req.user.name,
		email: req.user.email,
		role: req.user.role,
		activity: 'userDeleted',
	});

	res.status(204).json({
		status: 'success',
		data: null,
	});
});

exports.activateAndDeactivateUser = catchAsync(async (req, res, next) => {
	const active = req.params.activity === 'activate';

	const doc = await User.findByIdAndUpdate(req.params.id, { active: active }).select('+active');
	if (!doc || doc.active === (req.params.activity === 'activate'))
		return next(new AppError(`Nothing to ${req.params.activity === 'activate' ? 'Activate' : 'Deactivate'}`, 404));

	// Log User timestamp in the database (no need to await this)
	UserActivityData.create({
		user: req.user.id,
		name: req.user.name,
		email: req.user.email,
		role: req.user.role,
		activity: req.params.activity === 'activate' ? 'userActivated' : 'userDeactivated',
	});

	res.status(200).json({
		status: 'success',
		doc,
		data: `user : ${req.params.activity === 'activate' ? 'Activated' : 'Deactivated'}`,
	});
});

exports.getCount = factory.getAllCounter(User);

exports.getCountByRole = catchAsync(async (req, res, next) => {
	// 1 intitializing variables
	const rolesToCount = ['admin', 'superAdmin', 'user'];
	const query = req.params.role;

	// 2 Checking if the input is correct
	if (!rolesToCount.includes(query)) return next(new AppError('Unable to Count', 400));

	// 3 Getting Count of Documents
	const queryObj = { role: query };
	let doc = await User.countDocuments(queryObj);

	// 4 Checking if doc is empty
	if (!doc) {
		doc = 0;
	}

	// 5 send response
	res.status(200).json({
		status: 'success',
		count: doc,
	});
});

exports.getAllUsersIncludingInactive = factory.getAllIncludingInactive(User);

// Creating New User Employee or Administrator (this is done by super administrator)
exports.createUser = factory.createOne(User);

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
exports.getUserCounter = factory.getAllCounter(User);

exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

// shows all timestamps of users and admin logins
exports.activitydata = factory.getAll(ActivityData);
exports.activitydataCounter = factory.getAllCounter(ActivityData);
