/**
 * Created by zhaowei on 16/5/27.
 */
var md = angular.module("$stage", []);
md.factory("$stage", function () {
    var stage = {};

    stage.stopPropagation = function (e) {
        e = e || window.event;
        if (!e) return;
        if (e.stopPropagation) { //W3C阻止冒泡方法
            e.stopPropagation();
        } else {
            e.cancelBubble = true; //IE阻止冒泡方法
        }
    };
    stage.documentClick = function (e) {
        $(document).on("click", function (event) {
            $rootScope.$broadcast("documentClick", event);
        });
    };
    stage.GetStringByteLength = function (val) {
        if (!val) return;
        var Zhlength = 0;// 全角
        var Enlength = 0;// 半角
        for (var i = 0; i < val.length; i++) {
            if (val.substring(i, i + 1).match(/[^\xx0000-\xxffff]/ig) !== null)
                Zhlength += 1;
            else
                Enlength += 1;
        }
        // 返回当前字符串字节长度
        return (Zhlength * 2) + Enlength;
    };
    stage.timeOut = 0;
    stage.tag = function (str, type, time) {
        var _this = this;
        var nStr = "";
        var t = time || 3000;
        if (!type) type = "warning";
        var removeClass = function (obj) {
            obj.removeClass("warning");
            obj.removeClass("success");
            obj.removeClass("danger");
        };

        clearTimeout(_this.timeOut);


        if (angular.isArray(str)) {
            angular.forEach(str, function (item) {
                nStr += "<div>" + item + "</div>";
            });
        } else {
            nStr += "<div>" + str + "</div>";
        }

        if ($(".stageErr").length) {
            removeClass($(".stageErr"));
            $(".stageErr").addClass(type);
            $(".stageErr").html(nStr);
        } else {
            $('body').append("<div class='stageErr " + type + "'>" + nStr + "</div>");
        }
        _this.timeOut = setTimeout(function () {
            $(".stageErr").remove();
        }, t);

    };
    stage.warning = function (str, time) {
        stage.tag(str, 'warning', time);
    };
    stage.success = function (str, time) {
        stage.tag(str, 'success', time);
    };
    stage.danger = function (str, time) {
        stage.tag(str, 'danger', time);
    };


    return stage;

})
    .factory('$swal', function () {
        return window.swal;
    });
