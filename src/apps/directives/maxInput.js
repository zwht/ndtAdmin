/**
 * Created by zhaowei on 17/1/14.
 */
var md = require("../module/app");
md.directive('maxInput', ["$parse", "$stage", function ($parse, $stage) {
    return {
        restrict: 'A',
        link: function (scope, tElement, attrs) {
            var obj = $(tElement);
            var max = parseInt(attrs.maxInput);
            var value = obj.val();
            obj.keyup(function (v, d) {
                if ($stage.GetStringByteLength(obj.val()) > max) {
                    obj.val(value);
                    $stage.warning("输入内容太长!不能继续输入")
                } else {
                    value = obj.val();
                }
            })
        }
    }
}]);

