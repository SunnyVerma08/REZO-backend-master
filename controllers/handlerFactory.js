const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const APIFeaturesCounter = require('../utils/apiFeaturesCounter');

// get loggedInUserID to a variable
exports.attachUserIdToObj = (objName) => (req, res, next) => {
	req.body[objName] = req.user._id;
	// console.log(`🚀 ~ file: handlerFactory.js ~ line 9 ~ req.body`, req.body);
	next();
};

// delete upadate and create to do the specified fucntions
exports.deleteOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findByIdAndDelete(req.params.id);

		if (!doc) return next(new AppError('Nothing to delete', 404));

		res.status(204).json({
			status: 'success',
			message: `${doc} has been deleted successfully`,
			data: null,
		});
	});

exports.updateOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!doc) return next(new AppError('No Document found with id', 404));

		res.status(200).json({
			status: 'success',
			data: doc,
		});
	});

exports.createOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.create(req.body);
		res.status(201).json({
			status: 'success',
			data: doc,
		});
	});

// single function to populate query
exports.getOne = (Model, popOptions) =>
	catchAsync(async (req, res, next) => {
		let doc;
		if (popOptions) doc = await Model.findById(req.params.id).populate(popOptions);
		if (!popOptions) doc = await Model.findById(req.params.id);

		if (!doc) return next(new AppError('no document found with that ID', 404));

		res.status(200).json({
			status: 'success',
			data: doc,
		});
	});

exports.getAll = (Model) =>
	catchAsync(async (req, res, next) => {
		const filter = {};

		// Place for custom filters to be used (will use to filter active and inactive riders)
		// let filter = {};
		// if (req.params.filterdata && req.params.filter) {
		// 	const filterData = req.params.filterdata
		// 	const filterValue = req.params.filter

		// 	filter = { filterValue : filterData };
		// }

		const features = new APIFeatures(Model.find(filter), req.query).filter().sort().limitFields().paginate();
		const data = await features.query;

		// SEND RESPONSE
		res.status(200).json({
			status: 'success',
			results: data.length,
			data,
		});
	});

exports.getAllIncludingInactive = (Model) =>
	catchAsync(async (req, res, next) => {
		const filter = {};

		// Place for custom filters to be used (will use to filter active and inactive riders)
		// let filter = {};
		// if (req.params.filterdata && req.params.filter) {
		// 	const filterData = req.params.filterdata
		// 	const filterValue = req.params.filter

		// 	filter = { filterValue : filterData };
		// }

		const features = new APIFeatures(Model.find(filter), req.query).filter().sort().limitFields().paginate();
		const data = await features.query;

		// SEND RESPONSE
		res.status(200).json({
			status: 'success',
			results: data.length,
			data,
		});
	});

exports.getAllCounter = (Model) =>
	catchAsync(async (req, res, next) => {
		const filter = {};

		// Place for custom filters to be used (will use to filter active and inactive riders)
		// let filter = {};
		// if (req.params.filterdata && req.params.filter) {
		// 	const filterData = req.params.filterdata
		// 	const filterValue = req.params.filter

		// 	filter = { filterValue : filterData };
		// }

		const features = new APIFeaturesCounter(Model.find(filter), req.query).filter();
		const data = await features.query;

		// SEND RESPONSE
		res.status(200).json({
			status: 'success',
			results: data.length,
			data,
		});
	});

exports.getAllWithFilter = (Model) =>
	catchAsync(async (req, res, next) => {
		const features = new APIFeatures(Model.find(req.body.filter), req.query).filter().sort().limitFields().paginate();
		const data = await features.query;

		// SEND RESPONSE
		res.status(200).json({
			status: 'success',
			results: data.length,
			data,
		});
	});
