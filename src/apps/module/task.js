/**
 * Created by Administrator on 2016/12/6.
 */
var md = angular.module("taskModule", []);

md.config(appConfig);
appConfig.$inject = ["$stateProvider"];
function appConfig($stateProvider) {
    var routeList = [
        {
            name: "admin.task",
            abstract: true,
            url: '/task',
            templateUrl: 'page/common/subMenu.html',
            reloadOnSearch: false,
            controller: 'subMenu',
            data: {
                name: "信贷管理",
                parent: "bigMenu",
                role: [1,2,3,4,5,6,7,8,9,10]
            }
        },

        {
            name: "admin.task.filterDistribution",
            url: '/filterDistribution?pageSize?pageCurrent?nodeTypeID?dealUserId?priority?removeUserId?city?department?position',
            templateUrl: 'page/task/filterDistribution.html',
            reloadOnSearch: false,
            controller: 'filterDistributionCtrl',
            data: {
                name: "贷款产品",
                parent: "admin.task",
                role: [1,2,3,4,5,6,7,8,9,10]
            }
        },
        {
            name: "admin.task.filterTask",
            url: '/filterTask?pageSize?pageCurrent?nodeTypeID?city?department?position',
            templateUrl: 'page/task/filterTask.html',
            reloadOnSearch: false,
            controller: 'filterTaskCtrl',
            data: {
                name: "贷款服务",
                parent: "admin.task",
                role: [1,2,3,4,5,6,7,8,9,10]
            }
        },

        {
            name: "admin.task.filterDistributionAudit",
            url: '/filterDistributionAudit?pageSize?pageCurrent?nodeTypeID?dealUserId?priority?removeUserId?city?department?position',
            templateUrl: 'page/task/filterDistribution.html',
            reloadOnSearch: false,
            controller: 'filterDistributionCtrl',
            data: {
                name: "信用指标",
                parent: "admin.task",
                role: [1,2,3,4,5,6,7,8,9,10]
            }
        }
    ];
    angular.forEach(routeList, function (item) {
        $stateProvider.state(item.name, item);
    });
}
module.exports = md;
