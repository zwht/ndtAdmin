/**
/**
 * Created by zhaowei on 17/6/30.
 */
var md = require("../../module/task");
md.controller('noAuditCtrl', noAuditCtrl);
noAuditCtrl.$inject = ["$scope","taskServer","ngDialog",'session','$stage'];
function noAuditCtrl($scope,taskServer,ngDialog,session,$stage) {
    var scope =session.get("scope").split('#%#');
    ///////////
    $scope.pageCurrent=1;
    $scope.pageSize=30;
    $scope.pageCount=0;
    $scope.importEndTime=$scope.importStartTime=$scope.post=$scope.fileName=$scope.executor='';
    $scope.jurisdiction =scope.includes("7")||scope.includes("11")||false;
    $scope.handler=[{v:true,t:'待办工单'}];
    if($scope.jurisdiction)$scope.handler.push({v:false,t:'可分配工单'});
    $scope.handlerModel=true;
    $scope.checkAll=false;
    function init(callback) {
        $scope.loadingShow=true;
        var obj={
            fileSearchVo:{},
            handler:true
        };
        var f=obj.fileSearchVo;
        if($scope.importEndTime)f.importEndTime=Date.parse($scope.importEndTime);
        if($scope.importStartTime)f.importStartTime=Date.parse($scope.importStartTime);
        if($scope.post)f.post=$scope.post;
        if($scope.fileName)f.fileName=$scope.fileName;
        if($scope.executor)obj.executor=$scope.executor;
        taskServer.getNoPassList({param5:$scope.pageCurrent,param6:$scope.pageSize},obj,function (res) {
            $scope.loadingShow=false;
            $scope.pageCount=res.totalElement;
            $scope.ListData=res.voLists;
            if(callback)callback();
        },function () {
            $scope.loadingShow=false;
        });
    };
    init();
    $scope.init=init;
    $scope.callBack=function (p,s) {
        $scope.pageCurrent=p;
        $scope.pageSize=s;
        init();
    };
    $scope.checkAllFn=function () {
        $scope.hasItemActive=false;
        $scope.checkAll=!$scope.checkAll;
        $scope.ListData.forEach(function (li) {
           li.active= $scope.checkAll;
           if(li.active)$scope.hasItemActive=true;
        });
    }
    $scope.checkboxFn=function (item) {
        $scope.hasItemActive=false;
        $scope.checkAll=true;
        if(item)item.active=!item.active;
        $scope.ListData.forEach(function (li) {
            if(!li.active)$scope.checkAll=false;
            else $scope.hasItemActive=true;
        });
    }
    $scope.reCreate=function (li) {
        var obj={
            ids:[]
        };
        var newArr=[];
        if(li){
            newArr=$scope.ListData.filter(function (item) {
                return item!==li;
            });
            console.log(newArr);
        }else{
            $scope.ListData.forEach(function (item) {
                if(item.active)obj.ids.push(item.fileId);
                else newArr.push(item);
            });
        }
        taskServer.reCreate({},obj,function () {
            $stage.success('操作成功');
            if(newArr.length){
                $scope.ListData=newArr;
                $scope.checkboxFn();
            }
            else init($scope.checkboxFn);
        });
    }
}
