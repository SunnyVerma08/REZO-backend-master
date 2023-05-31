const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
	brand: {
		type: mongoose.Schema.ObjectId,
		ref: 'brand',
		required: [true, 'vehicle must have a Brand!'],
	},
	model: {
		name: {
			type: String,
			required: true,
		},
		genericName: {
			type: String,
			required: true,
		},
		cc: {
			type: Number,
			required: true,
		},
		fuel: {
			type: String,
			required: true,
			enum: ['petrol', 'diesel'],
			default: 'petrol',
		},
	},
	services: {
		periodic: {
			duration: {
				type: Number,
				required: true,
			},
			charges: {
				type: Number,
				required: true,
			},
		},
		complete: {
			duration: {
				type: Number,
				required: true,
			},
			charges: {
				type: Number,
				required: true,
			},
		},
		washing: {
			duration: Number,
			charges: Number,
		},
		inspection: {
			duration: Number,
			charges: Number,
		},
	},
	location: {
		type: String,
		default: 'India',
	},
});

const vehicle = mongoose.model('vehicle', vehicleSchema);

module.exports = vehicle;
