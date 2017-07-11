/**
 * Created by zhaowei on 16/12/19.
 */

var md = require("../../module/task");
md.controller('filterDistributionCtrl', filterDistributionCtrl);
filterDistributionCtrl.$inject = ["$scope", "$state", "taskServer", "SweetAlert"];
function filterDistributionCtrl($scope, $state, taskServer, SweetAlert) {
    $scope.loadingShow = true;
    $scope.pageName=$state.current.data.name;
    if($state.current.name=="admin.task.filterDistribution"){
        $scope.nodeTypeID = 1;
    }else{
        $scope.nodeTypeID = 2;
    }
    $scope.priorityList = [
        {
            name: "全部",
            id: null
        },
        {
            name: "高",
            id: 1
        },
        {
            name: "中",
            id: 2
        },
        {
            name: "低",
            id: 3
        }
    ];

    $scope.pageSize = $state.params.pageSize || 10;
    $scope.pageCurrent = $state.params.pageCurrent || 1;

    $scope.priority = $state.params.priority || null; //优先级
    $scope.city = $state.params.city || null; //任务来源城市
    $scope.department = $state.params.department || null; //任务来源部门
    $scope.position = $state.params.position || null; //任务来源职位
    $scope.dealUserId = $state.params.dealUserId;
    $scope.removeUserId = $state.params.removeUserId;

    angular.forEach($scope.priorityList, function (obj) { //遍历优先级
        if (obj.id == $scope.priority) {
            $scope.priority = obj
        }
    });
    //批量删除和取消任务
    $scope.cancelFilterTask = function (item) {
        var k=false;
        for(var i=0;i<$scope.ListData.length;i++){
            if($scope.ListData[i].active){
                k=true;
                break
            }
        }
        if(k){
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
                        if (item) {
                            arr.push(item.groupVo);
                        } else {
                            angular.forEach($scope.ListData, function (obj) {
                                if (obj.active) arr.push(obj.groupVo);
                            })
                        }
                        if (!arr.length) return;
                        taskServer.cancelFilterTask({param6: $scope.nodeTypeID}, {
                            voList: arr
                        }, function (data) {
                            var newArr=[];
                            angular.forEach($scope.ListData, function (obj, index) {
                                if (item) {
                                    if (obj.groupVo == item.groupVo) $scope.ListData.splice(index, 1);
                                } else {
                                    if (!obj.active) newArr.push(obj);
                                    $scope.ListData=newArr;
                                }
                            });
                        }, function (err) {
                            $stage.warning("取消失败!")
                        });
                        SweetAlert.close();
                    } else {
                        SweetAlert.swal("失败", "信息未删除", "error");
                    }
                });
        }else{
            SweetAlert.swal("失败", "未勾选批量任务", "error");
        }
    };
    //分页的回调
    $scope.callBack = function (page, size, cunt) {
        $scope.loadingShow = true;
        $scope.pageCurrent = page;
        $scope.pageSize = size;
        getData();
        heaf();
    };
    $scope.search = function () {
        $scope.loadingShow = true;
        $scope.pageCurrent = 1;
        heaf();
        getData();
    };
    //刷新页面请求处理人信息(主要是$scope.dealUserId的判断)
    function screenUser() {
        $scope.loadingShow = true;
        taskServer.screenUser({param2: $scope.nodeTypeID}, {}, function (data) {
            $scope.removeUserBox = angular.copy(data);
            data.unshift({name: "全部", id: null});
            $scope.allUser = data;
            angular.forEach($scope.allUser, function (obj) {
                if ($scope.dealUserId == obj.id) {
                    $scope.dealUser = obj
                }
            });
            angular.forEach($scope.removeUserBox, function (obj) {
                if ($scope.removeUserId == obj.id) {
                    $scope.removeUser = obj
                }
            });
            if (!$scope.removeUserId)  $scope.removeUser = $scope.removeUserBox[0];
            getData();
            heaf()
            $scope.loadingShow = false;
        },function(err){
            $scope.loadingShow = false;
        });
    }

    screenUser();
    //点击下拉页面请求处理人信息
    function heaf() {
        $state.go($state.current.name, {
            pageSize: $scope.pageSize,
            pageCurrent: $scope.pageCurrent,
            dealUserId: $scope.dealUser.id,
            removeUserId: $scope.removeUser.id,
            priority: $scope.priority.id,
            city: $scope.city,
            department: $scope.department,
            position: $scope.position
        });
    }

    function getData() {
        $scope.loadingShow = true;
        var k = $scope.dealUser.name;
        if (!$scope.dealUser.name || $scope.dealUser.name == "全部") {
            k = null
        }
        var json = {
            fileSearchVo: {
                country: $scope.city,
                department: $scope.department,
                post: $scope.position
            },
            priority: $scope.priority.id,
            nodeType: $scope.nodeTypeID,
            handler: false,
            executor: k
        };
        taskServer.FilterTaskList({param5: $scope.pageCurrent, param6: $scope.pageSize}, json, function (data) {
            $scope.ListData = [];
            $scope.pageCount = data.totalElement;
            $scope.listNumber=0;
            angular.forEach(data.voLists, function (item) {
                item.number=item.desc.split("/");
                angular.forEach(item.number,function(fk,ind){
                    item.number[ind]=parseInt(fk);
                })
                if(item.executor==$scope.removeUser.name){ //渲染的数据和转给人一样时,给当前这一项添加disabled属性
                 item.disabled=true
                }else{
                    item.disabled=false;
                    $scope.listNumber++
                }
            });
            $scope.ListData=data.voLists;
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
    // $scope.item.taskActive=false;
    $scope.changeItem = changeItem;
    $scope.num=0;
    function changeItem(item) {
        if (item == 'all') {
            $scope.allSelect = !$scope.allSelect;
            if ($scope.allSelect) {
                angular.forEach($scope.ListData, function (item) {
                    if(!item.disabled){
                        item.active = $scope.allSelect;
                    }
                });
                $scope.num=$scope.listNumber
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

    $scope.distribution = function () {
            var k = false;
            for(var i=0;i<$scope.ListData.length;i++){ //判断是否勾选任务，只能用for循环才能有break
                if($scope.ListData[i].active){
                    k = true;
                    break;
                }
            }
            if (k) {
                var newList=[];
                var userList=[];
                angular.forEach($scope.ListData, function (obj, index) { //有任务则添加,
                    if(obj.active){
                        newList.push(obj.groupVo);
                        userList.push(obj.executor)
                    }
                });
                    $scope.loadingShow = true;
                    taskServer.getFilterTaskList({
                        param6: $scope.nodeTypeID,
                        param7: $scope.removeUser.id
                    }, { voList:newList}, function () {
                        angular.forEach($scope.ListData, function (obj, index) {
                            if(obj.active&&obj.executor!==$scope.removeUser.name){
                                obj.active=false;
                                obj.executor=$scope.removeUser.name;
                                $scope.allSelect=false
                            }
                        });
                        SweetAlert.swal("成功!", "任务分配成功!", "success");
                        $scope.loadingShow = false;
                    },function(err){
                        $scope.loadingShow = false;
                    })
            }else {
                SweetAlert.swal("错误!", "请勾选任务!", "error");
            }
    };

    $scope.desc=true;
    $scope.sort="groupVo.batch"
    $scope.sortChange=function(type){
        $scope.sort=type;
        $scope.desc=!$scope.desc;
    }
}


