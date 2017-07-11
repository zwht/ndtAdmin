/**
 * Created by Administrator on 2016/12/6.
 */
var md = angular.module("otherModule", []);

md.config(appConfig);
appConfig.$inject = ["$stateProvider", "$urlRouterProvider"];
function appConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');
    var routeList = [
        {
            name: "login",
            url: '/login',
            templateUrl: ('page/other/login.html'),
            reloadOnSearch: false,
            data: {
                name: "登陆",
                parentNode: false

            },
            controller: 'loginCtrl'
        },
        {
            name: "admin.index",
            url: '/index',
            templateUrl: ('page/other/index.html'),
            reloadOnSearch: false,
            controller: 'indexCtrl',
            data: {
                name: "首页",
                parent: "bigMenu",
                role: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            }
        },
        {
            name: "admin.resetPassword",
            url: '/resetPassword/:user',
            templateUrl: ('page/other/resetPassword.html'),
            reloadOnSearch: false,
            controller: 'resetPassword',
            data: {
                role: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            }
        }
    ];
    angular.forEach(routeList, function (item) {
        $stateProvider.state(item.name, item);
    });
}
module.exports = md;
