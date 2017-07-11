var md = require("../module/app");
md.directive('pieCharts',
    function () {
        return{
            restrict: "A",
            replace: true,
            scope: {
                pieData:'='
            },
            link:function (scope, element) {
                scope.$watch('pieData',function () {
                   var  option = {
                        title : {
                             text: '重点数据业务占比',
                            // subtext: '纯属虚构',
                            x:'center'
                        },
                        tooltip : {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            orient: 'vertical',
                            left: 'left',
                            data: scope.pieData
                        },
                        series : [
                            {
                                name: '数据业务占比',
                                type: 'pie',
                                radius : '55%',
                                center: ['50%', '60%'],
                                data:scope.pieData,
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ]
                    };
                    echarts.init(element.context).setOption(option);
                })
            }


        }
    });
