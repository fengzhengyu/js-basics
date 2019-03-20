var utils = {
  // 类数组转换数组
  listToArray: function (likeArray) {
    try {
      return Array.prototype.slice.call(likeArray)
    } catch (error) { //参数不能胜
      var ary = [];
      for (var i = 0; i < likeArray.length; i++) {
        ary[ary.length] = likeArray[i];
      }
      return ary;
    }
  },

  // 把json格式的字符串转化为json对象
  jsonParse: function (str) {
    // var val =null;
    // try { 
    //   val = JSON.parse(str)
    // } catch (error) {
    //   val = eval( "(" +str + ")" );
    // }
    // return val;
    // 以上方法不够完美，即使不兼容也会走try里面的代码

    // 优化
    return "JSON" in window ? JSON.parse(str) : eval("(" + str + ")");
  },

  // 取window 属性
  win: function (attr, value) {
    if (typeof value == 'undefined') { //说明value没传参。就获取属性
      return document.documentElement[attr] || document.body[attr];
    }
    //设置属性
    document.documentElement[attr] = value;
    document.body[attr] = value;
  },




  // 获取元素节点系列：
  //  获取某一个容器中的子元素，（可以筛选出指定标签名）
  children: function (ele, tagName) {
    //nodeType 1 说明是元素
    var ary = [];
    // ie 678
    if (/MSIE (6|7|8)/i.test(navigator.userAgent)) {
      var nodeList = ele.childNodes;
      for (var i = 0, len = nodeList.length; i < len; i++) {
        var curNode = nodeList[i];

        curNode.nodeType === 1 ? ary[ary.length] = curNode : null;
      }
    } else {
      // ,在自己命名空间调用自己方法可以用this
      ary = this.listToArray(ele.children); //类数组转化为数组 
    }
    // 二次筛选
    if (typeof tagName === 'string') {
      for (var k = 0; k < ary.length; k++) {
        var curEleNode = ary[k];
        if (curEleNode.nodeName.toLowerCase() !== tagName.toLocaleLowerCase()) { //不是我想要的标签
          // 删除不是我的 
          ary.splice(k, 1);
          k--;
        }
      }
    }
    return ary;
  },
  // 获取上一个哥哥元素
  prev: function(curEle){
    if(/MSIE (6|7|8)/i.test(navigator.userAgent)){
      var pre = curEle.previousSibling; //获取前一个节点（获取的可能是文本或者节点）
      while(pre && pre.nodeType !== 1) { //不是元素 继续虚幻
        pre = pre.previousSibling; //找不到是null 自动停止循环
      }
      return pre;
    }else{
      return curEle.previousElementSibling;
    }
  },
  // 获取下一个弟弟元素
  next: function (curEle){
    if(/MSIE (6|7|8)/i.test(navigator.userAgent)){
      var nex = curEle.nextSibling;

      while(nex && nex.nodeType !== 1){
        nex = nex.nextSibling;
      }
      return nex;
    }else{
      return curEle.nextElementSibling;
    }
  },
  // 获取所有哥哥元素
  prevAll: function (curEle){
    var  ary =[];
    var pre = this.prev(curEle); //获取当前哥哥元素
    while(pre){ 
      ary.unshift(pre); //添加到数组第一个
      pre = this.prev(pre);// 根据当前再找当前哥哥元素，找不到为null
    }
    return ary;
  },
  // 获取所有弟弟元素
  nextAll: function (curEle){
    var ary = [];
    var nex = this.next(curEle);
    while(nex){
      ary.push(nex);
      nex = this.next(nex);
    }
    return ary;
  },
  // 获取相邻的两个元素（前一个后一个）
  sibling: function (curEle){
    var pre = this.prev(curEle),
    nex = this.next(curEle);
    var ary = [];
    
    pre? ary.push(pre): null;
    nex? ary.push(nex): null;

    return ary;

  },
   // 获取所有兄弟节点
   siblings: function (curEle){

    return this.prevAll(curEle).concat(this.nextAll(curEle))
  },
  // 获取当前元素索引
  index: function(curEle){
    return this.prevAll(curEle).length; //所有哥哥的长度
  },
  // 获取第一子元素
  firstChild: function(curEle) {
    var list = this.children(curEle);
    return list.length > 0 ? list[0] : null;
  },
  // 获取最后一个子元素
  lastChild: function (curEle){
    var list = this.children(curEle);
    return list.length > 0? list[list.length-1]: null;

  },

  // 添加元素系列：
  // 向指定容器末尾添加
  append: function(newEle,container){
     container.appendChild(newEle);

  },
  // 向指定容器开头添加
  prepend: function(newEle,container){
    var first = this.firstChild(container);
    if(first){ //有第一个在，在第一个前添加
      container.insertBefore(newEle,first);
    }else{
      container.appendChild(newEle);
    }
  },
  //向容器中指定元素(oldEle)的前面追加
  insertBefore: function(newEle,oldEle){
    oldEle.parentNode.insertBefore(newEle,oldEle);

  },
  // 向容器中指定元素(oldEle)的后面追加
  insertAfter: function(newEle,oldEle){
    var nex = this.next(oldEle); 
    if(nex){//判断当前下一个弟弟元素是否存在，存在，在存在的前面添加一个
      oldEle.parentNode.insertAfter(newEle,nex);
    }else{
      oldEle.parentNode.appendChild(newEle);
    }
  },


  // className系列
  // 含有class名
  hasClass: function(curEle,className){
    var reg = new RegExp("(^| +)" + className +"( +|$)");
    return reg.test(curEle.className);
  },
  // 添加class名
  addClass: function (curEle,className){
    var ary = className.replace(/^ +| +$/g,'').split(/ +/g);

    for(var i = 0;i<ary.length;i++){
      var curName = ary[i];
      if(!this.hasClass(curEle,curName)){
        curEle.className += ' '+curName;
      }
    }
  },
  // 删除class 名
  removeClass: function (curEle,className){
    var ary = className.replace(/^ +| +$/g,'').split(/ +/g);
    for(var i = 0;i<ary.length;i++){
      var curName = ary[i];
      if(this.hasClass(curEle,curName)){
        var reg = new RegExp('(^| +)'+curName+'( +|$)','g');
        curEle.className = curEle.className.replace(reg,' ');

      }
    } 
  },

  // getElementsByClassName
  getElementsByClassName: function (className,context){
    // className 可能是一个或多个
    // context: 可以在对应的上下文中获取，不传默认document
    context = context || document;
    var ary = [];

    if(/MSIE (6|7|8)/i.test(navigator.userAgent)){
      var classNameAry = className.replace(/(^ +| +$)/g, '').split(/ +/g);
      var nodeList = context.getElementsByTagName('*'); 
    
      for(var i=0;i<nodeList.length;i++){
        var curNode = nodeList[i];
        var isOK = true; //假设所有都包含class Ming 
        for(var k=0;k<classNameAry.length;k++){
          var curName =classNameAry[k];
          var reg = new RegExp("(^| +)"+curName+"( +|$)");
          if(!reg.test(curNode.className)){ //不存在
            isOK = false;
            break;
          }
        }
        // 拿拆解的每一样式名分别与所有的样式名比较循后，还是true的话，说明当前元素标签包含了我们想要的 
        if(isOK){
          ary.push(curNode);
        }

      }
      return ary;
    }else{
      ary =  context.getElementsByClassName(className);
      return Array.prototype.slice.call(ary);
    }
    
      

  },

  // 取外部css样式
  getCss: function (curEle, attr) {
    var val = null,
      reg = null;
    if (window.getComputedStyle) {
    
      val = window.getComputedStyle(curEle, null)[attr];
    } else {
      // 如果传递进来是opacity 但在ie678不支持，
      if (attr === 'opacity') {
        val = curEle.currentStyle['filter'];
        var reg1 = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/i; // 第一个分组(\d+(\.\d+)?)，第二个分组(?:\.\d+)?小数可能有 该分组不需要捕获 ?:
        val = reg1.test(val) ? reg1.exec(val)[1] / 100 : 1;
      } else {
        val = curEle.currentStyle[attr];
      }

    }
    reg = /^-?\d+(\.\d+)?(px|pt|em|rem)?$/i;
    
    return reg.test(val) ? parseFloat(val) : val;

  },
  // 设置元素样式
  setCss: function(curEle,attr,value) {
    // js中 float需要兼容
    if(attr === 'float'){
      curEle["style"]["cssFloat"] = value;
      curEle["style"]["styleFloat"] = value;
      return
    }
    // opacity
    if(attr === 'opacity'){
      curEle["style"]["opacity"] = value;
      curEle["style"]["filter"] = "alpha(opacity="+value*100+")";
      return
    }
     //某些样式，如果传递进来没有单位，我们需要把单位默认补上
     var reg =/^(width|height|top|right|bottom|left|((margin|padding)(Top|Right|Bottom|Left)?))$/;
     if(reg.test(attr)){
       if(!isNaN(value)){ //符合正则，且是有效数字
        value +='px';
       }
     }
     curEle["style"][attr] = value
   

  },
  // 批量设置样式
  setGroupCss: function(curEle,options){
    // 保证options是个对象
    options = options || 0;
    if(options.toString() !== "[object Object]"){ //Object.prototype.toString.call(options) 
      return;

    }
    for(var key in options){
      if(options.hasOwnProperty(key)){
        this.setCss(curEle,key,options[key]);
      }
    }
  },
  // 模拟 jquert css() 即可实现获取属性，还能设置属性，也可以批量设置
  css: function(curEle){

    if(typeof arguments[1] === 'string'){
     
      if(typeof arguments[2] === 'undefined'){ //第三个参数不存在
      
        return this.getCss.apply(this,arguments); 

      }
      this.setCss.apply(this,arguments);
    }
    if(arguments[1].toString() === "[object Object]"){
      this.setGroupCss.apply(this,arguments);
    }

  }




}

