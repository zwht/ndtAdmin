var md = require("../../module/other");
md.controller('resetPassword', resetPassword);
resetPassword.$inject = ["$scope", "otherServer", "$state", "$stage", "SweetAlert", "session"];
function resetPassword($scope, otherServer, $state, $stage, SweetAlert, session) {
    $scope.user = $state.params.user;

    $scope.reset = function () {
        $scope.str = "";
        if (($scope.changePasswordTypeFlag && !$scope.oldPassword) || !$scope.newPassword || !$scope.newPassword1) {
            $scope.str = "请完善填写再提交！";
            return;
        }
        if ($scope.newPassword != $scope.newPassword1) {
            $scope.str = "新设密码两次输入不一致！";
            return;
        }
        if ($scope.oldPassword == $scope.newPassword) {
            $scope.str = "新设密码与旧密码一致！";
            return;
        }
        var json = {
            loginAccount: $scope.user,
            oldPassword: btoa($scope.oldPassword),
            newPassword: btoa($scope.newPassword)
        };
        if (!$scope.changePasswordTypeFlag) {
            otherServer.zip({param3: btoa($scope.newPassword)}, {}, function () {
                $stage.success("设置ZIP解压密码成功！");
            }, function () {
                $stage.danger("设置ZIP解压密码失败！");
            });
        }
        else {
            otherServer.resetPsw({}, json, function (data) {
                if (data.status == 200) {
                    var access_token = session.get("access_token");
                    otherServer.goOut({param2: access_token}, {}, function (data) {
                        session.remove("access_token");
                        session.remove("userName");
                        session.remove("password");
                        alert()
                    }, function (err) {
                        SweetAlert.close();
                        $stage.warning("错误!重新登录！");
                        $state.transitionTo("login");
                    });
                } else {
                    $scope.str = "原始密码错误"
                }

            }, function (err) {
                $stage.warning("服务器错误!")

            })
        }
    };
    if (!session.get("access_token") || !session.get("userName") || !session.get("userName")) {
        alert();
    }
    function alert() {
        SweetAlert.swal(
            {
                title: "保存成功",
                text: "你的账户信息已修改,请重新登陆",
                type: "success",
                showCancelButton: false,
                confirmButtonColor: "#259258",
                confirmButtonText: "重新登录",
                cancelButtonText: "取消",
                closeOnConfirm: false
            }, function (da) {
                if (da) {
                    SweetAlert.close();
                    $state.transitionTo("login");
                }
            });
    }

    $scope.changePasswordTypeFlag = 1;
    $scope.changePasswordType = function (num) {
        $scope.changePasswordTypeFlag = num;
        $scope.newPassword = $scope.oldPassword = $scope.newPassword1 = '';
    };
}
