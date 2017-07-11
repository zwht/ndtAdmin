/**
 * Created by xms on 16/12/23.
 */
var md = require("../../module/information");
var common = require("./preScrn_audit_common");
md.controller('preScrnCtrl', waitingProcessCtrl);
waitingProcessCtrl.$inject = ["$scope", "$timeout", "fileServer", "taskServer", "$stage", "$state", "SweetAlert","$window"];
function waitingProcessCtrl($scope, $timeout, fileServer, taskServer, $stage, $state, SweetAlert,$window) {
    //不同
    function save() {
        if (!$scope.baseDetailsData.important) {
            taskServer.signUnimportant({},
                {
                    id: $scope.baseDetailsData.id,
                    reason:$scope.baseDetailsData.reason,
                    importantGrade:3,
                    transAttachments:[]
                },
                function () {
                    $stage.warning("操作成功");
                    $scope.changeEmail(1);
                    deleteFilterListItem($scope.baseDetailsData.id)

                },
                function (err) {
                    $stage.warning("操作失败");
                });
        } else {
            var arr = [];
            angular.forEach($scope.attTransDetail, function (item) {
                if (item.trans)arr.push(item.id);
            });
            var vo = {
                id: $scope.baseDetailsData.id,
                importantGrade: 1,
                reason: $scope.baseDetailsData.reason,
                transAttachments: arr
            };
            console.log("arr",arr);
            taskServer.signImportant({}, vo, function () {
                    $stage.warning("操作成功");
                    $scope.changeEmail(1);
                    deleteFilterListItem($scope.baseDetailsData.id);
                },
                function (err) {
                    $stage.warning("操作失败");
                });
        }

    }

    //不同
    function allSave() {
        taskServer.FilterListFinish({}, {
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

    function deleteFilterListItem(id){
        debugger;
        angular.forEach($scope.fileList,function(obj,index){
            if(obj.id==id) $scope.fileList.splice(index,1);
        })
    }
    //相同代码
    common($scope, $timeout, fileServer, taskServer, $stage, $state,
     1, save, allSave,$window);
}
