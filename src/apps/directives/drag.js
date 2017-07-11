var md = require("../module/app");
md.directive('drag', ["$window",function($window) {
        return {
            restrict: 'A',
            link:function (scope,tElement) {
                var ptE =angular.element(tElement);
                var $firstE =ptE.children(':first');
                /*$firstE.css({
                    "-webkit-user-select":"none",
                    "-moz-user-select":"none",
                    "-ms-user-select":"none",
                    "user-select":"none"
                 });*/
                var flag;
                var $lastE =$firstE.next();
                var w1=$window.localStorage.firstE;
                var w2=$window.localStorage.lastE;
                console.log(w1,w2);
                w1&&$firstE.css("width",w1);
                w2&&$lastE.css("width",w2);
                ptE.on('mousedown',function (e) {
                    var eE =e.target;
                    if(eE!=$firstE[0]&&!$(eE).hasClass('icon-ic_threebox'))return;
                    var sx =e.clientX;
                    var w1 =$firstE.outerWidth();
                    var w2 =$lastE.outerWidth();
                    flag =true;
                    ptE.on('mousemove',function (e) {
                        var width =ptE.width();
                        var x =e.clientX;
                        var fw=(w1-(sx-x))/width*100;
                        var lw=(w2+(sx-x))/width*100;
                        if(fw <= 30){
                            fw=30;
                            lw=70;
                        }else if(fw>=70){
                            lw=30;
                            fw=70;
                        }
                        $firstE.css('width',fw+"%");
                        $lastE.css('width',lw+"%");
                    });
                });
                ptE.on("mouseup",function () {
                    if(flag){
                        ptE.off('mousemove');
                        var width =ptE.width();
                        var a =$firstE.outerWidth()/width*100+"%";
                        var b =$lastE.outerWidth()/width*100+"%";
                        $window.localStorage.setItem("firstE",a);
                        $window.localStorage.setItem("lastE",b);
                    }
                    flag=false;
                });
            }
        }
    }]);


