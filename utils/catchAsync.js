/*
 * This code here makes try catch into a function that we can use :
 *  Example function catchAsync() => our code
 */

module.exports = (fn) => (req, res, next) => {
	fn(req, res, next).catch(next);
};
