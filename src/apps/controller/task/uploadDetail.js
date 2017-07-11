/**
 * Created by zhaowei on 16/12/13.
 */
var md = require("../../module/task");
md.controller('uploadDetailCtrl', uploadDetailCtrl);
uploadDetailCtrl.$inject = ["$scope", "taskServer", "$state"];
function uploadDetailCtrl($scope, taskServer, $state) {
    $scope.goList = function () {
        $state.go('admin.task.uploadList')
    };
    $scope.timeId = $state.params.timeId;
    $scope.detailStatus = $state.params.status;
    $scope.page = $state.params.page || 1;
    $scope.pageCurrent = $state.params.page || 1;
    $scope.itemQuantity = $state.params.size || 10;
    $scope.pageSize = $state.params.size || 10;
    $scope.status = $state.params.state || undefined;
    $scope.loadingShow = true;
    $scope.loadingShow1 = false;
    $scope.failed = $state.params.failed;
    $scope.batch = $state.params.batch;
    //$scope.showFileConten = fileServer.fileContent;
    function getUpLoadList(page, size) {
        $scope.loadingShow1 = true;
        var vo = {
            id: parseInt($scope.timeId),
            status: $scope.status ? parseInt($scope.status) : undefined
        };
        href();
        taskServer.upLoadDetail({param5: page, param6: size}, vo, function (data) {
            $scope.data = data.voLists;
            $scope.pageCount = data.totalElement;
            $scope.loadingShow = false;
            $scope.loadingShow1 = false;
        }, function (err) {
            $scope.loadingShow = false;
            $scope.loadingShow1 = false;
        })
    }

    getUpLoadList($scope.page, $scope.itemQuantity);
    $scope.change = function () {
        getUpLoadList($scope.page, $scope.itemQuantity);
    };
    $scope.callBack = function (page, itemQuantity) {
        $scope.page = page;
        $scope.itemQuantity = itemQuantity;
        getUpLoadList(page, itemQuantity);
        href();
    };
    function href() {
        $state.go('admin.task.uploadDetail', {page: $scope.page, size: $scope.itemQuantity, state: $scope.status})
    }

    $scope.listFileExport = function () {
        var status = $scope.status;
        if (status == undefined || status == "") status = 2;
        window.location.href = "/ms/file/updload/history/detail/export/" + parseInt($scope.timeId) + "/" + status;
    }
}
