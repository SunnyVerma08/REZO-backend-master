/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

const router = require('express').Router();
const path = require('path');
const fs = require('fs');

// Set default API response
router.get('/', (req, res) => {
	res.json({
		status: 'API Its Working',
		message: 'Welcome to APIS',
		note: 'The Following /*/*/*/* URL paths are dymatically generated',
	});
});

// list of routes
const folder = './routes/services';

fs.readdirSync(folder).forEach((file) => {
	const extname = path.extname(file);
	const filename = path.basename(file, extname);
	const absolutePath = path.resolve(folder, file);

	//Import master routes
	if (filename !== 'index')
		router.use(`/${filename}/`, require(`${absolutePath}`));
});

// Export API routes
module.exports = router;
