const express = require('express'),
	bodyParser = require('body-parser'),
	session = require('express-session');

const fsPromise = require('./lib/myFs'),
	utils = require('./lib/utils'),
	config = require('./config');

/* 创建WEB服务 */
const app = express();
app.listen(config.port, _ => {
	console.log(`SERVER IS CREATE => ${config.port}`);
});

/* 中间件的处理 */
app.use((req, res, next) => {
	//=>CORS跨域处理的中间件
	res.header("Access-Control-Allow-Origin", config.cors.origin);
	res.header("Access-Control-Allow-Credentials", config.cors.credentials);
	res.header("Access-Control-Allow-Headers", config.cors.headers);
	res.header("Access-Control-Allow-Methods", config.cors.methods);
	//=>对浏览器默认发送的试探请求做处理
	/^OPTIONS$/i.test(req.method) ? res.send('OK') : next();
});
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(session(config.session));

/* API接口的处理 */
app.use('/user', require('./routes/user'));
app.use('/cart', require('./routes/cart'));
app.use('/product', require('./routes/product'));
app.use((req, res) => {
	res.status(404).send({
		code: 1,
		codeText: 'request address does not exist'
	});
});