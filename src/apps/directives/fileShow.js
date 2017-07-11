/**
 * Created by zhaowei on 17/1/3.
 */
var md = require("../module/app");
md.directive("fileShow", ["taskServer", "$parse", function (taskServer, $parse) {
    return {
        restrict: "A",
        scope: {
            fileShow: "=",
            translated: "=",
            hiddenHead: "="
        },
        templateUrl: 'page/directives/fileShow.html',
        link: function (scope, element, attrs) {
            scope.changeKey = $parse(attrs.showTranslate)(scope.$parent);
            var changeObj = false;
            scope.fontSize=[
                {name:"12px",value:{'font-size':'12px'}},
                {name:"14px",value:{'font-size':'14px'}},
                {name:"16px",value:{'font-size':'16px'}},
                {name:"18x",value:{'font-size':'18px'}},
                {name:"20px",value:{'font-size':'20px'}},
                {name:"24px",value:{'font-size':'24px'}},
                {name:"28px",value:{'font-size':'28px'}},
                {name:"32px",value:{'font-size':'32px'}},
                {name:"40px",value:{'font-size':'40px'}}
            ];
            scope.fontActive=scope.fontSize[1];
            scope.$watch("fileShow", function (n, o) {
                if (n && n.fileType) getData();
            });
            scope.$watch("changeKey", function (n, o) {
                if (n && changeObj) {
                    changeObj = false;
                    getTranslate();
                }
            });
            function getTranslate() {
                if (!scope.changeKey) return;

                if (!scope.fileShow.fileId) scope.fileShow.fileId = scope.fileShow.id;

                taskServer.getTranslate({param3: scope.fileShow.fileId, param4: 2}, {},
                    function (data) {
                        scope.transcribeContent = data.data;
                    },
                    function (err) {
                        scope.transcribeContent = "";
                    });
            }

            function getData() {
                changeObj = true;
                getTranslate();
                if (!scope.fileShow.fileId) scope.fileShow.fileId = scope.fileShow.id;
                var hidden = scope.hiddenHead ? 1 : 0;
                if (scope.fileShow.fileType == 1) {
                    scope.loadingShowFile = true;
                    taskServer.getEmail({param3: scope.fileShow.fileId, param4: hidden}, {},
                        function (data) {
                            scope.emailHtml = data;
                            scope.loadingShowFile = false;
                        }, function (err) {
                            scope.loadingShowFile = false;
                            scope.emailHtml = [];
                        });
                } else if (scope.fileShow.fileType == 3) {
                    taskServer.getFileDetail({param3: scope.fileShow.fileId}, {},
                        function (data) {
                            scope.emailHtml = data;
                        }, function (err) {
                            scope.emailHtml = [];
                        });
                }
            }

        }
    }
}]);