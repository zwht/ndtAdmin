function preScrn_audit_common($scope, $timeout,fileServer, taskServer, $stage, $state,nodeTypeID,save,allSave,$window) {
    $scope.batch = $state.params.batch;
    $scope.screenflag = false;
    $scope.executor = $state.params.executor;
    $scope.post = $state.params.post;
    $scope.fileType = $state.params.fileType;
    $scope.priority = $state.params.priority;
    $scope.deadline = $state.params.deadline;
    // $scope.total=$state.params.total;
    $scope.showFileConten = fileServer.fileContent;
    $scope.hiddenEmailHead = false;
    // $scope.search = '';//搜索
    // $scope.addresser = '';//发件人
    // $scope.receiver = '';//收件人
    // $scope.endTime = $filter('date')(Date.parse(new Date()), "yyyy-MM-dd");
    // $scope.startTime = $filter('date')(Date.parse($scope.endTime) - 365 * 86400000, "yyyy-MM-dd");
    // $scope.onlyCheckboxActive = false;//仅包含附件
    $scope.fileList = [];
    $scope.detailsData = {};
    //全屏
    $scope.screenFn=function () {
        $scope.screenflag=!$scope.screenflag;
    };
    $scope.init = init;
    $scope.save = save;
    $scope.allSave = allSave;
    $scope.getEmailData = getEmailData;
    $scope.onlyCheckboxClick = function () {
        $scope.onlyCheckboxActive = !$scope.onlyCheckboxActive;
    };
    $scope.checkboxClick = function (key) {
        $scope.baseDetailsData.important = key;
        // $scope.baseDetailsData.reason='';
        angular.forEach($scope.detailsData.attTransDetail,function (item) {
            item.trans =false;
        });
    };
    $scope.radioClick = function (item) {
        item.trans = !item.trans;
    };
    //-----------下一页------------------
    $scope.changeEmailFlag=false;
    $scope.changeEmail = function (num) {
        if(!$scope.changeEmailFlag){
            $scope.changeEmailFlag=true;
            var a =Math.ceil($scope.pageCount/$scope.pageSize);
            var flag1=$scope.baseDetailsData.index + num >= $scope.fileList.length&&$scope.pageCurrent==a;
            var flag2=$scope.baseDetailsData.index + num < 0 && $scope.pageCurrent==1;
            if(flag1||flag2){
                $scope.changeEmailFlag=false;
                return;
            }
            if($scope.baseDetailsData.index + num==$scope.fileList.length&&num>0){
                $scope.callBack($scope.pageCurrent+1,$scope.pageSize);return;
            }
            if($scope.baseDetailsData.index + num< 0&&num<0){
                $scope.callBack($scope.pageCurrent-1,$scope.pageSize,"-x");return;
            }
            getEmailData($scope.baseDetailsData.index + num);
        }
    };
    //不同
    $scope.back = function () {
        $state.go("admin.task.filterTask", {nodeTypeID: nodeTypeID})
    };
    $scope.pageCurrent = 1;
    $scope.pageSize =$window.localStorage.pageSize||50;
    function init(page,size,num) {
        $scope.loadingShow = true;
        var json = {
            groupVo: {
                post: $scope.post,
                executor: $scope.executor,
                batch: $scope.batch
            },
            nodeType: nodeTypeID
        };
        if($scope.onlyCheckboxActive===false||$scope.onlyCheckboxActive===true){
            json.hasAttachment=$scope.onlyCheckboxActive;
        }
        if($scope.search){
            json.keyword=$scope.search;
        }
        if($scope.startTime){
            json.sendStartTime=Date.parse($scope.startTime);
        }
        if($scope.endTime){
            json.sendEndTime=Date.parse($scope.endTime);
        }
        taskServer.getFilterDetailsList({param6:page,param7:size}, json, function (data) {
            $scope.loadingShow = false;
            if (!data.voLists.length) $stage.warning('任务没有文件可做处理');
            angular.forEach(data.voLists,function (item) {
                if(item.detail == ""){
                    item.detail = '{"from":{"ip":"","name":"","email":""},"to":[{"ip":"","name":"","email":""}],"sendTime":0}';
                }
                item.detail =JSON.parse(item.detail);
            });
            $scope.fileList = data.voLists;
            console.log("$scope.fileList",$scope.fileList);
            console.log("data",data);
            $scope.pageCount=data.totalElement;
            if(!$scope.totalElement)$scope.totalElement=data.totalElement;
            getEmailData(num);
        }, function () {
            $stage.warning('出错啦');
            $scope.loadingShow = false;
        });
    }
    $scope.init($scope.pageCurrent,$scope.pageSize,0);
    function detailsServerFn() {
        var key = "getEmailDetailsList";
        if($scope.baseDetailsData.fileType != 1) key = "getFileDetailsList";
        taskServer[key]({param3: $scope.baseDetailsData.fileId,param4:$scope.baseDetailsData.fileType===1?0:undefined}, {}, function (data) {
            var newData = {};
            angular.forEach(data, function (item) {
                newData[item.id] = item.name;
            });
            if(newData.attTransDetail){
                newData.attTransDetail=JSON.parse(newData.attTransDetail);
                $scope.detailsData = newData;
                $scope.attTransDetail = $scope.detailsData.attTransDetail;
                $scope.emailHtml = data;
                $scope.changeEmailFlag=false;
            }else{
                $scope.translated = true;
                $scope.hiddenHead = false;
                $scope.detailsData = $scope.baseDetailsData;
                $scope.fileObj = {
                    fileId:$scope.baseDetailsData.fileId,
                    name:"",
                    fileType:2
                }
            }
            setFileRead($scope.baseDetailsData);

        });
    }
    function getEmailData(index) {
        if(!$scope.fileList.length){
            $scope.baseDetailsData = {};
            $scope.detailsData = {};
            return;
        }
        angular.forEach($scope.fileList, function (item) {
            item.active = false;
        });
        $scope.baseDetailsData = $scope.fileList[index];
        $scope.baseDetailsData.active = true;
        $scope.baseDetailsData.index = index;
        detailsServerFn();
    }
    //已读
    function setFileRead(obj) {
        taskServer.setFileRead({param4: obj.fileId}, {},
            function (data) {
                obj.read = true;
            },
            function (err) {
                $stage.warning("设置已读失败!")
            }
        )
    }
    //未读
    $scope.setFileNoRead=function (e,obj) {
        if (obj.read) {
            taskServer.setFileNoRead({param4: obj.fileId}, {},
                function (data) {
                    obj.read = false;
                },
                function (err) {
                    $stage.warning("设置未读失败!")
                }
            )
        }else{
            setFileRead(obj);
        }
        e.stopPropagation();
    };
    //分页
    $scope.callBack=function (page,size,num) {
        $scope.pageCurrent=page;
        if($scope.pageSize!=size){
            $window.localStorage.setItem("pageSize",size);
            $scope.pageSize=size;
        }
        if(num==="-x"){
            $scope.init(page,size,$scope.pageSize-1);  return;
        }
        $scope.init(page,size,0);
    };
    //监听Vo对象
    $scope.$watch('startTime',function (newVal,oldVal) {
        if(newVal==oldVal||(newVal==''&&oldVal==undefined))return;
        $scope.init(1,$scope.pageSize,0);
    });
    $scope.$watch('endTime',function (newVal,oldVal) {
        if(newVal==oldVal||(newVal==''&&oldVal==undefined))return;
        $scope.init(1,$scope.pageSize,0);
    });
    $scope.$watch('onlyCheckboxActive',function (newVal,oldVal) {
        if(newVal==oldVal)return;
        $scope.init(1,$scope.pageSize,0);
    });
    $scope.searchData=function () {
        if($scope.searchDataId)$timeout.cancel($scope.searchDataId);
        // $scope.loadingShow = true;
        $scope.searchDataId=$timeout(function () {
            $scope.init(1,$scope.pageSize,0);
        },500);
    };
    //按时间排序
    // $scope.orderBy=function () {
    //     $scope.orderByFlag =!$scope.orderByFlag;
    //     if($scope.orderByFlag){
    //         var flag ='+'
    //     }else {
    //         var flag ='-'
    //     }
    //     $scope.fileList=$filter('orderBy')($scope.fileList,flag+"detail.sendTime");
    //     getEmailData(0);
    // };
    // function pagenation(page,size) {
    //     var start =1+(page-1)*size;
    //     var end =page*size;
    //     var arr =[];
    //    for(var i=start;i<=end;i++){
    //        if($scope.allFileList[i-1])arr.push($scope.allFileList[i-1]);
    //    }
    //    return arr;
    // }
    //查看附件明细
    $scope.accessoryDetails=function (data) {
        debugger
        var fileType;
        var str =data.name.substr(data.name.lastIndexOf(".")).toLowerCase();
        switch (str){
            case '.email':
                fileType=1;
                break;
            case '.pdf':
                fileType=2;
                break;
            case '.doc':
                fileType=2;
                break;
            case '.docx':
                fileType=2;
                break;
            default:
                fileType=4;
        }
        var obj ={
            fileId:data.id,
            name:data.name,
            fileType:fileType
        };
        fileServer.fileContent(obj,true,true);
    };
    $scope.checkScrollBar = function (flag) {
        $scope.scrollFlag=flag;
        $scope.$apply();
    }
    $scope.desc=true;
    $scope.sort="detail.from.email"
    $scope.sortChange=function(type){
        $scope.sort=type;
        $scope.desc=!$scope.desc;
    }
}
module.exports = preScrn_audit_common;