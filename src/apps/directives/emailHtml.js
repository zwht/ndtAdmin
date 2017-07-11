/**
 * Created by zhaowei on 16/12/27.
 */
var md = require("../module/app");
md.directive('emailHtml', ["taskServer","$state",
    function (taskServer,$state) {
        return {
            restrict: 'A',
            scope: {
                emailHtml: "=",
                emailObj: "=",
                hiddenHead: "="
            },
            templateUrl: 'page/directives/emailHtml.html',
            link: function (scope, el, attr) {
                if($state.current.name=="admin.task.distribution"){
                    scope.editKey=true;
                }
                var fileId=scope.emailObj&&scope.emailObj.fileId?scope.emailObj.fileId:"";
                scope.emailObj = {};
                var toJson = ['attachments', 'emlFromEmail', 'emlToEmails', 'attachments', 'emlCcEmails', 'emlBccEmails'];

                if(scope.editKey){
                    var editor = new wangEditor($(el).find(".hideText")[0]);
                    editor.create();
                    $(el).find(".hideText").keydown(function (event) {
                        event.stopPropagation();
                        event.preventDefault();
                    })
                }

                scope.$watch("emailHtml", function () {
                    scope.emailObj = {};
                    if (scope.emailHtml && scope.emailHtml.length) {
                        angular.forEach(scope.emailHtml, function (item) {
                            angular.forEach(toJson, function (id) {
                                if (item.id == id && item.name) item.name = angular.fromJson(item.name);
                            });
                            scope.emailObj[item.id] = item.name;
                        });
                    }
                    if (scope.emailObj.content&&scope.editKey){
                        editor.$txt.html(scope.emailObj.content)
                    }
                });


                scope.contextMenuTestList = [
                    {
                        name: "标记为翻译"
                    },
                    {
                        name: "不翻译"
                    }
                ];

                scope.contextMenuCallBack = function (item) {
                    if(!fileId) return
                    if (item.name == "标记为翻译") {
                        document.execCommand("ForeColor", false, 'red');
                    } else {
                        document.execCommand("ForeColor", false, '#333');
                    }
                    taskServer.cacheTranslate({
                        param4: fileId,
                        param5: 0
                    }, editor.$txt.html(), function () {

                    })
                };

            }
        };
    }]);