/**
 * Created by zhaowei on 16/12/27.
 */

var md = require("../module/app");
md.filter('numberChinese', function () {
    return function (num, key) {
        var objList = [
            {
                name: "等级",
                list: ["全部", "一级", "二级", "三级", "四级", "五级"]
            },
            {
                name: "重要性",
                list: ["全部", "非常重要", "重要", "一般", "不重要", "非常不重要"]
            },
            {
                name: "优先级",
                list: ["全部", "高", "中", "低"]
            },
            {
                name: "文件类型",
                list: ["全部", "Email", "Pdf", "Doc", "Txt"]
            },
            {
                name: "文件类型图标",
                list: ["全部", "icon-ic_email", "icon-folder", "icon-word", "icon-ic_mail_open"]
            },
            {
                name: "任务类型",
                list: ["全部", "初筛", "初筛审核", "翻译", "校对", "整编"]
            },
            {
                name: "申报状态",
                list: ["未申报", "已申报"]
            }

        ];
        var activeObj = "";


        for (var i = 0; i < objList.length; i++) {
            if (objList[i].name == key) {
                activeObj = objList[i];
                break
            }
        }
        if (activeObj) {
            return activeObj.list[num];
        } else {
            return num;
        }
    }
});