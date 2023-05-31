const mongoose = require('mongoose');

const userActivityDataModelSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: [true, 'ActivityData must belong to a User.'],
		},
		name: {
			type: String,
		},
		email: {
			type: String,
			lowercase: true,
		},
		role: {
			type: String,
		},
		phone: {
			type: String,
		},
		activity: {
			type: String,
			enum: [
				'newUser',
				'login',
				'logout',
				'passwordReset',
				'passwordUpdate',
				'userDataUpdate',
				'userDeleted',
				'userDeactivated',
				'userActivated',
			],
			required: [true, 'Activity is required'],
		},
		createdAt: {
			type: Date,
			default: Date.now(),
		},
	},
	{
		collection: 'userActivityData',
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

userActivityDataModelSchema.index({ user: 1 });

const UserActivityData = mongoose.model('UserActivityData', userActivityDataModelSchema);

module.exports = UserActivityData;
