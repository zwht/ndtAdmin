/**
 * Created by xms on 16/12/26.
 */
var md = require("../../module/information");
var common = require("./preScrn_audit_common");
md.controller('auditCtrl', waitingProcessCtrl);
waitingProcessCtrl.$inject = ["ngDialog","$scope", "$timeout", "fileServer", "taskServer", "$stage", "$state", "SweetAlert","$window"];
function waitingProcessCtrl(ngDialog,$scope, $timeout, fileServer, taskServer, $stage, $state, SweetAlert,$window) {
    //不同
    var num = $scope.pageCount;
    function save(key) {
        var arr=[];
        //跨文件的处理，共享了$scope, attTransDetail是一个数组，做类型判断以及判空.
        if($scope.attTransDetail && $scope.attTransDetail.length >0){
            $scope.attTransDetail.forEach(function (item) {
                if(item.trans)arr.push(item.id);
            });
        }
        if(key==0){
            ngDialog.open({
                template: 'page/ngDialog/onAuditReason.html',
                className: 'ngdialog-theme-default onAuditReason',
                controller: ["$scope",
                    function ($scope) {
                        $scope.reason='';
                        $scope.save = function () {
                            saveRequest(key,arr,$scope.reason);
                            $scope.closeThisDialog('$closeButton')
                        };

                    }],
                scope: $scope,
                closeByDocument: false
            });
            return;
        }
        saveRequest(key,arr);
    }
        function saveRequest(key,arr,reason) {
        num--;
        var obj={
            id:$scope.baseDetailsData.id,
            attachmentIds:arr,
            reason:reason
        };
            taskServer.filterAudit({param5: key},obj,
                function (data) {
                    $stage.warning("操作成功!");
                    $scope.fileList.splice($scope.baseDetailsData.index, 1);
                    if (!$scope.fileList.length) {
                        if (num <= 0) {
                            SweetAlert.swal({
                                    title: "审核完成",
                                    text: "返回列表!",
                                    type: "success"
                                },
                                function (data) {
                                    SweetAlert.close();
                                    $scope.back();

                                });
                        }
                        $scope.init(1, $scope.pageSize);
                        return;
                    }
                    $scope.getEmailData(0);
                }, function (err) {
                    $stage.warning("操作失败!");
                })
        }
    //不同
    function allSave() {
        taskServer.reviewFilterListFinish({}, {
            post: $scope.post,
            executor: $scope.executor,
            batch: $scope.batch
        }, function (data) {
            SweetAlert.swal({
                title: "成功!", text: "返回初筛列表!", type: "success"
            }, function (data) {
                SweetAlert.close();
                $scope.back();
            });
        }, function (err) {
        });
    }

    //相同代码
    common($scope, $timeout, fileServer, taskServer, $stage, $state, 2, save, allSave,$window);
}
