/**
 * Created by zhaowei on 16/12/13.
 */
var md = require("../../module/task");
md.controller('uploadListCtrl', uploadListCtrl);
uploadListCtrl.$inject = ["$scope", "taskServer", "$state"];
function uploadListCtrl($scope, taskServer, $state) {
    $scope.loadingShow=true;
    $scope.pageSize = $state.params.pageSize || 30;
    $scope.pageCurrent = $state.params.pageCurrent || 1;
    $scope.startTime = $state.params.startTime || undefined;
    $scope.endTime = $state.params.endTime || undefined;
    $scope.callBack = function (page, itemQuantity) {
        $scope.loadingShow1=true;
        $scope.pageSize = itemQuantity;
        $scope.pageCurrent = page;
        getData();
        href();
    };

    function getData() {
        var vo = {
            uploadTimeStart:(new Date($scope.startTime)).getTime(),
            uploadTimeEnd:(new Date($scope.endTime)).getTime()
        };
        taskServer.upLoad({param4: $scope.pageCurrent, param5: $scope.pageSize}, vo, function (data) {
            $scope.data = data.voLists;
            $scope.pageCount = data.totalElement;
            $scope.loadingShow=false;
            $scope.loadingShow1=false;
        }, function (err) {

        })
    }

    getData();
    function href() {
        $state.go("admin.task.uploadList", {
            pageSize: $scope.pageSize,
            pageCurrent: $scope.pageCurrent,
            startTime: $scope.startTime,
            endTime:$scope.endTime
        });
    }

    $scope.search = function () {
        $scope.pageCurrent = 1;
        href();
        getData();
    };

    $scope.goDetail = function (obj) {
        $state.go('admin.task.uploadDetail', {
            timeId: obj.id, status: obj.status,
            failed: obj.failed, batch: obj.batch
        })
    };

    $scope.desc=true;
    $scope.sort="batch"
    $scope.sortChange=function(type){
        $scope.sort=type;
        $scope.desc=!$scope.desc;
    }
}
