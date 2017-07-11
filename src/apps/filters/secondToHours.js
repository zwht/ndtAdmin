/**
 * Created by zhaowei on 16/12/27.
 */

var md = require("../module/app");
md.filter('secondToHours', function () {
    return function (value) {
        var theTime = parseInt(value);// 秒
        var theTime1 = 0;// 分
        var theTime2 = 0;// 小时
        if(theTime > 60) {
            theTime1 = parseInt(theTime/60);
            theTime = parseInt(theTime%60);
            if(theTime1 > 60) {
                theTime2 = parseInt(theTime1/60);
                theTime1 = parseInt(theTime1%60);
            }
        }
        var result ={
            s: theTime>=10?theTime:"0"+theTime,
            m: theTime1>=10? theTime1 : "0" + theTime1,
            h: theTime2>=10? theTime2 : "0" + theTime2
        };
        return result.h+"小时"+result.m+"分钟"+result.s+"秒";
    }
});