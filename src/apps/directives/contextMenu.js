/**
 * Created by zhaowei on 16/12/22.
 */
var md = require("../module/app");
md.directive('contextMenu', ["$parse", "$rootScope", "ngDialog",
    function ($parse, $rootScope, ngDialog) {

        $(document).on("click", function () {
            if ($rootScope.ngDialogBox) $rootScope.ngDialogBox.close();
        });
        return {
            restrict: 'A',
            scope: {
                menuList: "=contextMenu",
                callBack: "=",
                clickNodeData: "=",
                runEvent: "@"
            },
            link: function (scope, el, attr) {
                //$(el).addClass("no-select");
                $(el).css({cursor: 'default'});
                el.bind('contextmenu', function (event) {
                    event.stopPropagation();
                    event.preventDefault();
                    creatDialogBox(event);
                });
                if (scope.runEvent == 'click') {
                    el.bind(scope.runEvent, function (event) {
                        event.stopPropagation();
                        creatDialogBox(event);
                    });
                    el.bind("mousedown", function (event) {
                        event.stopPropagation();
                        event.preventDefault();
                    });
                    el.css({cursor: 'pointer'});
                }
                function creatDialogBox(event) {
                    if ($rootScope.ngDialogBox) $rootScope.ngDialogBox.close();
                    if (!scope.menuList || !scope.menuList.length) return;

                    $rootScope.ngDialogBox = ngDialog.open({
                        templateUrl: 'page/directives/contextMenu.html',
                        controller: ["$scope", "$timeout", function ($scope) {
                            setDialogPost();
                            $scope.click = function (item, event) {
                                if (item.children && item.children.length || item.disable) {
                                    event.stopPropagation();
                                } else {
                                    $(".context-menu .active").removeClass("active");
                                    $scope.callBack(item, $scope.clickNodeData, $scope.menuList);
                                    $rootScope.ngDialogBox.close();
                                }
                            };
                            $scope.mouseOver = function (event, item) {

                                item.style = {top: setPost(event) + 'px'};
                                angular.forEach($scope.menuList, function (obj) {
                                    obj.hover = false
                                });
                                item.hover = true;
                            };
                            function setPost(event) {
                                var top = 0;
                                var documentHeight = $(document).height();
                                var target = $(event.target).hasClass('menuItem') ? $(event.target).find(".charBox") : $(event.target).parents(".menuItem").find(".charBox");
                                var height = target.height();
                                var offsetTop = target.parent(".menuItem").offset().top;
                                if (documentHeight < height + offsetTop) {
                                    top = -(height + offsetTop - documentHeight);
                                }
                                return top;
                            }

                            function setDialogPost() {
                                var obj = $(".context-menu");
                                if (!obj.length) {
                                    setTimeout(function () {
                                        setDialogPost();
                                    }, 50);
                                    return;
                                }
                                obj.css({display: "block"});
                                var windowHeight = $(window).height(),
                                    windowWidht=$(window).width();
                                if (windowHeight < obj.outerHeight() + obj.offset().top) {
                                    obj.css({top: windowHeight - obj.outerHeight() + 'px'});
                                }
                                if(windowWidht<obj.outerWidth()+obj.offset().left){
                                    obj.css({left: windowWidht - obj.outerWidth() + 'px'});

                                    obj.addClass("rightMenu")
                                }
                                if(windowWidht<obj.outerWidth()+obj.offset().left+140){
                                    obj.addClass("rightMenu")
                                }

                            }

                        }],
                        className: 'context-menu',
                        style: {left: event.clientX + 'px', top: event.clientY + 'px'},
                        overlay: false,
                        scope: scope,
                        disableAnimation: true
                    });
                }

            }
        };
    }]);
