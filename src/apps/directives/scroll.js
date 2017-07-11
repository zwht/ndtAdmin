var md = require("../module/app");
md.directive('ngScroll', function() {
    return {
        restrict: 'A',
        scope:{
            ngScroll:"=",
            checkScrollBar:"="
        },
        link:function (scope,tElement) {
            var ptE =$(tElement);
            var children =ptE.children();
            function aaa() {
                var childrensHight =0;
                var clientHeight =ptE[0].clientHeight;
                angular.forEach(children,function (item) {
                    childrensHight+=item.clientHeight;
                });
                if(scope.checkScrollBar instanceof Object){
                    if(childrensHight<=clientHeight){
                        scope.checkScrollBar(true);return
                    }
                    scope.checkScrollBar(false);
                }
            }
            setTimeout(aaa,30);
            // debugger;
            ptE.on("click",aaa);
            $(window).on("resize",aaa);
            ptE.on("scroll",function (e) {
                var scrollHeight =ptE[0].scrollHeight;
                var clientHeight =ptE[0].clientHeight;
                var scrollTop =ptE.scrollTop();
                if(scope.ngScroll instanceof Object&&scrollTop==scrollHeight-clientHeight){
                    scope.ngScroll();
                }
            });
        }
    }
});