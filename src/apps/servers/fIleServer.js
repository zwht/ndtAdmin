/**
 * Created by zhaowei on 16/12/30.
 */
var md = require("../module/app");
md.service("fileServer", fileServer);

fileServer.$inject = ["ngDialog"];

function fileServer(ngDialog) {
    this.fileContent = function (fileObj, translated, hiddenHead) {
        ngDialog.close();
        ngDialog.open({
            template: 'page/ngDialog/ngDialogFileContent.html',
            className: 'ngdialog-theme-default ngDialogFileContent',
            controller: ["$scope", function ($scope) {
                $scope.fileObj = fileObj;
                $scope.translated = translated;
                $scope.hiddenHead = hiddenHead;
            }],
            closeByDocument: false
        });

    };
    this.hide = function () {

    };
}