// 数组去重方法
Array.prototype.myUnique = function(){

  var  obj = {};
  for(var i=0;i<this.length;i++){
    var  cur = this[i];
    if(obj[cur] == cur){ //利用对象key 判断是否存在

      this[i] = this[this.length-1]; //如果重复，当前项=最后一项
      this.length--; //删除最后一项
      i--; // i回退一下
      continue; //跳出本次循环，继续继从当前i循环判断
    }
    obj[cur] = cur;
  }

  obj = null;  //手动释放内存
  return this;
}

// 遍历多维数组

Array.prototype.myEach = function(fn){

  this.i || (this.i = 0);
  while(this.i<this.length){
    var  e = this[this.i];
    if(e && e.constructor == Array){
      e.myEach(fn);
    }else{
      fn.call(e,e);
    }
    

    this.i++;
  }
  this.i = null;

  return this;
}
// 模拟 call

Function.prototype.myCall = function(context){
// this 就是 fn.call() '.'前面的函数 
// content:传进来的对象
  var content = content || window;

  // 1. 让函数this 成为 content对象的一个属性
  content.fn = this;

  // 获取参数
  var ary = [];
  for(var i=0;i<arguments.length;i++){
    ary.push(this.arguments[i]);
  }
  // 2. 执行调用的函数

  var result = eval('content.fn('+ary+')');
  
  // es6 写法 
  // content.fn(...ary);

  //  3. 删除这个属性
  delete content.fn;

  return result;

}


//模拟apply

Function.prototype.myApply = function(context,arr){
  
  var content = content || window;
  var result;
  // 1. 让函数this 成为 content对象的一个属性
  content.fn = this;

  if(!arr){
    result = content.fn();  
  }else{
    // es3写法
    var ary = [];
    for(var i=0;i<arguments.length;i++){
      ary.push(this.arguments[i]);
    }
  
    result = eval('content.fn('+ary+')');

    //es6 
    // result = content.fn(...arr)

    
  }

  //  3. 删除这个属性
  delete content.fn;

  return result;

}