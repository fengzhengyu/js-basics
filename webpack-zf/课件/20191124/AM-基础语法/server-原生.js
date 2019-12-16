const http = require('http');
const url = require('url');
const mime = require('mime');
const qs = require('qs');
const fsPromise = require('./lib/myFs');
/* 
 * 创建一个WEB服务 
 *   http.createServer()：创建服务
 *   server.listen()：监听端口号
 * http://127.0.0.1:9000/ 向当前服务发送请求
 * 
 * 每当客户端向当前服务器发送一个请求，就会触发回调函数执行一次
 * 	  REQ => request：请求对象，存储了客户端传递的信息
 * 		 req.headers 存储请求头信息
 *       req.method 请求方式
 *       req.url 请求的路径地址（包含问号传参，但是没有哈希）
 *    RES => response：响应对象，提供了服务器给客户端返回信息的方法
 * 		 res.writeHead 设置响应头
 * 		 res.end 结束响应并返回信息
 */
const server = http.createServer(async (req, res) => {
	let {
		// 请求的路径名称
		pathname,
		// 问号传参（对象键值对）
		query
	} = url.parse(req.url, true);
	pathname = pathname === '/' ? '/index.html' : pathname;

	/* 处理静态资源文件的请求 */
	const suffixREG = /\.([0-9A-Z]+)/i;
	const suffix = suffixREG.test(pathname) ? suffixREG.exec(pathname)[1] : null;
	if (suffix) {
		const encoding = /^(JPG|JPEG|GIF|PNG|WAMP|BMP|ICO|SVG|MP3|MP4)$/i.test(suffix) ? null : 'UTF8';
		fsPromise.readFile(`./static${pathname}`, encoding).then(result => {
			res.writeHead(200, {
				'content-type': mime.getType(suffix)
			});
			res.end(result);
		}).catch(err => {
			res.writeHead(404, {
				'content-type': 'application/json'
			});
			res.end(JSON.stringify({
				code: 1,
				codeText: 'not found！'
			}));
		});
		return;
	}

	/* API数据接口的处理 */
	const method = req.method.toUpperCase();
	// 先把JSON中的数据都获取到
	let USER_DATA = await fsPromise.readFile('./mock/user.json');
	USER_DATA = JSON.parse(USER_DATA);

	if (pathname === '/api/list' && method === 'GET') {
		// 获取客户端问号传递的参数信息
		let {
			limit = 10,
				page = 1
		} = query;
		let total = USER_DATA.length,
			pages = Math.ceil(total / limit),
			data = [];
		page = parseInt(page);
		limit = parseInt(limit);
		// 获取指定页面的信息
		for (let i = (page - 1) * limit; i < page * limit; i++) {
			let item = USER_DATA[i];
			if (!item) {
				break;
			}
			data.push(item);
		}
		// 返回指定内容
		res.writeHead(200, {
			'content-type': 'application/json'
		});
		if (data.length === 0) {
			res.end(JSON.stringify({
				code: 1,
				codeText: '没有匹配的数据！'
			}));
			return;
		}
		res.end(JSON.stringify({
			code: 0,
			codeText: 'OK！',
			page,
			limit,
			pages,
			total,
			data
		}));
		return;
	}

	if (pathname === '/api/add' && method === 'POST') {
		// 获取请求主体中传递的信息
		let text = '';
		req.on('data', chunk => {
			text += chunk;
		});
		req.on('end', _ => {
			let body = qs.parse(text),
				{
					name = '',
					phone = ''
				} = body;
			USER_DATA.push({
				id: USER_DATA.length === 0 ? 1 : parseInt(USER_DATA[USER_DATA.length - 1]['id']) + 1,
				name,
				phone
			});
			res.writeHead(200, {
				'content-type': 'application/json'
			});
			fsPromise.writeFile('./mock/user.json', USER_DATA).then(_ => {
				res.end(JSON.stringify({
					code: 0,
					codeText: 'OK！'
				}));
			}).catch(err => {
				res.end(JSON.stringify({
					code: 1,
					codeText: '增加失败！'
				}));
			});
		});
		return;
	}

	// 错误的请求地址
	res.writeHead(404, {
		'content-type': 'application/json'
	});
	res.end(JSON.stringify({
		code: 1,
		codeText: 'not found！'
	}));
});
server.listen(9000, _ => {
	console.log('SERVER IS CREATE => 9000');
});