const brandModel = require('../../models/services/brandModel');
const factory = require('../handlerFactory');
const catchAsync = require('../../utils/catchAsync');

exports.getAllInArray = catchAsync(async (req, res, next) => {
	const data = await brandModel.find();

	// SEND RESPONSE
	res.status(200).json({
		status: 'success',
		results: data.length,
		dataArr: data.map((d) => d.name),
		data,
	});
});

// using default factory functions
exports.getAllCounter = factory.getAllCounter(brandModel);
exports.get = factory.getOne(brandModel);
exports.create = factory.createOne(brandModel);
exports.update = factory.updateOne(brandModel);
exports.delete = factory.deleteOne(brandModel);
