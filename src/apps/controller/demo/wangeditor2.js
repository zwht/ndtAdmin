/**
 * Created by zhaowei on 16/12/14.
 */
var md = require("../../module/demo");
var config = require("../../directives/wangeditor2Config");
md.controller('wangeditor2Ctrl', wangeditor2Ctrl);
wangeditor2Ctrl.$inject = ["$scope"];
function wangeditor2Ctrl($scope) {
    var editor = new wangEditor('div1');
    config.diyConfig(editor);
    editor.create();
    editor.$txt.html('<p>要初始化的内容</p><p>sdd</p><p>dsd</p><p>y5hh</p>');

    $(".btn").click(function () {
        var formatText = editor.$txt.formatText();
        var tt = editor.$txt.text();
        console.log(formatText);
        console.log(tt);
    })

}
