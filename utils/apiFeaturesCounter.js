// This code helps in filtering data when used with mongo DB

class APIFeaturesCounter {
	constructor(query, queryString) {
		this.query = query;
		this.queryString = queryString;
	}

	filter() {
		const queryObj = { ...this.queryString };
		const excludedFields = ['page', 'sort', 'limit', 'fields'];
		excludedFields.forEach((el) => delete queryObj[el]);

		let queryStr = JSON.stringify(queryObj);
		queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

		this.query = this.query.countDocuments(JSON.parse(queryStr));

		return this;
	}
}
module.exports = APIFeaturesCounter;
