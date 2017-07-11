/**
 * Created by zhaowei on 2017/7/11.
 */

var md = angular.module("informationModule", []);

md.config(appConfig);
appConfig.$inject = ["$stateProvider"];
function appConfig($stateProvider) {
    var routeList = [
        {
            name: "admin.information",
            abstract: true,
            url: '/information',
            templateUrl: 'page/common/subMenu.html',
            reloadOnSearch: false,
            controller: 'subMenu',
            data: {
                name: "信息管理",
                parent: "bigMenu",
                role: [1,2,3,4,5,6,7,8,9,10]
            }
        },
        {
            name: "admin.information.preScrn",
            url: '/preScrn?batch?executor?post?fileType?priority?deadline?total',
            templateUrl: 'page/task/preScrn.html',
            reloadOnSearch: false,
            controller: 'preScrnCtrl',
            data: {
                name: "政策咨询",
                parent: "admin.information",
                role: [1,2,3,4,5,6,7,8,9,10]
            }
        },
        {
            name: "admin.information.filterDistribution",
            url: '/filterDistribution?pageSize?pageCurrent?nodeTypeID?dealUserId?priority?removeUserId?city?department?position',
            templateUrl: 'page/task/filterDistribution.html',
            reloadOnSearch: false,
            controller: 'filterDistributionCtrl',
            data: {
                name: "信息采集",
                parent: "admin.information",
                role: [1,2,3,4,5,6,7,8,9,10]
            }
        }
    ];
    angular.forEach(routeList, function (item) {
        $stateProvider.state(item.name, item);
    });
}
module.exports = md;