const mongoose = require('mongoose');

const callMeModelSchema = new mongoose.Schema(
	{
		phone: {
			type: Number,
			required: [true, 'Please Enter your Phone'],
		},
		name: {
			type: String,
		},
		remarks: {
			type: String,
		},
		status: {
			type: String,
			enum: ['new', 'progress', 'done'],
			default: 'new',
		},
	},
	{
		collection: 'callMeRequests',
		timestamps: true,
	}
);

const callMe = mongoose.model('callMe', callMeModelSchema);

module.exports = callMe;
