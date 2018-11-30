//  常用模块

var http = require('http'),
fs = require('fs'),
url = require('url');

// var server = http.createServer(function(req,res){
//     // console.log(req.url) ///index.html?name=fengzheng&age=30 //->访问的目录及名称及传给服务器的内容
  

//     var  str = url.parse(req.url)
//     console.log(str) 
    
// });

// server.listen(1000,function(){
//   console.log('server start on the 1000 port')
// })

// var str = 'http://192.168.1.137:1000/index.html?name=fengzheng&age=30#aaa';
// console.log(url.parse(str))

/* 

Url {
  protocol: 'http:',             //协议
  slashes: true,                 //斜杠语法
  auth: null,  
  host: '192.168.1.137:1000',    //主机+端口
  port: '1000',                  //端口
  hostname: '192.168.1.137',     //主机
  hash: '#aaa',                  //哈希值
  search: '?name=fengzheng&age=30', //?+传递来的数据
  query: 'name=fengzheng&age=30', //传递来的数据
  pathname: '/index.html',         //请求路径名
  path: '/index.html?name=fengzheng&age=30', //请求路径
  href: 'http://192.168.1.137:1000/index.html?name=fengzheng&age=30#aaa'  、//
}
  console.log(url.parse(str,true))

  query: { name: 'fengzheng', age: '30' } //增加true query是处理后的结果

*/

var server = http.createServer(function(req,res){
   
    var urlObj = url.parse(req.url,true),
    pathname = urlObj.pathname,
    query = urlObj.query;
   
    if(pathname === '/index.html'){
      var content = fs.readFileSync('./index.html','utf-8'); //同步执行指定文件的内容，读取不完不执行下面内容

      res.write(content);
      res.end()
    }
  
});

server.listen(1000,function(){
  console.log('server start on the 1000 port')
})