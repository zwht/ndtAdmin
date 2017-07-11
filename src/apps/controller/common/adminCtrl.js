/**
 * Created by Administrator on 2016/12/6.
 */
var md = require("../../module/app");
md.controller('adminCtrl', adminCtrl);

adminCtrl.$inject = ["$rootScope", "$scope", "$state", "theme", "session", "otherServer", "$stage"];
function adminCtrl($rootScope, $scope, $state, theme, session, otherServer, $stage) {
    /**主题颜色配置，根据gulpfile.js内的COLORS对象配置**/
    $scope.themeChange=function (name) {
        theme.setTheme(name)
    };
    $scope.themes = theme.themeList;
    $scope.jump=function (item) {
        if(item.data&&item.data.char&&item.data.char.length){
            $state.transitionTo(item.data.char[0].name);
        } else {
            $state.go(item.name);
        }
        $scope.PhoneNav=!$scope.PhoneNav;
    };
    $scope.jumpSub = function (item) {
        $state.transitionTo(item.name);
    };
    $scope.showPhoneNav=false;
    $scope.showPhoneNav=function () {
        $scope.PhoneNav=!$scope.PhoneNav
    };

    $scope.showThemeKey=false;
    $scope.showTheme=function () {
        $scope.showThemeKey=!$scope.showThemeKey;
    };
    $scope.showUserBoxKey=false;
    $scope.showUserBox=function () {
        $scope.showUserBoxKey=!$scope.showUserBoxKey;
    };
    angular.element(document).on('click',function (event) {
        if(event.target.className=="clickBtn") return;
        $scope.showThemeKey=false;
        $scope.showUserBoxKey=false  ;
        $scope.$apply();
    });
    $scope.userName = session.get("userName");
    $scope.goOut = function () {
        var access_token = session.get("access_token");
        otherServer.goOut({param2: access_token}, {}, function (data) {
            session.remove("access_token");
            $state.transitionTo("login");
        }, function (err) {
            $stage.warning("退出失败!");
            $state.transitionTo("login");
        });

    };
    $scope.goResetPassword=function () {
        $state.go('admin.resetPassword', {user: $scope.userName});
        $scope.showUserBoxKey=false;
    }

}


