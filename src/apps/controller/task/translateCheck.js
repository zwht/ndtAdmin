/**
 * Created by zhaowei on 16/12/13.
 */
var md = require("../../module/task");
md.controller('translateCheckCtrl', translateCheckCtrl);
translateCheckCtrl.$inject = ["SweetAlert", "$scope", "taskServer", '$state', "$stage", "$timeout", "$rootScope", "ngDialog"];
function translateCheckCtrl(SweetAlert, $scope, taskServer, $state, $stage, $timeout, $rootScope, ngDialog) {
    $scope.activeItem = {fileId: $state.params.fileId};
    $scope.transcribeContent = "";
    $scope.editorObj = {};
    $scope.emailHtml = [];
    $scope.emailObj = {};
    $scope.changerKey=1;
    $scope.translated = true;
    $scope.permutation = false;
    $scope.cacheName = "保存";
    $scope.hiddenHead = true;
    $scope.currentPage = 1;//当前
    $scope.pageSize = 30;//总数
    // $scope.flagNum = 1;//标记
    $scope.noData = false;//标记
    $scope.ListData=[];
    getList($scope.currentPage,$scope.pageSize);


    $scope.changFile = changFile;
    $scope.save = save;
    $scope.download = download;
    $scope.notGo = notGo;
    $scope.cache = cache;


    $scope.fullScreen = function () {
        $scope.fullScreenKey = !$scope.fullScreenKey;
    };

    function changFile(item) {
        angular.forEach($scope.ListData, function (obj) {
            obj.active = false;
        });
        item.active = true;
        $scope.activeItem = item;
        heaf();
        getTranscribe();
    }

    function getList(page,size) {
        if($scope.noData)return;
        $scope.loadingShow = true;
        taskServer.getTaskList(
            {
                param4: page,
                param5: size
            },
            {
                fileSearchVo: {
                    post: null
                },
                nodeType: 4,
                handler: true
            },
            function (data) {
                $scope.loadingShow = false;
                if (!data.voLists.length) {
                    $scope.noData = true;
                    if(!$scope.firstRequest)$stage.warning("无校对数据");
                    return;
                }
                if(!$scope.firstRequest)$scope.firstRequest = true;//该标记代表第一次请求
                if(!$scope.totalElement)$scope.totalElement = data.totalElement;//总数
                $scope.ListData=$scope.ListData.concat(data.voLists);
                angular.forEach(data.voLists, function (item) {
                    if (item.fileId == $scope.activeItem.fileId) {
                        changFile(item);
                    }
                });
            },
            function (err) {
                $scope.loadingShow = false;
            })
    }

    function getTranscribe() {
        taskServer.getTranslate({param3: $scope.activeItem.fileId, param4: 1}, {},
            function (data) {
                $scope.transcribeContent = data.data;
                if(data.data=='null') $scope.transcribeContent="";
                $scope.changerKey+=1;
            },
            function (err) {
                $stage.warning("获取机器翻译失败,还是自己翻译吧!")
            });
    }

    function save() {
        var html = $scope.editorObj.$txt.html();
        if (!html) {
            $stage.warning("请输入内容!");
            return false;
        }
        taskServer.saveTranslate({param5: $scope.activeItem.fileId, param6: 2}, html,
            function (data) {
                $rootScope.$emit("overEditor");
                SweetAlert.swal("操作成功!", "自动切换到下一个任务!", "success");
                $scope.transcribeContent="";
                goOneItem()
            }, function (err) {
                $stage.warning("操作失败!");
            })
    }

    function notGo() {
        ngDialog.open({
            template: 'page/ngDialog/translateBack.html',
            className: 'ngdialog-theme-default translateBack',
            controller: ["$scope", "taskServer", "$stage", function ($scope, taskServer, $stage) {
                $scope.reason = "";
                $scope.save = function () {
                    if (!$scope.reason) return;
                    taskServer.translateBack({param5: $scope.activeItem.fileId}, {reason: $scope.reason},
                        function (data) {
                            $stage.warning("操作成功!");
                            $scope.closeThisDialog();
                            goOneItem()
                        },
                        function (err) {
                            $stage.warning("操作失败!");
                        }
                    )
                }
            }],
            scope: $scope,
            closeByDocument: false
        });
    }

    function goOneItem() {
        angular.forEach($scope.ListData, function (item, i) {
            if (item.active) $scope.ListData.splice(i, 1);
        });
        $scope.totalElement--;
        var min =Math.min($scope.totalElement,$scope.pageSize);
        if ($scope.ListData.length){
            changFile($scope.ListData[0]);
            if(min===$scope.pageSize&&$scope.ListData.length<min){
                getList($scope.ListData.length+1,1);
            }
        }else {
            $state.go("admin.task.waitingTask", {nodeTypeID: 3})
        }
    }
    var saveHtml;
    var saveText;
    function cache() {
        if ($scope.cacheName == "保存中...") return;
        $scope.cacheName = "保存中...";
        taskServer.cacheTranslate({
            param4: $scope.activeItem.fileId,
            param5: 2
        }, $scope.editorObj.$txt.html(), function (data) {
            $rootScope.$emit("overEditor");
            $timeout(function () {
                saveHtml=true;
                saveResults();
            }, 1000)
        }, function (err) {
            $timeout(function () {
                saveHtml=false;
                saveResults();
            }, 1000)
        });
        taskServer.cacheTranslate({
                param4:'noformat',
                param5:$scope.activeItem.fileId,
                param6:2
            },
            $scope.editorObj.$txt.formatText()
            ,function (data) {
                saveText=true;
                saveResults();
            },function (err) {
                saveText=false;
                saveResults();
            });
    }
    var saveNum=0;
    function saveResults () {
        saveNum++;
        if(saveNum==2){
            if(saveHtml==true&&saveText==true){
                $stage.warning("保存成功!");
                $scope.cacheName = "保存";
                saveNum=0;

            }else if(saveHtml==false&&saveText==false){
                $stage.warning("保存失败!");
                $scope.cacheName = "保存";
                saveNum=0;

            }else if(saveHtml==false){
                $stage.warning("HTML格式保存失败!");
                $scope.cacheName = "保存";
                saveNum=0;

            }else if(saveText==false){
                $stage.warning("TEXT格式保存失败!");
                $scope.cacheName = "保存";
                saveNum=0;

            }
        }
    }

    function download() {
        var content = $scope.editorObj.$txt.html();
        var converted = htmlDocx.asBlob(content, {orientation: 'landscape', margins: {top: 720}});
        window.saveAs(converted, 'test.docx');
    }

    function heaf() {
        $state.go("admin.task.translateCheck", {fileId: $scope.activeItem.fileId});
    }
    //滚动事件
    $scope.myScroll=function () {
        $scope.currentPage++;
        getList($scope.currentPage,$scope.pageSize);
    }
}
