
var http = require('http'),
fs = require('fs'),
url = require('url');


var server = http.createServer(function(req,res){
  var urlObj = url.parse(req.url,true),
  pathname = urlObj.pathname,
  query = urlObj.query;

  if(pathname === '/index.html'){
    var con = fs.readFileSync('../index.html','utf-8');

    // res.write(con);
    res.end(con); //返回加结束一步完成
    return;
  }
  if(pathname === '/css/index.css'){
    con = fs.readFileSync('../css/index.css','utf-8');

    res.end(con);
    return;
  }
  if(pathname === '/js/index.js'){
    con = fs.readFileSync('../js/index.js','utf-8');

    res.end(con);
    return;
  }
});

server.listen(1000,function(){
  console.log('server start ,listening on 1000 port!')
})