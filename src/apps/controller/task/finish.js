/**
 * Created by zhaowei on 16/12/13.
 */
var md = require("../../module/task");
md.controller('finishCtrl', finishCtrl);
finishCtrl.$inject = ["$scope", "taskServer","$state","fileServer"];
function finishCtrl($scope, taskServer,$state,fileServer) {
    $scope.showFileConten = fileServer.fileContent;
    $scope.taskList=[
        {
            id:null,
            name:"全部"
        },
        {
            id:1,
            name:"初筛"
        },
        {
            id:2,
            name:"初筛审核"
        },
        {
            id:3,
            name:"翻译"
        },
        {
            id:4,
            name:"校对"
        }
    ];
    $scope.loadingShow=true;
    $scope.pageSize = $state.params.pageSize || 30;
    $scope.pageCurrent = $state.params.pageCurrent || 1;
    $scope.keyWord=$state.params.keyword || null;
    $scope.nodeTypeID = Number($state.params.nodeTypeID) ? Number($state.params.nodeTypeID) : null;
    $scope.startTime="";
    $scope.endTime="";

    angular.forEach($scope.taskList, function (obj) {
        if (obj.id == Number($scope.nodeTypeID&&$scope.nodeTypeID)) {
            $scope.nodeType = obj;
        }
        if(!$scope.nodeTypeID){
            $scope.nodeType=$scope.taskList[0]
        }
    });

    $scope.callBack = function (page, itemQuantity) {
        $scope.loadingShow1 = true;
        $scope.pageCurrent=page;
        $scope.pageSize=itemQuantity;
        getData();
        heaf()
    };
    function heaf() {
        $state.go("admin.task.finish", {
            pageSize: $scope.pageSize,
            pageCurrent: $scope.pageCurrent,
            nodeTypeID: $scope.nodeType.id,
            keyword:$scope.keyWord
        });
    }

    function getData() {
        var json={

            "executor": $scope.keyWord?$scope.keyWord:undefined,
            "name": $scope.name?$scope.name:undefined,
             "nodeType":$scope.nodeType.id
        };
        taskServer.getFinishJob({param5:$scope.pageCurrent,param6:$scope.pageSize},json,function (data) {
            $scope.data=data.voLists;
            $scope.pageCount=data.totalElement;
            $scope.loadingShow=false;
            $scope.loadingShow1=false;
        },function (err) {
            $scope.loadingShow=false;
            $scope.loadingShow1=false;
        })
    }
    getData();
    $scope.change=function () {
        $scope.loadingShow1=true;
        $scope.pageCurrent=1;
        getData();
        heaf()
    };

    $scope.desc=true;
    $scope.sort="taskType"
    $scope.sortChange=function(type){
        $scope.sort=type;
        $scope.desc=!$scope.desc;
    }
}


