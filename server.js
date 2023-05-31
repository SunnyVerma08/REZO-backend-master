/*
 * This file contains Database connection and global unhandledRejection and uncaughtException handlers
 */

const mongoose = require('mongoose');

// Importing config environment variables (using one ENV file is feels better to me, will be added it gitignore)
const dotenv = require(`dotenv`);
dotenv.config({ path: './config.env' });

// Main app required to run the server
const app = require('./app');

// console.log(process.env); // To view environment variables  🟥 🟥

//------------------------ DATABASE: --------------------------------
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// Check DB string is correct or not with log
// console.log(DB, ' 🟥 🟥 +++++++=> line 13, file /server.js');
mongoose
	.connect(DB, {
		retryReads: true,
		retryWrites: true,
		compressors: 'zlib,snappy',
	})
	.then(() => console.log('\n 🎇 DB connection established successfully 🎇\n'));

//---------------------------------------

// Starting of server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
	console.log(`App listening on ${port}`);
});

//  Catching Global Errors and closing the server if they occour
process.on('unhandledRejection', (err) => {
	console.log(err.name, err.message, `|| UNHANDLED REJECTION ||`);
	server.close(() => {
		process.exit(1);
	});
});
process.on('uncaughtException', (err) => {
	console.log(err.name, err.message, `|| UNCAUGHTEXCEPTION ||`);
	server.close(() => {
		process.exit(1);
	});
});
