
let express = require('express');
let app =express();
app.get('/user',function(req,res){
  console.log(req.headers)
  res.json({name:'ff'})
});
app.listen(6000,function(){
  console.log('server started')
})