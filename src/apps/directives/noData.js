/**
 * Created by zhaowei on 16/12/29.
 */
var md = require("../module/app");
md.directive('noData', function () {
    return {
        restrict: 'A',
        replace: true,
        template: "<div class='noData middle'><div><i class='icon icon-logo'></i><span>暂无数据</span></div></div>",
        link: function (scope, element, attr) {
        }
    };
});


