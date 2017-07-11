/**
 * Created by Administrator on 2017/1/9.
 */
var md = require("../module/app");
md.directive('screenChange', function () {
    return {
        restrict: 'A',
        replace: true,
        template: "",
        link: function (scope, element, attr) {
            $(window).resize(function () {          //当浏览器大小变化时
                var screenAreaH=element.find(".screenArea").height();
                var contBoxP=element.find(".contBox");
                if(screenAreaH<50){
                    contBoxP.css("padding","100px 15px 15px")
                }else if(50<screenAreaH && screenAreaH<90){
                    contBoxP.css("padding","130px 15px 15px")
                }else if(screenAreaH>90){
                    contBoxP.css("padding","170px 15px 15px")
                }
            });
        }
    };
});


