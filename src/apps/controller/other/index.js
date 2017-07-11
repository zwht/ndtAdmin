/**
 * Created by zhaowei on 16/12/16.
 */

var md = require("../../module/other");
md.controller('indexCtrl', indexCtrl);
indexCtrl.$inject = ["$scope", "otherServer", "$state","session"];
function indexCtrl($scope, otherServer, $state,session) {
    $scope.user = session.get("userName");
    var noteType=session.get("scope").split("#%#");
    $scope.csShow=false;
    $scope.csshShow=false;
    $scope.fyShow=false;
    $scope.xdShow=false;
    $scope.zbShow=false;

    for(var i=0;i<noteType.length-1;i++){
        var type=parseInt(noteType[i])
       switch (type){
           case 1:case 6:
               $scope.csShow=true;
               break;
           case 2:case 7:
               $scope.csshShow=true;
               break;
           case 3:case 8:
               $scope.fyShow=true;
               break;
           case 4:case 9:
               $scope.xdShow=true;
               break;
           case 5:
               $scope.zbShow=true;
               break;
           case 10:
               $scope.csShow=true;
               $scope.csshShow=true;
               $scope.fyShow=true;
               $scope.xdShow=true;
               $scope.zbShow=true;
               break;
       }
    }
        otherServer.getLoginTime({},{},function (data) {
            $scope.loginTime=data.lastLoginTime;
        })

    function getData(nodeType) {
        otherServer.getData({param3:nodeType},{},function (data) {

            switch(nodeType){

                case "1":
                    $scope.csFinish=data.finishedNumber;
                    $scope.csTodo=data.todoNumber;
                    $scope.csOverdue=data.overdueNumber;
                    break;
                case "2":
                    $scope.csshFinish=data.finishedNumber;
                    $scope.csshTodo=data.todoNumber;
                    $scope.csshOverdue=data.overdueNumber;
                    break;
                case "3":
                    $scope.fyFinish=data.finishedNumber;
                    $scope.fyTodo=data.todoNumber;
                    $scope.fyOverdue=data.overdueNumber;
                    break;
                case "4":
                    $scope.xdFinish=data.finishedNumber;
                    $scope.xdTodo=data.todoNumber;
                    $scope.xdOverdue=data.overdueNumber;
                    break;
                case "5":
                    $scope.zbFinish=data.finishedNumber;
                    $scope.zbTodo=data.todoNumber;
                    $scope.zbOverdue=data.overdueNumber;
                    break;

            }
        })
    }
    otherServer.getImportantData({},{},function (data) {
        $scope.new=data[0];
    });


    getData("1")
    getData("2")
    getData("3")
    getData("4")
    getData("5")

    $scope.goTo=function(url){
      $state.go(url);
    }


}
