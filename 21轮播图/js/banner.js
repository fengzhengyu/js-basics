~function (){

  var banner = document.getElementById('banner'),
  bannerInner =utils.firstChild(banner),
  bannerPaginate = utils.children(banner,'ul') [0],
  imgList = bannerInner.getElementsByTagName('img'),
  oLis = bannerPaginate.getElementsByTagName('li');
  var btnLeft = utils.children(banner,'a')[0],
  btnRight = utils.children(banner,'a')[1];
  //ajajx
  var jsonData = null,count = 0;
  ~function(){
    var xhr = new XMLHttpRequest;
    xhr.open('get','js/data1.txt?_='+Math.random(),false);
   
    xhr.onreadystatechange = function(){
      if(xhr.readyState == 4 && /^2\d{2}$/.test(xhr.status)) {
        var res = xhr.responseText;
       
        jsonData  = utils.jsonParse(res)
        
      }
    }
     xhr.send(null);
  }();
  //  实现数据绑定
  ~function(){
    var str = '';
    var num= '';
    if(jsonData){
      for(var i=0;i<jsonData.length;i++){
        str += '<div><img src=""  data-img="'+ jsonData[i].img + '"></div>';
        num += '<li></li>'
      }
      str += '<div><img src=""  data-img="'+ jsonData[0].img + '"></div>';
      bannerInner.innerHTML =str;
      count = jsonData.length+1;
  
      utils.css(bannerInner,"width" ,count*1000); //冬天计算innerwidht
      bannerPaginate.innerHTML = num;
      utils.css( bannerPaginate,"width" ,jsonData.length*28);
     
       utils.addClass( utils.firstChild(bannerPaginate),'bg')
    }
  }()
  // 图片延迟加载
  function lazyImg(){
    for(var i=0;i<imgList.length;i++){
      ~function(i){ //onload异步编程，不等待直接执行下一次循环
        var curImg = imgList[i];
        var oImg = new Image;
        oImg.src = curImg.getAttribute('data-img');
        oImg.onload = function(){
          curImg.src = this.src;
          curImg.style.display = 'block';
          oImg= null;
          jsAnimate(curImg,{opacity:1},300)

        }
       
      }(i)
      
    }
  }
  setTimeout(lazyImg,500);
 
  // 实现无缝轮播
  var step = 0; //记录步长，当前是哪一张图片
  var autoTimer = setInterval(autoMove,2000)
 
  function autoMove(){
 
    if(step >= count-1){
      step = 0;
      utils.css(bannerInner,'left', 0);
  
    }
    step++;
    jsAnimate(bannerInner,{left: -step*1000},500);
    changePage()
  }

  // 焦点对其

  function changePage(){
    // console.log(step)
    // 当前step 大于oLis.length-1
    var tempStep = step >= oLis.length ? 0: step;
    for(var i=0;i<oLis.length;i++){
      var curLi = oLis[i];
      i === tempStep  ? utils.addClass(curLi,'bg'): utils.removeClass(curLi,'bg')
    }
  }
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
        changePage();
        jsAnimate(bannerInner,{left: -step*1000},500);
      }
    }
  }()

  // 向右
  btnRight.onclick = function(){
    autoMove()
  }
  btnLeft.onclick =function(){
    if(step<=0){
      step = count-1;
      utils.css(bannerInner,'left', -step*1000);
    }
    step--;
    jsAnimate(bannerInner,{left: -step*1000},500);
    changePage();
  }
}();