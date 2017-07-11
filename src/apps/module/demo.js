/**
 * Created by Administrator on 2016/12/6.
 */
var md = angular.module("demoModule", []);

md.config(appConfig);
appConfig.$inject = ["$stateProvider"];
function appConfig($stateProvider) {
    var routeList = [
        {
            name: "admin.demo",
            abstract: true,
            url: '/demo',
            templateUrl: ('page/common/subMenu.html'),
            reloadOnSearch: false,
            controller: 'subMenu',
            data: {
                name: "demo例子",
                parent: "bigMenu",
                role: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            }
        },
        {
            name: "admin.demo.icon",
            url: '/icon',
            templateUrl: ('page/demo/icon.html'),
            reloadOnSearch: false,
            controller: 'iconCtrl',
            data: {
                name: "icon图标",
                parent: "admin.demo",
                role: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            }
        },
        {
            name: "admin.demo.wangeditor2",
            url: '/wangeditor2',
            templateUrl: ('page/demo/wangeditor2.html'),
            reloadOnSearch: false,
            controller: 'wangeditor2Ctrl',
            data: {
                name: "wangeditor2富文本编辑器",
                parent: "admin.demo",
                role: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            }
        },
        {
            name: "admin.demo.pagination",
            url: '/pagination/:pageSize/:page',
            templateUrl: ('page/demo/pagination.html'),
            reloadOnSearch: false,
            controller: 'paginationCtrl',
            data: {
                name: "pagination分页",
                parent: "admin.demo",
                role: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            }
        },
        {
            name: "admin.demo.ngDialog",
            url: '/ngDialog',
            templateUrl: ('page/demo/ngDialog.html'),
            reloadOnSearch: false,
            controller: 'ngDialogCtrl',
            data: {
                name: "ngDialog弹框",
                parent: "admin.demo",
                role: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            }
        },
        {
            name: "admin.demo.laydate",
            url: '/laydate',
            templateUrl: ('page/demo/laydate.html'),
            reloadOnSearch: false,
            controller: 'laydateCtrl',
            data: {
                name: "laydate日期插件",
                parent: "admin.demo",
                role: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            }
        },
        {
            name: "admin.demo.contextMenu",
            url: '/contextMenu',
            templateUrl: ('page/demo/contextMenu.html'),
            reloadOnSearch: false,
            controller: 'contextMenuCtrl',
            data: {
                name: "右键菜单",
                parent: "admin.demo",
                role: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            }
        }
    ];
    angular.forEach(routeList, function (item) {
        $stateProvider.state(item.name, item);
    });
}
module.exports = md;
