

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

  
  // api处理

 // 获取所有客户信息
  var con = null,
  customId = null,
  result = null,
  customPath = './json/customer.json';
  // 得到所有数据
  con = fs.readFileSync(customPath,'utf-8');
  con.length === 0 ?  con = '[]': null; //防止空字符串，浏览器报错
  con = JSON.parse(con) ;
  if(pathname === '/getList'){
  
    result = {
      code:1,
      msg: '没有任何信息',
      data: null
    };
    if(con.length > 0){
      result = {
        code:0,
        msg: '成功',
        data:con
      };
    }
  
    res.writeHead(200,{'content-type':'application/json;charset=utf-8;'});
    res.end(JSON.stringify(result));
    return;

  }
  // 根据客户id,得到客户信息
  if(pathname ==='/getInfo' ){
    customId = query['id'];
    result = {
      code:1,
      msg: '获取的客户不存在',
      data: null
    };
    for(var i=0;i<con.length;i++){
      if(con[i]['id'] ==  customId ){
        result = {
          code:0,
          msg: '成功',
          data: con[i]
        };
        break;
      }
    }

    res.writeHead(200,{'content-type':'application/json;charset=utf-8;'});
    res.end(JSON.stringify(result));
    return;
  }
  // 根据id 删除客户信息
  if(pathname === '/removeInfo'){
    customId = query['id'];
    var flag = false;
    
    for(var i=0;i<con.length;i++){
      if(con[i]['id'] ==  customId ){
        con.splice(i,1);
        flag = true;
        break;
      }
    }
    if(flag){
      fs.writeFileSync(customPath,JSON.stringify(con),'utf-8');
      result = {
        code:0,
        msg: '删除成功',
        data:null
      };
    }else{
      result = {
        code:1,
        msg: '删除失败',
        data: null
      };
    }

    res.writeHead(200,{'content-type':'application/json;charset=utf-8;'});
    res.end(JSON.stringify(result));
    return;
  }


  // 增加客户信息

  if(pathname === '/addInfo'){
    // 获取请求主体中传递来的内容
    var str = '';
    req.on('data',function(chunk){

      str += chunk;
    })
    req.on('end',function(){
      // str =' {}'
      if(str.length === 0){
        res.writeHead(200,{'content-type':'application/json;charset=utf-8;'});
        res.end(JSON.stringify({
          code: 1,
          msg: '增加失败，没有传递任何信息'
        }));
        return
      }
      var data = json.parse(str);
      // 在现有的data中增加一个id
      if(con.length === 0){
        data['id'] = 1;
      }else{
        data['id'] = parseFloat(con[con.length-1]['id'])+1;

      }
      con.push(data);
      fs.writeFileSync(customPath,JSON.stringify(con),'utf-8');

      res.writeHead(200,{'content-type':'application/json;charset=utf-8;'});
      res.end(JSON.stringify({
        code: 0,
        msg: '增加成功'
      }));
      
    })
    return;
  }
  // 修改客户信息
  if(pathname === '/updateInfo'){
    var str = '';
    req.on('data',function(chunk){
      str += chunk;
    });
    req.on('end',function(){

      if(str.length === 0){
        res.writeHead(200,{'content-type':'application/json;charset=utf-8;'});
        res.end(JSON.stringify({
          code: 1,
          msg: '修改失败，没有传递任何信息'
        }));
        return
      }
      var data = json.parse(str);
      var flag = false;
      for(var i=0;i<con.length;i++ ){
        if(con[i].id == data.id){
          con[i] = data;
          flag = true;

          break;
        }
      }

      if(flag){
        fs.writeFileSync(customPath,JSON.stringify(con),'utf-8');
        result= {
          code:0,
          msg: '修改成功'
        }
      }else{
        result= {
          code:1,
          msg: '修改失败'
        }
      }
      res.writeHead(200,{'content-type':'application/json;charset=utf-8;'});
      res.end(JSON.stringify(result));
    });
    return;
  }

  
  // 访问不存在的地址，做处理
  res.writeHead(404,{'content-type':'text/plain;charset=utf-8'});
  res.end('请求数据接口不存在！')
  
});


server.listen(1314,function(){
  console.log('server is success ,listening on 1314 port!')
})