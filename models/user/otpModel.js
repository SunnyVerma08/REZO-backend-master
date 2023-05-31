const crypto = require('crypto');
const mongoose = require('mongoose');

// Advanced Validator
const bcrypt = require('bcryptjs');

const userOTPSchema = new mongoose.Schema(
	{
		otp: {
			token: String,
			time: Date,
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: [true, 'OTP must have a user!'],
		},
	},
	{
		// Database Name
		timestamps: true,
		collection: 'UserOTP',
	}
);

// Schema Defined Password check
userOTPSchema.methods.correctPassword = async function (candidateOTP, userOTP) {
	return await bcrypt.compare(candidateOTP, userOTP);
};

// This is not implemented due to EMail function is not Implemented.
userOTPSchema.methods.createPasswordResetToken = function () {
	const resetOTP = crypto.randomBytes(32).toString('hex');

	this.otp.token = crypto.createHash('sha256').update(resetOTP).digest('hex');

	// Viewimg reset Token in Console
	// console.log({ resetOTP }, this.otp);

	this.otp.time = Date.now() + 10 * 1000;
	return resetOTP;
};

const UserOTP = mongoose.model('UserOTP', userOTPSchema);
module.exports = UserOTP;
