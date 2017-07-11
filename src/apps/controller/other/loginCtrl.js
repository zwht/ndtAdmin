/**
 * Created by Administrator on 2016/12/6.
 */

var md = require("../../module/other");
md.controller('loginCtrl', loginCtrl);
loginCtrl.$inject = ["$scope", "otherServer", "$state", "session", "$stage","SweetAlert","ipAddress"];
function loginCtrl($scope, otherServer, $state, session, $stage,SweetAlert,ipAddress) {
    $scope.loginText="登录";
    $scope.KeepPwd = false;
    $scope.sessionPwd = session.get("password");
    $scope.sessionUser = session.get("userName");
    if ($scope.sessionPwd && $scope.sessionUser) {
        $scope.userName = $scope.sessionUser;
        $scope.password = atob($scope.sessionPwd);
        $scope.KeepPwd = true;
    }
    $scope.loginGo = function () {
        $state.go("admin.index");
        return;
        $scope.loginText="登录中";
        var json = {
            username: $scope.userName,
            password: btoa($scope.password),
            grant_type: "password",
            client_id: "1"
        };
        otherServer.login({}, json, function (data) {
                $scope.loginText="登录";
                session.set("access_token", data.access_token);
                session.set("userName", $scope.userName);
                if ($scope.KeepPwd) session.set("password", btoa($scope.password));
                setScope();
            },
            function (data) {
                if(data.data.error=="insufficient_scope"){
                    $scope.loginText="登录";
                    $scope.err="用户名已经被禁用";
                }else if(data.data.error=="invalid_grant"){
                    $scope.loginText="登录";
                    $scope.err="用户名或密码错误!";
                }
            });
    };

    function setScope() {
        otherServer.getUserRole({}, {}, function (data) {
            if(!data.length) {
                SweetAlert.swal(
                    {
                        title: "没有权限!",
                        text: "请联系管理员",
                        type: "error",
                        confirmButtonText: "确定"
                    }, function () {
                        //$state.go("login");
                    }
                );
            }
            var str = "";
            angular.forEach(data, function (item) {
                str += item + '#%#';

            });
            session.set("scope", str);
            //登录成功.传用户名 ip 和浏览器信息
            //$scope.insideIP 局域网ip    外网ip$scope.returnCitySN["cip"]
            $scope.clientInfo=navigator.userAgent;
            var param={
                loginAccount:$scope.userName,
                ipAddress:$scope.insideIP,
                clientInfo:$scope.clientInfo
            };
            otherServer.saveBrowser({}, param, function (data) {
            });
            $state.go("admin.index");
        }, function (err) {
            $scope.loginText="登录";
            $scope.err="登录失败";
        });
    }
    $scope.loginFoucus=function(){
        $scope.err=""
    };
    $(document).one('keydown', function (event) { //用one方法能解决keydown事件多次执行的bug
        if ($state.current.name != 'login') return;
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 13) { // enter 键
            $scope.loginGo();
            $scope.$apply();
        }
    });
    $scope.choose = function () {
        $scope.KeepPwd = !$scope.KeepPwd
    };
    //调用服务获取局域网的ip信息
    setTimeout(function () {
        $scope.insideIP=ipAddress.getIp();
    },100)
}