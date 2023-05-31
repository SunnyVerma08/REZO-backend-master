const crypto = require('crypto');

// ENV FILE DATA
const algorithm = process.env.ALGORITHM;
const secretKey = process.env.SECRETKEY;

exports.encrypt = (text) => {
	const iv = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
	const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
	return {
		iv: iv.toString('hex'),
		content: encrypted.toString('hex'),
	};
};

exports.decrypt = (hash) => {
	const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));
	const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
	return decrpyted.toString();
};
