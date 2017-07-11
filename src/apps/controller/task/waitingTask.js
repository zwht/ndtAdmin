/**
 * Created by zhaowei on 16/12/19.
 */

var md = require("../../module/task");
md.controller('waitingTaskCtrl', waitingTaskCtrl);
waitingTaskCtrl.$inject = ["$scope", "$state", "taskServer", "privilegeServer", "$stage"];
function waitingTaskCtrl($scope, $state, taskServer, privilegeServer, $stage) {
    $scope.loadingShow = true;
    $scope.pageSize = $state.params.pageSize || 30;
    $scope.pageCurrent = $state.params.pageCurrent || 1;
    $scope.city = $state.params.city || null; //任务来源城市
    $scope.department = $state.params.department || null; //任务来源部门
    $scope.position = $state.params.position || null; //任务来源职位
    $scope.fileName = $state.params.fileName || null; //文件名称

    $scope.pageName=$state.current.data.name;
    if($state.current.name=="admin.task.waitingTask"){
        $scope.nodeTypeID = 3;
    }else{
        $scope.nodeTypeID = 4;
    }

    $scope.init = init;

    $scope.goCS = function (item) {
        switch (item.taskType) {
            case 3:
                $state.go("admin.task.translate", {fileId: item.fileId});
                break;
            case 4:
                $state.go("admin.task.translateCheck", {fileId: item.fileId});
                break;
        }
    };
    $scope.callBack = function (page, size, cunt) {
        $scope.loadingShow = true;
        $scope.pageCurrent = page;
        $scope.pageSize = size;
        heaf();
        getData()
    };
    $scope.taskScreen = function () {
        $scope.loadingShow = true;
        $scope.pageCurrent = 1;
        heaf();
        getData();
    };
    function heaf() {
        $state.go($state.current.name, {
            pageSize: $scope.pageSize,
            pageCurrent: $scope.pageCurrent,
            city: $scope.city,
            department: $scope.department,
            position: $scope.position,
            fileName:$scope.fileName
        });
    }

    function getData() {
        var json = {
            fileSearchVo: {
                country: $scope.city,
                department: $scope.department,
                post: $scope.position,
                fileName: $scope.fileName
            },
            nodeType: $scope.nodeTypeID,
            handler: true
        };
        $scope.loadingShow = true;
        taskServer.getTaskList({param4: $scope.pageCurrent, param5: $scope.pageSize}, json, function (data) {
            $scope.ListData = [];
            $scope.pageCount = data.totalElement;
            angular.forEach(data.voLists, function (item) {
                $scope.ListData.push(item)
            });
            $scope.loadingShow = false;
        }, function (err) {
            $scope.loadingShow = false;
        })
    }

    function init() {
        setRole();
        getData();
    }

    function setRole() {
        var scopeKey = 0, role = 0;
        angular.forEach(privilegeServer.getRole(), function (item) {
            if (item == 3) {
                scopeKey++;
                role = 3;
            }
            if (item == 4) {
                scopeKey++;
                role = 4;
            }
        });
    }

    $scope.desc=true;
    $scope.sort="createTime"
    $scope.sortChange=function(type){
        $scope.sort=type;
        $scope.desc=!$scope.desc;
    }
}
