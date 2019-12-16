const express = require('express'),
	route = express.Router();

const fsPromise = require('../lib/myFs');
const {
	responseInfo,
	againMD5,
	checkTime30Min
} = require('../lib/utils');

route.use(async (req, res, next) => {
	req.$USER = JSON.parse(await fsPromise.readFile('./mock/user.json'));
	req.$CODE = JSON.parse(await fsPromise.readFile('./mock/code.json'));
	next();
});

//登录处理
route.post('/login', (req, res) => {
	let {
		account,
		password,
		type = 1
	} = req.body;
	password = againMD5(password);

	let data;
	// 账号密码登录
	if (parseInt(type) === 1) {
		data = req.$USER.find(item => {
			return (item.name === account || item.phone === account) && item.password === password;
		});
	}

	// 短信验证
	if (parseInt(type) === 2) {
		data = req.$CODE.find(item => {
			return item.phone === account && item.code === password && checkTime30Min(item.item);
		});
		if (data) {
			data = req.$USER.find(item => {
				return item.phone === data.phone;
			});
		}
	}

	// 返回对应的结果
	if (!data) {
		responseInfo(res, {
			code: 1,
			codeText: 'account (mobile number) and password (verification code) do not match！'
		});
		return;
	}
	// 如果登录成功，需要服务器端记录登录态
	req.session.userId = parseInt(data.id);
	responseInfo(res, {
		data: {
			id: data.id,
			name: data.name,
			phone: data.phone,
			pic: data.pic
		}
	});
});

//校验是否登录
route.get('/login', (req, res) => {
	const userId = req.session.userId;
	if (!userId) {
		responseInfo(res, {
			code: 1,
			codeText: 'not logged in！'
		});
		return;
	}
	responseInfo(res);
});

//退出登录
route.get('/signout', (req, res) => {
	req.session.userId = null;
	responseInfo(res);
});

module.exports = route;