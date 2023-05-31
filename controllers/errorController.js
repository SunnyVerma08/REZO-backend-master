const AppError = require('../utils/appError');

// text operations
const firstLetterCapital = (s) => s.replace(/./, (c) => c.toUpperCase());

const handleCastErrorDB = (err) => {
	const message = `Invalid ${err.path}: ${err.value}.`;
	return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
	const value = JSON.stringify(err.keyValue).replace(/[{"}]/g, '');
	// console.log(value);

	// FrontEnd Asked for message only
	const message = `Duplicate ${firstLetterCapital(value).replaceAll(':', ' : ')}. Please use another value!`;

	// console.log(message);
	return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map((el) => el.message);

	// error msg for validation only
	console.log(errors);

	const message = `Invalid input data. ${errors.join(' and ').replaceAll('Path `', 'Value `')}`;
	return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () => new AppError('Your token has expired! Please log in again.', 401);

const imageFileNotFoundError = () => new AppError('File not found!', 404);

const sendErrorDev = (err, req, res) =>
	// 1) Sending Error
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		Note: 'Appplication is running in development mode, So the error stack is visible',
		url: req.originalUrl,
		stack: err.stack,
	});

const sendErrorProd = (err, req, res) => {
	// A) API
	// A) Operational, trusted error: send message to client
	if (err.isOperational) {
		return res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
	}
	// B) Programming or other unknown error: don't leak error details
	// 1) Log error
	// console.error('ERROR 💥', err);
	// 2) Send generic message
	return res.status(500).json({
		status: 'error',
		message: 'Something went very wrong!',
	});
};

module.exports = (err, req, res, next) => {
	// console.log(err.stack);

	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(err, req, res);
	} else if (process.env.NODE_ENV === 'production') {
		// whole error log
		console.log(err);
		// Gets error name and code
		// console.log(`Production Error`, { errorName: err.name, errorCode: err.code });

		if (err.name === 'CastError') err = handleCastErrorDB(err);
		if (err.code === 11000) err = handleDuplicateFieldsDB(err);
		if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
		if (err.name === 'JsonWebTokenError') err = handleJWTError();
		if (err.name === 'TokenExpiredError') err = handleJWTExpiredError();
		if (err.errno === -4058) err = imageFileNotFoundError();

		sendErrorProd(err, req, res);
	}
};
