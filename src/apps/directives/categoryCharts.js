/**
 * Created by Administrator on 2017/1/3.
 */
/**
 * Created by Administrator on 2017/1/3.
 */
var md = require("../module/app");
md.directive('categoryCharts',
    function () {
        return{
            restrict: "A",
            replace: true,
            scope: {
                categoryData:'=',
                categoryName:'=',
                categoryTitle:'='
            },
            link:function (scope, element) {
                scope.$watch('categoryData',function () {
                   var option = {
                        title: {
                            text: '近三个月新增重点数据走势',
                            x:'left'
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        // toolbox: {  //是否保存为图片功能
                        //     feature: {
                        //         saveAsImage: {}
                        //     }
                        // },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: scope.categoryName
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [
                            {
                                name:scope.categoryTitle,
                                type:'line',
                                stack: '总量',
                                data: scope.categoryData
                            }

                        ]
                    };
                    echarts.init(element.context).setOption(option);
                })
            }


        }
    })
