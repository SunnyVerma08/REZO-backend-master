const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Brand must have a name!'],
		unique: true,
	},
});

const brand = mongoose.model('brand', brandSchema);

module.exports = brand;
