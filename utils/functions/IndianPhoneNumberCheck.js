// indian phone number check function
module.exports = function checkIndianPhoneNumber(indianPhoneNumber) {
	// 1) Sanatize the phoneNum number and remove +,-,spaces and 91 and starting 0
	if (indianPhoneNumber === undefined) {
		return false;
	}
	const phoneNum = indianPhoneNumber.toString().replace(/-|\s/g, '');
	const newPhoneNum = phoneNum.substring(phoneNum.length - 10, phoneNum.length);

	// 2) Check if mobile number is valid
	const regex = new RegExp('^(?:(?:\\+|0{0,2})91(\\s*[\\-]\\s*)?|[0]?)?[6789]\\d{9}$');
	if (!regex.test(newPhoneNum)) {
		// Change this to something else to throw error in application
		return false;
	}
	return newPhoneNum * 1;
};
