

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
  var data = JSON.parse(fs.readFileSync('./json/student.json','utf-8')); //data []

  if(pathname === '/getList'){
    

    var n = query['n'] ||1,
    ary = [],
    result = {};
    
    for(var i = (n-1)*10;i<n*10-1;i++){
      // 通过规律计算的索引比最大索引都大，直接跳出循环，说明是最后一页
      if(i>data.length-1){
        break;
      }
      ary.push(data[i]);
    }

    //n=1        0-9
    //n=2       10-19
    //n=3        0-29
  
    //n=n (n-1)*10 - n*10 -1
    if(n>Math.ceil(data.length/10)){
      result = {
        code:1,
        msg: '页数不对',
        total: 0,
        data: null
      };
    }else{
      result = {
        code: 0,
        msg: '成功',
        total: Math.ceil(data.length/10),
        data: ary
      };
    }
    res.writeHead(200,{'content-type':'application/json;charset=utf-8;'}); //返回格式是js代码，fn 才能执行
    res.end(JSON.stringify(result)); 
    return;

  }
  // 
  if(pathname === '/getInfo'){
    var studentId = query['id'],
    obj= null;
    for(var i=0;i<data.length;i++){
      if(data[i].id ==studentId){
        obj = data[i];
      }
    }
    var result = {
      code:1,
      msg: 'id不存在',
      data: null
    }
    if(obj){
      result = {
        code:0,
        msg: '成功',
        data: obj
      }
    }
    res.writeHead(200,{'content-type':'application/json;charset=utf-8;'}); //返回格式是js代码，fn 才能执行
    res.end(JSON.stringify(result)); 
    return;

  }
  res.writeHead(404,{'content-type':'text/plain;charset=utf-8;'}); //返回格式是js代码，fn 才能执行
  res.end('request api url is not found~ ');

})
server.listen(520,function(){
  console.log('server is success ,listening on 520 port!')
})