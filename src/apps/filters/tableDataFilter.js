/**
 * Created by xms on 2016/12/20.
 */
//百分百过滤器
var md = require("../module/app");
md.filter('tableDataFilter', function () {
    return function (data, startTime, endTime, flag) {
        var arr = [];
        angular.forEach(data, function (item) {
            var date = parseInt(Date.parse(item.date));
            if (date >= startTime && date <= endTime) {
                if (flag) {
                    if (item.adjunct) {
                        arr.push(angular.copy(item));
                    }
                } else {
                    arr.push(angular.copy(item));
                }
            }
        });
        return arr;
    }
});