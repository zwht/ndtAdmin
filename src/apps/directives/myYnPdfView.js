var md = require("../module/app");
md.directive('myYnPdfView', ['$filter', "taskServer", function ($filter, taskServer) {
    return {
        restrict: 'AE',
        templateUrl: 'page/directives/ynPdfView.html',
        replace: true,
        scope: {
            obj: '='
        },
        link: function (scope, tElement, tAttrs) {
            scope.$watch("obj",function (n,o) {
                if(n.fileId){
                    $(tElement).find('iframe').attr({src:'lib/pdfJs/generic/web/viewer.html?file=../../../../ms/file/pdf/'+n.fileId})
                }
            })
        }
    }
}]);


