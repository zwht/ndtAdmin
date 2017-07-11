var md = require("../module/app");
md.directive('focus', function() {
        return {
            restrict: 'A',
            link:function (scope,tElement) {
                $(tElement).on("click",function () {
                    $(this).find('input').focus();
                });
            }
        }
    });


