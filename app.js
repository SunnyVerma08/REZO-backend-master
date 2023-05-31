/********************************
 * How to Run this app? =>
 * 1. npm install --only=prod  => for production
 * 2. command to use > node server.js
 *
 * server and mongodb details are in server.js
 *
 * While developing this app, use of comments is necessary 📝 // Please use comments
 *
 *
 * //// Console logs statements //////////////////////////////////
 * In console if you see 🟥 (incoming data and internal console logs) << this means some kind of development code is ON.
 * In console if you see 🟦 (out going data to the clinet) << this means some kind of development code is ON.
 * In console if you see 🟩 (Things are working fine) << this means some kind of development code is ON.
 *
 * To deploy find code that contains 🟩, 🟦and 🟥 and comment the code.
 *
 * if there is some error find these squares {🟩, 🟦and 🟥} and turn off comments to see what is going on.
 */

// Using Path to get current working directory
const path = require('path');
const express = require('express');

// reading cookies
const cookieParser = require('cookie-parser');

// ⭐🔴 Development logging (remove morgan in production)  🟥 🟥
// eslint-disable-next-line
const morgan = require('morgan');

// Mongo Injection Protection
const mongoSanitize = require('express-mongo-sanitize');

// Cross origin Resource
const cors = require('cors');

const app = express();

// JWT cookie comes
app.use(cookieParser());

// Global Error Handler
const globalErrorHandler = require('./controllers/errorController');

// Implement CORS
app.use(cors());
// Access-Control-Allow-Origin *
app.options('*', cors());

// By enabling the "trust proxy" setting via app. enable('trust proxy')
// Express will have knowledge that it's sitting behind a proxy and that the X-Forwarded-* header fields may be trusted,
// which otherwise may be easily spoofed.
app.enable('trust proxy');

// Making public folder available on the website
app.use(express.static(path.join(__dirname, 'client', 'public')));

// Body Parser, reading data form the req.body
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Development logging  🟥 🟥
console.log('🎡', process.env.NODE_ENV.toLocaleUpperCase(), '🎡');
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// console log BODY before requests
app.use((req, res, next) => {
	if (req.method === 'POST') {
		// console.log('\n🟥 data coming from body 👁 + file app.js + line 41 \n');
		console.table(req.body);
	}
	console.log('\n🟢🟢🔰🔰', req.method, req.originalUrl);

	// remove ⬆ comment to see what body data was recieved
	next();
});

// console log COOKIES before requests
app.use((req, res, next) => {
	// console.log('\n🟥 COOKIES before requests + file app.js + line 49 \n', req.cookies);
	// remove ⬆ comment to see what cookies were recieved
	next();
});

// Data sanitization against NoSQL query injection
app.use((req, res, next) => {
	// Before Sanitization
	// console.log('Before Sanitization', req.query);

	// const hasProhibited = mongoSanitize.has(req.query);
	// console.log({ hasProhibited });

	mongoSanitize.sanitize(req.query, {});

	// req.query = JSON.parse(mongoSanitize.sanitize(req.query.toString(), {}));

	// After Sanitization
	// console.log('After Sanitization', req.query);

	next();
});

/****************************************************************
 * Routes
 * This is where all the routers will be mounted and controlled, we will be using api versions to control
 *
 */
// Router Import (router folder)
const userRouter = require('./routes/userRouter');
const services = require('./routes/services');
const bookings = require('./routes/bookingRouter');

// API V1 -- versions control v1.0.0 - v1.0.1
app.use('/api/v1/users', userRouter);
app.use('/api/v1/services', services);
app.use('/api/v1/bookings', bookings);

/* Public APIs : Anyone can post only admin can read */
const publicApi = require('./routes/publicAPIRouter');
const adminPublicRouter = require('./routes/adminPublicRouter');

app.use('/api/v1/public', publicApi);
app.use('/api/v1/public/admin', adminPublicRouter);

// Sending Error to pages not found
app.all('*', (req, res, next) => {
	res.status(404).json({
		status: 'fail',
		message: `Can't find ${req.originalUrl} on this server!`,
	});
});
// this can throw "cannot send headers errors" | this error can be viewed in console and is not a dangerous error
// {this actully tells that app has run till the end due to some error and response is sent twice}

// Global Error Handler
app.use(globalErrorHandler);

// exports app to other modules
module.exports = app;
// __LAST LINE CODE___
