(function(){
  function AutoBanner(curEleId,ajaxUrl,interval){
    // 获取元素的变量，成为实例的私有属性
    this.banner = document.getElementById(curEleId);
    this.bannerInner = utils.firstChild(this.banner);
    this.bannerPage = utils.children(this.banner,'ul')[0];
    this.bannerLeft = utils.children(this.banner,'a')[0];
    this.bannerRight = utils.children(this.banner,'a')[1];
    this.divList = this.bannerInner.getElementsByTagName('div');
    this.imgList = this.bannerInner.getElementsByTagName('img');
    this.oLis = this.bannerPage.getElementsByTagName('li');
    
    // 之前的全局变量，也变为私有属性

    this.jsonData = null; //
    this.interval = interval || 3000;
    this.autoTimer = null; 
    this.step = 0;
    this.ajaxUrl = ajaxUrl;
    this.init();
    console.log(this)
    // return this.init();

  }
  AutoBanner.prototype = {
    constructor: AutoBanner,
    // ajax
    getData: function(){
      var _this = this;
      var xhr = new XMLHttpRequest;
      xhr.open('get',this.ajaxUrl+'?_='+Math.random(),false);
    
      xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && /^2\d{2}$/.test(xhr.status)){
        
          _this.jsonData = utils.jsonParse(xhr.responseText);
        }
      }
      xhr.send(null);
    },
    // 数据绑定
    bindData: function(){
      var str1 ='',str2 ='';
      if(this.jsonData){
        for(var i=0;i<this.jsonData.length;i++){
          var curData = this.jsonData[i];
          str1 += '<div><img  data-img="'+curData.img+'"/></div>';
          i===0? str2 += '<li class="bg"></li>': str2 += '<li></li>';
        }
        this.bannerInner.innerHTML = str1;
        this.bannerPage.innerHTML = str2;
      }

    },
    // 延迟加载
    lazyImg: function(){
      var _this =this;
      for(var i=0;i<this.imgList.length;i++){

        (function (i) { 
          var curImg = _this.imgList[i];
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

    },
    // 自动轮播
    autoMove: function(){
      if(this.step == this.divList.length-1){
        this.step  = -1;
      }
      this.step++;
      this.setBanner()



    },
    // 切换效果和焦点对齐
    setBanner: function(){
      for(var i=0;i<this.divList.length;i++){
        var curDiv = this.divList[i];
        if(i === this.step){
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
      for(var i =0;i<this.oLis.length;i++){
        var curLi = this.oLis[i];
        i === this.step? utils.addClass(curLi,'bg'): utils.removeClass(curLi,'bg')
      }

    },
    // 控制自动轮播，左右切换
    mouseEvent: function(){
      var _this = this;
      this.banner.onmouseover = function(){

        clearInterval(_this.autoTimer);
        _this.bannerLeft.style.display = _this.bannerRight.style.display = 'block';
      }
      this.banner.onmouseout = function(){
        _this.autoTimer = setInterval(function(){
          // _this.autoMove.call(_this);
          _this.autoMove();
        },_this.interval);

        _this.bannerLeft.style.display = _this.bannerRight.style.display = 'none';
      }
    },
    // 焦点切换
    pageEvent: function(){
      var _this = this;
      for(var i=0;i<this.oLis.length;i++){
        this.oLis[i].index = i;
        this.oLis[i].onclick =function(){
          _this.step = this.index;
          _this.setBanner()
          
        }
      }


    },
    // 左右切换
    leftRight:function(){
      var _this =this;
      this.bannerRight.onclick = function(){
        _this.autoMove()
      } 
      // 向左
      
      this.bannerLeft.onclick =function(){
        if(_this.step <=0){
          _this.step =  _this.jsonData.length;
        }
        _this.step --;
        _this.setBanner()
      }
    },
    // 当前插件的唯一入口
    init: function () {  
      var _this =this;
      this.getData();
      this.bindData();
      setTimeout(function(){
        _this.lazyImg();
      }, 500);

      this.autoTimer = setInterval(function(){
        _this.autoMove();
      },this.interval);
      

      this.mouseEvent();
      this.pageEvent();
      this.leftRight();
      // console.log(this)
      //  return  this;
    }
  };
  window.AutoBanner = AutoBanner;
})()