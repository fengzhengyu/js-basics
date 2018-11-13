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
  jsonParse:function(str){
    // var val =null;
    // try { 
    //   val = JSON.parse(str)
    // } catch (error) {
    //   val = eval( "(" +str + ")" );
    // }
    // return val;
    // 以上方法不够完美，即使不兼容也会走try里面的代码

    // 优化
    return "JSON" in window ? JSON.parse(str) : eval("("+ str +")");
  }
}