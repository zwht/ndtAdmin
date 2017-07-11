/**
 * Created by Administrator on 2017/1/3.
 */
var md = require("../module/app");
md.directive('barCharts',
    function () {
        return{
            restrict: "A",
            replace: true,
            scope: {
                barData:'=',
                barName:'='
            },
            link:function (scope, element) {
                scope.$watch('barData',function () {
                   var option = {
                        color: ['#3398DB'],
                       title : {
                           text: '重要数据目标排序TOP20',
                           // subtext: '纯属虚构',
                           x:'left'
                       },
                        tooltip : {
                            trigger: 'axis',
                            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis : [
                            {
                                type : 'category',
                                data :scope.barName,
                                axisTick: {
                                    alignWithLabel: true
                                }
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value'
                            }
                        ],
                        series : [
                            {
                                name:'直接访问',
                                type:'bar',
                                barWidth: '60%',
                                data:scope.barData
                            }
                        ]
                    };
                    echarts.init(element.context).setOption(option);
                })
            }


        }
    })
