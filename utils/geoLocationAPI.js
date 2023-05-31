const axios = require('axios');

exports.getLocation = async (lat, lng) => {
	const params = {
		access_key: `${process.env.GeoLocationAPI}`,
		query: `${lat}, ${lng}`,
	};

	return await axios.get(`http://api.positionstack.com/v1/reverse`, { params });
};
