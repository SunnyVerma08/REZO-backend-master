const crypto = require('crypto');
const mongoose = require('mongoose');

// Advanced Validator
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please tell us your name!'],
		},
		username: {
			type: String,
			// required: [true, 'Please Enter your username'],
			// unique: true,
		},
		phone: {
			type: String,
			required: [true, 'Please Enter your Phone'],
			unique: true,
		},
		email: {
			type: String,
			// required: [true, 'Please provide your email'],
			// unique: true,
			lowercase: true,
			validate: [validator.isEmail, 'Please provide a valid email'],
		},
		photo: {
			type: String,
			default: 'default.jpg',
		},
		role: {
			type: String,
			enum: ['admin', 'user', 'superAdmin', 'workshop'],
			default: 'user',
		},
		password: {
			type: String,
			required: [true, 'Please provide a password'],
			minlength: 8,
			select: false,
		},
		passwordConfirm: {
			type: String,
			required: [true, 'Please confirm your password'],
			validate: {
				// This only works on CREATE and SAVE!!!
				validator: function (el) {
					return el === this.password;
				},
				message: 'Passwords are not the same!',
			},
		},
		location: {
			// GeoJSON
			type: {
				type: String,
				default: 'Point',
				enum: ['Point'],
			},
			coordinates: {
				type: [Number],
				default: [0, 0],
			},
			address: String,
			description: String,
		},
		passwordChangedAt: Date,
		passwordResetToken: String,
		passwordResetExpires: Date,
		active: {
			// ability to deactivate an account
			type: Boolean,
			default: true,
		},
		createdAt: {
			type: Date,
			default: Date.now(),
		},
	},
	{
		// Database Name
		collection: 'rezoUsers',
	}
);

/*
 * Middlewares Section starts
 */

userSchema.pre('save', async function (next) {
	// Only run this function if password was actually modified
	if (!this.isModified('password')) return next();

	// Hash the password with cost of 12
	this.password = await bcrypt.hash(this.password, 12);

	// Delete passwordConfirm field
	this.passwordConfirm = undefined;
	next();
});

userSchema.pre('save', function (next) {
	if (!this.isModified('password') || this.isNew) return next();

	// Seeing Date in password changed with minus 1000
	this.passwordChangedAt = Date.now() - 1000;
	next();
});

// userSchema.pre(/^find/, function (next) {
// 	// this points to the current query
// 	// This will not show unactive users in db query
// 	if (this._update && this._update.active === true) return next();

// 	this.find({ active: { $ne: false } });
// 	next();
// });

// Schema Defined Password check
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

// Cheking Password timestamp changed and comparing themselves
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

		return JWTTimestamp < changedTimestamp;
	}
	// False means NOT changed
	return false;
};

// This is not implemented due to EMail function is not Implemented.
userSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString('hex');

	this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

	// Viewimg reset Token in Console
	// console.log({ resetToken }, this.passwordResetToken);

	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
	return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
