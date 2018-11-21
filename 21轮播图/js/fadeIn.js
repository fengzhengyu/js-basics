
~function(){

  var banner = document.getElementById('banner'),
  bannerInner = utils.firstChild(banner),
  divList = bannerInner.getElementsByTagName('div'),
  pageWrap = utils.children(banner,'ul')[0],
  oLis = pageWrap.getElementsByTagName('li'),
  imgList = bannerInner.getElementsByTagName('img'),
  btnLeft = utils.children(banner,'a')[0],
  btnRight = utils.children(banner,'a')[1];

  // ajax
  var jsonData = null,count = null;
  ~function(){
    var xhr = new XMLHttpRequest;
    xhr.open('get','js/data1.txt?_='+Math.random(),false);
  
    xhr.onreadystatechange = function () {
      if(xhr.readyState == 4 && /^2\d{2}$/.test(xhr.status) ){
      
        jsonData = utils.jsonParse(xhr.responseText)
      }
    }
    xhr.send(null);
  }()
 
//  绑定数据
  ~function(){
    var str = '',num = '';
    if(jsonData){
      for(var i=0;i<jsonData.length;i++){
        str += '<div><img  data-img="'+jsonData[i].img+'"/></div>';
        i===0? num += '<li class="bg"></li>':num += '<li></li>';
      }
      pageWrap.innerHTML = num;
      bannerInner.innerHTML = str;
   
      // utils.css(utils.firstChild(bannerInner),{
      //   zIndex: 1,
      //   opacity: 1
      // });
    }
  }()
// 图片延迟加载

function lazy(){
  for(var i=0;i<imgList.length;i++){
    (function (i) { 
      var curImg = imgList[i];
    var oImg = new Image;
    oImg.src = curImg.getAttribute('data-img');
    oImg.onload = function () {
      curImg.src = this.src;
      curImg.style.display = 'block';
      // 只对第一张处理
      if(i ===0){
        curImg.parentNode.style.zIndex =1;
        jsAnimate(curImg.parentNode,{opacity:1},300);
      }
      oImg = null;
     
    }
    })(i)
    
  }
}
setTimeout(lazy,500);

var interval = 3000, autoTimer = null,step =0;
autoTimer = setInterval(autoMove,interval);
function autoMove(){
  if(step == divList.length-1){
    step  =  -1;
  }
  step++;
  setBanner()
  // changePage()

}
// 实现轮播图切换效果
function setBanner(){
  // 1)让索引对应的那个div zindex =1 其他为0
  for(var i=0;i<divList.length;i++){
    var curDiv = divList[i];
    if(i === step){
      utils.css(curDiv,'zIndex',1);
      // 2) 让当前透明度变为1 ,当动画结束，其他div变为0 
      jsAnimate(curDiv,{opacity: 1},300,function(){
        var curDivSib = utils.siblings(this);
        for(var k=0;k<curDivSib.length;k++){
           utils.css(curDivSib[k],'opacity',0);
        }
      })
      continue;
    }
    utils.css(curDiv,'zIndex',0);

  }
  // 焦点对应
  for(var i =0;i<oLis.length;i++){
    var curLi = oLis[i];
    i === step? utils.addClass(curLi,'bg'): utils.removeClass(curLi,'bg')
  }

}
// 
banner.onmouseover = function(){

  clearInterval(autoTimer);
  btnLeft.style.display = btnRight.style.display = 'block';
}
banner.onmouseout = function(){
  autoTimer = setInterval(autoMove,2000)
  btnLeft.style.display = btnRight.style.display = 'none';
}

 // 点击焦点
 ~function(){
  for(var i=0;i<oLis.length;i++){
    oLis[i].index =i;
    oLis[i].onclick =function(){
      step = this.index;
      setBanner()
      
    }
  }
}()
// 向右
btnRight.onclick = function(){
  autoMove()
} 
// 向左

btnLeft.onclick =function(){
  if(step <=0){
    step =  jsonData.length;
  }
  step --;
  setBanner()
}

}()