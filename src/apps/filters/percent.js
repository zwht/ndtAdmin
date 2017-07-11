/**
 * Created by xms on 2016/12/15.
 */
//百分百过滤器
var md = require("../module/app");
md.filter('percent',function () {
    return function (num) {
        var mynum = new Number(num);
        var newnum =mynum.toFixed(2)*100 +'%';
        return newnum;
    }
});