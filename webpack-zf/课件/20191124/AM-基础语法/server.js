const express = require('express'),
	config = require('./config'),
	bodyParser = require('body-parser'),
	app = express();

const fsPromise = require('./lib/myFs');
const {
	responseInfo
} = require('./lib/utils');

/* 创建服务监听端口 */
app.listen(config.port, _ => {
	console.log(`SERVER IS CREATE => ${config.port}`);
});

/* 中间件：在处理请求之前统一做的事情 */
app.use(bodyParser.urlencoded({
	//=>把请求主体传递的信息 x-www-form-urlencoded 变为对象键值对的方式，存储到req.body上（bodyParser中间件完成的事情）
	extended: false
}));
app.use(async (req, res, next) => {
	req.USER_DATA = await fsPromise.readFile('./mock/user.json');
	req.USER_DATA = JSON.parse(req.USER_DATA);
	// 处理完当前的事情，让其继续向下匹配处理
	next();
});

/* API接口的请求处理 */
app.get('/api/list', (req, res) => {
	let {
		limit = 10,
			page = 1
	} = req.query;
	page = parseInt(page);
	limit = parseInt(limit);
	let total = req.USER_DATA.length,
		pages = Math.ceil(total / limit),
		data = [];
	for (let i = (page - 1) * limit; i < page * limit; i++) {
		let item = req.USER_DATA[i];
		if (!item) {
			break;
		}
		data.push(item);
	}
	if (data.length === 0) {
		responseInfo(res, {
			code: 1,
			codeText: '没有匹配的数据！'
		});
		return;
	}
	responseInfo(res, {
		page,
		limit,
		pages,
		total,
		data
	});
});

app.post('/api/add', (req, res) => {
	let {
		name = '',
			phone = ''
	} = req.body;
	req.USER_DATA.push({
		id: req.USER_DATA.length === 0 ? 1 : parseInt(req.USER_DATA[req.USER_DATA.length - 1]['id']) + 1,
		name,
		phone
	});
	fsPromise.writeFile('./mock/user.json', req.USER_DATA).then(_ => {
		responseInfo(res);
	}).catch(_ => {
		responseInfo(res, {
			code: 1,
			codeText: '增加失败！'
		});
	});
});

/* 静态资源文件的处理 */
app.use(express.static('./static'));
app.use((req, res) => {
	res.status(404).send({
		code: 1,
		codeText: 'not found！'
	});
});