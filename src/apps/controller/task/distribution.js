/**
 * Created by zhaowei on 16/12/19.
 */

var md = require("../../module/task");
md.controller('distributionCtrl', distributionCtrl);
distributionCtrl.$inject = ["$scope", "$state", "fileServer", "$stage", "taskServer", "SweetAlert"];
function distributionCtrl($scope, $state, fileServer, $stage, taskServer, SweetAlert) {
    $scope.loadingShow = true;
    $scope.showFileConten = fileServer.fileContent;
    $scope.pageName=$state.current.data.name;
    if($state.current.name=="admin.task.distribution"){
        $scope.nodeTypeID = 3;
    }else{
        $scope.nodeTypeID = 4;
    }
    $scope.priorityList=[
        {
            name:"全部",
            id:null
        },
        {
            name:"高",
            id:1
        },
        {
            name:"中",
            id:2
        },
        {
            name:"低",
            id:3
        }
    ];
    $scope.loadingShow = false;
    $scope.pageSize = $state.params.pageSize || 10;
    $scope.pageCurrent=$state.params.pageCurrent||1;
    $scope.priority=$state.params.priority || null; //优先级
    $scope.dealUserId=$state.params.dealUserId;
    $scope.removeUserId=$state.params.removeUserId;
    $scope.city = $state.params.city || null; //任务来源城市
    $scope.department = $state.params.department || null; //任务来源部门
    $scope.position = $state.params.position || null; //任务来源职位
    $scope.fileName = $state.params.fileName || null; //文件名
     
    angular.forEach( $scope.priorityList,function (obj) { //遍历优先级
        if(obj.id==$scope.priority){
            $scope.priority=obj
        }
    });
    //批量删除
    // $scope.cancelTranslateTask = function (item) {
    //     var k=false;
    //       for(var i=0;i<$scope.ListData.length;i++){
    //           if($scope.ListData[i].active){
    //               k=true;
    //               break
    //           }
    //       }
    //     if(k){
    //         SweetAlert.swal({
    //                 title: "确定取消吗?",
    //                 text: "取消后任务不存在了!",
    //                 type: "warning",
    //                 showCancelButton: true,
    //                 confirmButtonColor: "#DD6B55", confirmButtonText: "确定",
    //                 cancelButtonText: "取消",
    //                 closeOnConfirm: false,
    //                 closeOnCancel: false
    //             },
    //             function (isConfirm) {
    //                 if (isConfirm) {
    //                     var arr = [];
    //                     if(item){
    //                         arr.push(item.id);
    //                     }else{
    //                         angular.forEach($scope.ListData, function (obj) {
    //                             if (obj.active) arr.push(obj.id);
    //                         })
    //                     }
    //                     if (!arr.length) return;
    //                     taskServer.cancelTranslateTask({}, {
    //                         ids: arr
    //                     }, function (data) {
    //                         var newArr=[];
    //                         angular.forEach($scope.ListData, function (obj, index) {
    //                             if(item){
    //                                 if (obj.id == item.id) $scope.ListData.splice(index, 1)
    //                             }else{
    //                                 if(!obj.active){newArr.push(obj)}
    //                                 $scope.ListData=newArr;
    //                             }
    //                         });
    //                     }, function (err) {
    //                         $stage.warning("取消失败!")
    //                     });
    //                     SweetAlert.close();
    //                 } else {
    //                     if(item){
    //                         item.active=false;
    //                     }else{
    //                         angular.forEach($scope.ListData,function (obj) {
    //                             obj.active=false
    //                         });
    //                     }
    //                     SweetAlert.swal("失败", "信息未删除", "error");
    //                 }
    //             });
    //     }else{
    //         SweetAlert.swal("错误", "请勾选任务进行删除", "error");
    //     }
    // };
    //删除
    $scope.cancelTranslateTask = function (item) {
            SweetAlert.swal({
                    title: "确定取消吗?",
                    text: "取消后任务不存在了!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55", confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnConfirm: false,
                    closeOnCancel: false
                },
                function (isConfirm) {
                    if (isConfirm) {
                        var arr = [];
                        arr.push(item.id);
                        taskServer.cancelTranslateTask({}, {
                            ids: arr
                        }, function (data) {
                            angular.forEach($scope.ListData, function (obj, index) {
                                if (obj.id == item.id) $scope.ListData.splice(index, 1)
                            });
                        }, function (err) {
                            $stage.warning("删除失败!")
                        });
                        SweetAlert.close();
                    } else {
                        SweetAlert.swal("失败", "信息未删除", "error");
                    }
                });
    };
    //分页的回调
    $scope.callBack = function (page, size, cunt) {
        $scope.loadingShow = true;
        $scope.pageCurrent=page;
        $scope.pageSize = size;
        heaf();
        getData()
    };
    $scope.search=function () {
        $scope.loadingShow = true;
        $scope.pageCurrent=1;
        heaf();
        getData();
    };
    //刷新页面请求处理人信息(主要是$scope.dealUserId的判断)
    function screenUser() {
        $scope.loadingShow = true;
            taskServer.screenUser({param2:$scope.nodeTypeID},{},function (data) {
                $scope.removeUserBox=angular.copy(data);
                data.unshift({name:"全部",id:null});
                $scope.allUser=data;
                angular.forEach($scope.allUser,function (obj) {
                    if($scope.dealUserId==obj.id){
                        $scope.dealUser=obj
                    }
                });
                angular.forEach($scope.removeUserBox,function (obj) {
                    if($scope.removeUserId==obj.id){
                        $scope.removeUser=obj
                    }
                });
                if(!$scope.removeUserId)  $scope.removeUser=$scope.removeUserBox[0];
                getData();
                heaf()
                $scope.loadingShow = false;
            },function(){
                $scope.loadingShow = false;
            });
    }
    screenUser();
    //点击下拉页面请求处理人信息

    function heaf() {
        $state.go($state.current.name,{
            pageSize:$scope.pageSize,
            pageCurrent:$scope.pageCurrent,

            dealUserId:$scope.dealUser.id,
            removeUserId:$scope.removeUser.id,
            priority:$scope.priority.id,
            city:$scope.city,
            department:$scope.department,
            position:$scope.position,
            fileName: $scope.fileName
        });
    }
    function getData() {
        var k=$scope.dealUser.name;
        if(!$scope.dealUser.name||$scope.dealUser.name=="全部"){
            k=null
        }
        var json = {
            fileSearchVo: {
                country:$scope.city,
                department:$scope.department,
                post: $scope.position,
                fileName: $scope.fileName
            },
            priority:$scope.priority.id,
            nodeType:$scope.nodeTypeID,
            handler: false,
            executor:k
        };
        $scope.loadingShow = true;
        taskServer.getTaskList({param4:$scope.pageCurrent,param5:$scope.pageSize}, json, function (data) {
            $scope.ListData=data.voLists;
            $scope.pageCount = data.totalElement;
            $scope.listNumber=0;
            angular.forEach($scope.ListData,function (item) {
                item.Modify=false;
                item.abortTime=null
                if(item.executor==$scope.removeUser.name){ //渲染的数据和转给人一样时,给当前这一项添加disabled属性
                    item.disabled=true
                }else{
                    item.disabled=false;
                    $scope.listNumber++
                }
            });
            $scope.loadingShow = false;
        }, function (err) {
            $scope.loadingShow = false;
        })
    }
    //点击改变转给人时，下面列表相同的人添加disabled属性
    $scope.addDisabled=function () {
        $scope.listNumber=0;
        angular.forEach($scope.ListData, function (item) {
            if(item.executor==$scope.removeUser.name){ //渲染的数据和转给人一样时,给当前这一项添加disabled属性
                item.disabled=true
            }else{
                item.disabled=false;
                $scope.listNumber++
            }
        });
    };

    //选择人放入数组进行分配
    $scope.changeItem = changeItem;
    $scope.num=0;
    function changeItem(item) {
        if (item == 'all') {
            $scope.allSelect = !$scope.allSelect;
            if ($scope.allSelect) {
                angular.forEach($scope.ListData, function (item) {
                    if(!item.disabled){
                        item.active = $scope.allSelect;
                        $scope.num=$scope.listNumber
                    }

                });
            } else {
                angular.forEach($scope.ListData, function (item) {
                    item.active = $scope.allSelect;
                    $scope.num=0
                });
            }
        }else{
            item.active=!item.active;
            if (item.active) {
                $scope.num++
            } else {
                $scope.num--
            }
            if ($scope.num==$scope.listNumber){
                $scope.allSelect=true
            }else{
                $scope.allSelect=false
            }
        }
    }
    $scope.distribution=function () {
        var k = false;
        for(var i=0;i<$scope.ListData.length;i++){ //判断是否勾选任务，只能用for循环才能有break
            if($scope.ListData[i].active){
                k = true;
                break;
            }
        }
        if(k){
            var newList=[];
            var userList=[];
            angular.forEach($scope.ListData, function (obj, index) { //有任务则添加,
                if(obj.active){
                    newList.push(obj.id);
                    userList.push(obj.executor)
                }
            });
                $scope.loadingShow =true;
                taskServer.distribution({param5: $scope.removeUser.id},{ids:newList},function () {
                    angular.forEach($scope.ListData, function (obj, index) {
                        if(obj.active&&obj.executor!==$scope.removeUser.name){
                            obj.active=false;
                            obj.executor=$scope.removeUser.name;
                            $scope.allSelect=false
                        }
                    });
                    SweetAlert.swal("成功!", "任务分配成功!", "success");
                    $scope.loadingShow =false;
                },function(err){
                    $scope.loadingShow =false;
                })
        }else{
            SweetAlert.swal("错误!", "请勾选任务!", "error");
        }
    };
    $scope.showModify=function (item) {
        item.Modify=true
    };
    $scope.saveModify=function (item) {
        if(item.abortTime){
            taskServer.ModifyTime({param5:(new Date(item.abortTime)).getTime()},{ids:[item.id]},function () {
                item.deadLine=item.abortTime;
                item.Modify=false
            },function (err) {
                SweetAlert.swal("失败!", "修改时间失败!", "error");
            });
        }else{
            item.Modify=false
        }
    }
    $scope.desc=true;
    $scope.sort="fileName"
    $scope.sortChange=function(type){
        $scope.sort=type;
        $scope.desc=!$scope.desc;
    }
}


