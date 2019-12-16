function responseInfo(res, options) {
	let config = Object.assign({
		code: 0,
		codeText: 'OK！'
	}, options);
	res.status(200).type('application/json').send(config);
}

function againMD5(text) {
	return text.substring(4, text.length - 4)
		.split('').reverse().join('');
}

function checkTime30Min(time) {
	let nowT = new Date().getTime();
	return (nowT - time) <= (30 * 60 * 1000);
}

module.exports = {
	responseInfo,
	againMD5,
	checkTime30Min
};