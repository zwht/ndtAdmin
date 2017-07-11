var md = require("../module/app");
md.directive('chart',
    function () {
        return{
            restrict: "A",
            replace: true,
            scope: {
                empName:'=',
                jobQuantity:"=",
                color:"="
            },
            link:function (scope, element,attr) {

                scope.$watch('jobQuantity',function () {
                    var option={
                        color:scope.color,
                        tooltip: {
                            trigger: 'axis',
                            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        legend: {
                            data:['任务数量'],
                            left:"3%"
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: {
                            data: scope.empName,
                            axisLine:{
                                show:false
                            },
                            axisTick: {
                                show: false
                            },
                        },
                        yAxis: {
                            axisLine:{
                                show:false
                            },
                            axisTick: {
                                show: false
                            },
                        },
                        textStyle:{
                            fontSize:18,
                            color:'#807d7d'
                        },
                        series: [{
                            name: '任务数量',
                            type: 'bar',
                            barWidth:'60%',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top',

                                }
                            },
                            data: scope.jobQuantity,
                        },]
                    };

                    echarts.init(element.context).setOption(option)
                })
            }


        }
    })