const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
	{
		service: {
			type: mongoose.Schema.ObjectId,
			ref: 'services',
			required: [true, 'Booking must have a Service!'],
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: [true, 'Booking must have a user!'],
		},
		workshopAllotedTo: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
		},
		vehicle: {
			type: String,
			required: [true, 'Booking must have a vehicle!'],
		},
		location: {
			type: String,
			required: [true, 'Booking must have a location'],
		},
		slot: {
			date: {
				type: Date,
				required: [true, 'Booking must have a slot date'],
			},
			time: {
				type: String,
				required: [true, 'Booking must have a slot time'],
			},
		},
		paid: {
			type: Boolean,
			default: false,
		},
		completed: {
			type: Boolean,
			default: false,
		},
	},
	{
		collection: 'Bookings',
		timestamps: true,
	}
);

bookingSchema.pre(/^find/, function (next) {
	this.populate('user').populate('service').populate('workshopAllotedTo');
	next();
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
