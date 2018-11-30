


function processThis(obj,fn){
  return function(e){
    fn.call(obj,e);
  }
}

 function down(e){  //把down发布为一个事件： 就是把这个行为的发生写成一个让别人能够约定的标识符
  // 标识符名： selfDragStart
  this.x = this.offsetLeft;
  this.y = this.offsetTop;
  this.mx = e.pageX;
  this.my = e.pageY;
  this.MOVE = processThis(this,move);
  this.UP = processThis(this,up);
  if(this.setCapture){
    this.setCapture();
    on(this,'mousemove',move);
    on(this,'mouseup',up);
  }else{
    
    on(document,'mousemove',this.MOVE);
    on(document,'mouseup',this.UP);
  }
  e.preventDefault(); //取消默认行为，防止干扰

  //fire 发布（通过标识符，通知订阅者来执行）
  fire.call(this,'selfDragStart',e)
  
}
function move(e){

  var curL = this.x + (e.pageX -  this.mx);
  var curT = this.y + (e.pageY - this.my);

  var minL =0,minT = 0, maxL = (document.documentElement.clientWidth||document.body.clientWidth)- this.offsetWidth ,
  maxT = (document.documentElement.clientHeight||document.body.clientHeight) - this.offsetHeight;
  curL = curL <minL?minL: (curL>maxL ?maxL :curL);
  curT = curT< minT? minT : (curT>maxT? maxT: curT) ;

  this.style.left = curL+ 'px';
  this.style.top =  curT + 'px';

  // 发布（通过标识符，通知订阅者来执行）
  fire.call(this,'selfDragging',e);
  
}

function up(e){

  if(this.releaseCapture){
    this.releaseCapture();
    off(this,'mousemove',move);
    off(this,'mouseup',up);

  }else{
    off(document,'mousemove',this.MOVE);
    off(document,'mouseup',this.UP);
  }
  
  // 发布（通过标识符，通知订阅者来执行）
  fire.call(this,'selfDragEnd',e);

}