/**
 * Created by zhaowei on 16/12/19.
 */

var md = require("../../module/task");
md.controller('filterTaskCtrl', filterTaskCtrl);
filterTaskCtrl.$inject = ["$scope", "$state", "taskServer", "privilegeServer", "$stage"];
function filterTaskCtrl($scope, $state, taskServer, privilegeServer, $stage) {
    $scope.loadingShow = true;
    $scope.pageSize = $state.params.pageSize || 30;
    $scope.pageCurrent = $state.params.pageCurrent || 1;
    $scope.city = $state.params.city || null; //任务来源城市
    $scope.department = $state.params.department || null; //任务来源部门
    $scope.position = $state.params.position || null; //任务来源职位
    $scope.pageName=$state.current.data.name;
    if($state.current.name=="admin.task.filterTask"){
        $scope.nodeTypeID = 1;
    }else{
        $scope.nodeTypeID = 2;
    }


    $scope.init = init;

    $scope.goCS = function (item) {
        var obj = {
            batch: item.groupVo.batch,
            executor: item.groupVo.executor,
            post: item.groupVo.post,
            fileType: item.fileType,
            priority: item.priority,
            deadline: item.deadline,
            total:item.desc
        };
        switch (item.nodeType) {
            case 1:
                $state.go("admin.task.preScrn", obj);
                break;
            case 2:
                $state.go("admin.task.audit", obj);
                break;
        }
    };
    //分页的回调
    $scope.callBack = function (page, size, cunt) {
        $scope.loadingShow = true;
        $scope.pageCurrent = page;
        $scope.pageSize = size;
        heaf();
        getData()
    };

    //下拉任务类型进行筛选
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
            city:$scope.city,
            department:$scope.department,
            position:$scope.position
        });
    }
    function getData() {
        var json = {
            fileSearchVo: {
                country:$scope.city,
                department:$scope.department,
                post: $scope.position
            },
            nodeType: $scope.nodeTypeID,
            handler: true
        };
        $scope.loadingShow = true;
        taskServer.getFilterList({param5: $scope.pageCurrent, param6: $scope.pageSize}, json, function (data) {
            $scope.pageCount = data.totalElement;
            angular.forEach(data.voLists, function (item) {
                item.desc =parseInt(item.desc.substr(item.desc.lastIndexOf("/")+1));
            });
            $scope.ListData = data.voLists;
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
            if (item == 1) {
                scopeKey++;
                role = 1;
            }
            if (item == 2) {
                scopeKey++;
                role = 2;
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
