/**
 * Created by xms on 2016/12/15.
 */
//百分百还原过滤器
var md = require("../module/app");
md.filter('reversePercent',function () {
    return function (str) {
        var num =parseInt(str)/100;
        var mynum = new Number(num);
        var newnum =parseFloat(mynum.toFixed(1));
        return newnum;
    }
});