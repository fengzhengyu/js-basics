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

  //  获取某一个容器中的子节点，（可以筛选出指定标签名）
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
  // 
  firstChild: function(curEle) {
    var list = this.children(curEle);
    return list.length > 1 ? list[0] : null;
  }
}