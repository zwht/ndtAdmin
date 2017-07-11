/**
 * Created by zhaowei on 16/12/14.
 */
var md = require("../../module/demo");
md.controller('paginationCtrl', paginationCtrl);
paginationCtrl.$inject = ["$scope", "fileServer"];
function paginationCtrl($scope, fileServer) {
    $scope.onPageChange = function () {
        // ajax request to load data
        console.log($scope.currentPage);
    };

    // set pagecount in $scope

    $scope.pageCurrent = 1;
    $scope.pageSize = 10;
    $scope.callBack = function (page) {

    };
    setTimeout(function () {
        $scope.pageCount = 5;
        $scope.$apply();
    }, 1000)
    $scope.showFileConten = fileServer.fileContent;
    $scope.item={fileId:999,fileType:2}
}
