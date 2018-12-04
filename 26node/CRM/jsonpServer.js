

var  http = require('http'),
url = require('url'),
fs  = require('fs');

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
        suffixMIME = 'text/javascript';
        break;
     
      case 'JSON':
        suffixMIME = 'application/json';
        break;  
      case 'ICO':
        suffixMIME = 'application/octet-stream';
        break;  
    }
    try { //捕获异常 防止客户端请求资源不存在， 服务器挂起
      var conFile = fs.readFileSync('.'+pathname,'utf-8');
      res.writeHead(200,{'content-type':suffixMIME+ ';charset=utf-8'});
      res.end(conFile)
    } catch (error) {
      res.writeHead(404,{'content-type':'text/plain;charset=utf-8'});
      res.end('request file is not found~')
    }
    return;
  }

  
  // jsonp处理
  var customPath = './json/customer.json';
  if(pathname === '/getAll'){
    


    
    res.writeHead(200,{'content-type':'application/json;charset=utf-8;'});
    res.end(JSON.stringify(result));
    return;

  }
  
  
});


server.listen(1314,function(){
  console.log('server is success ,listening on 1314 port!')
})