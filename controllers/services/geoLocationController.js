/* eslint-disable no-restricted-globals */
const catchAsync = require('../../utils/catchAsync');
const geoLocation = require('../../utils/geoLocationAPI');
const AppError = require('../../utils/appError');

const User = require('../../models/user/userModel');

exports.getLocation = catchAsync(async (req, res, next) => {
	const { lat, lng } = req.body;

	if (!(isFinite(lat) && Math.abs(lat) <= 90 && isFinite(lng) && Math.abs(lng) <= 180)) return next(new AppError('Invalid location', 400));

	const result = await geoLocation.getLocation(lat, lng);

	// SEND RESPONSE
	res.status(200).json({
		status: 'success',
		data: result.data.data,
	});
});

exports.getNearestLocation = catchAsync(async (req, res, next) => {
	const { distance = 10, lat, lng } = req.body;

	console.log({ distance, lat, lng });

	if (!(isFinite(lat) && Math.abs(lat) <= 90 && isFinite(lng) && Math.abs(lng) <= 180))
		next(new AppError('Please provide latitude and longitude in the correct format', 400));

	const radius = distance / 6378.1;

	const result = await User.find({ location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }, role: 'workshop' });

	// SEND RESPONSE
	res.status(200).json({
		status: 'success',
		data: result,
	});
});
