
var http = require('http'),
fs = require('fs'),
url = require('url');


var server = http.createServer(function(req,res){
  var urlObj = url.parse(req.url,true),
  pathname = urlObj.pathname,
  query = urlObj.query;

  // 处理静态资源文件请求（HTMLcssjs）
  var reg = /\.(HTML|JS|CSS|JSON|TXT|ICO)/i;
  if(reg.test(pathname)){
    var suffix = reg.exec(pathname)[1].toUpperCase();
    var suffixMIME = 'text/plain';
    switch(suffix){
      case 'HTML':
        suffixMIME = 'text/html';
        break;
      case 'CSS':
        suffixMIME = 'text/css';
        break;
      case 'JS':
        suffixMIME = 'text/javascrip';
        break;
     
      case 'JSON':
        suffixMIME = 'application/json';
        break;  
      case 'ICO':
        suffixMIME = 'application/octet-stream';
        break;  
    }
    try { //捕获异常 防止客户端请求资源不存在， 服务器挂起
      var conFile = fs.readFileSync('..'+pathname,'utf-8');
      res.writeHead(200,{'content-type':suffixMIME+ ';charset=utf-8'});
      res.end(conFile)
    } catch (error) {
      res.writeHead(404,{'content-type':'text/plain;charset=utf-8'});
      res.end('request file is not found~')
    }
  }



  
  
});

server.listen(1000,function(){
  console.log('server start ,listening on 1000 port!')
})