function chart_of_trash(device_id) {
    //四分类空间满度历史
    // var data123 = [
    //     { value: [ '2016/2/18 03:00:00', 363 ] },
    //     { value: [ '2016/2/18 04:00:00', 384 ] },
    //     { value: [ '2016/2/18 05:00:00', 371 ] },
    // ];
    //把new Date出来的时间格式转换为data123中的日期格式
    //用来返回data123一样的数据格式
    //把原数据改成data123一样的格式


    var chart = echarts.init(document.getElementById("data_trans"), "echarts_theme");
    var history_state = get_init_data(device_id);
    var data_init = get_element_by_data(history_state);
    var option = {
        title: {
            text: '垃圾桶历史状态表',
            top: 10
        },
        grid: {
            width: 250,
            x2: '5%',
            y2: '27%',
        },
        xAxis: {
            type: 'time',
            splitNumber: 5,
        },
        yAxis: [{
            type: 'value',
            axisLabel: {
                formatter: '{value} %'       //给Y轴上的刻度加上单位
            }
        },
            {
                type: 'value',
            }
        ],
        dataZoom: [
            {
                y2: "10%",
                type: 'slider',//数据滑块
                start: 100,
                minSpan: 5,    //5min
                // minSpan:16,   //10min
                // minSpan:24,   //15min
                // minSpan:50,   //30min
                dataBackground: {
                    lineStyle: {
                        color: '#95BC2F'
                    },
                    areaStyle: {
                        color: '#95BC2F',
                        opacity: 1,
                    }
                },
                // fillerColor:'rgba(255,255,255,.6)'
            },
            {
                type: 'inside'//使鼠标在图表中时滚轮可用
            }
        ],
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                var result = params[0].value[0];
                params.forEach(function (item) {
                    result += '<br/>';
                    result += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;' +
                        'height:9px;background-color:' + item.color + '"></span>';
                    result += item.seriesName + "：";
                    result += isNaN(item.value[1]) ? 0 : (item.value[1] / 1).toFixed(2) + "%";
                });
                return result;
            },
        },
        series: [{
            name: '厨余垃圾',
            type: 'line',
            showSymbol: false,
            data: data_init['kitchen']
        }, {
            name: '有害垃圾',
            type: 'line',
            showSymbol: false,
            data: data_init['harmful']
        }, {
            name: '其它垃圾',
            type: 'line',
            showSymbol: false,
            data: data_init['others']
        }, {
            name: '可回收垃圾',
            type: 'line',
            showSymbol: false,
            data: data_init['recyclable']
        }
        ]
    };
    chart.setOption(option);
    $("#timeSpan").on('click', 'li', function () {
        var timeSpan = $(this).html();
        switch (timeSpan) {
            case '1min':
                chart.setOption({
                    dataZoom: [
                        {
                            start: 98,
                            end: 100
                        }
                    ],
                });
                break;
            case '5min':
                chart.setOption({
                    dataZoom: [
                        {
                            start: 92,
                            end: 100
                        }
                    ],
                });
                break;
            case '10min':
                chart.setOption({
                    dataZoom: [
                        {
                            start: 84,
                            end: 100
                        }
                    ],
                });
                break;
            case '15min':
                chart.setOption({
                    dataZoom: [
                        {
                            start: 76,
                            end: 100
                        }
                    ],
                });
                break;
            case '30min':
                chart.setOption({
                    dataZoom: [
                        {
                            start: 50,
                            end: 100
                        }
                    ],
                });
                break;
        }
    });


    function refresh(device_id, data_now) {
        // 刷新并更新数据
        new_data = get_new_data(device_id);
        if (new_data ==null){
            return null
        }
        last_state_time = get_now_time();
        data_now['others'].push([last_state_time, new_data[1]]);
        data_now['recyclable'].push([last_state_time, new_data[2]]);
        data_now['kitchen'].push([last_state_time, new_data[3]]);
        data_now['harmful'].push([last_state_time, new_data[4]]);
        chart.setOption({
                series: [{
                    data: data_now['others']
                }, {
                    data: data_now['recyclable']
                }, {
                    data: data_now['kitchen']
                }, {
                    data: data_now['harmful']
                }]
            }
        )
        return data_now

    }

    setInterval(function () {
        refresh(device_id, data_init);
    }, 3000);

    window.onresize = function () {
        chart.resize();
    };
}


function chart_th_history(device_id) {
    //温度与湿度历史表格
    var chart = echarts.init(document.getElementById("th_trans"), "echarts_theme");
    var history_state = get_init_data(device_id);
    var data_init = get_element_by_data(history_state);
    var option = {
        title: {
            text: '垃圾桶温度历史监测表',
            top: 10
        },
        grid: {
            width: 250,
            x2: '5%',
            y2: '27%',
        },
        xAxis: {
            type: 'time',
            splitNumber: 5,
        },
        yAxis: [{
            type: 'value',
            axisLabel: {
                formatter: '{value}'       //给Y轴上的刻度加上单位
            }
        },
            {
                type: 'value',
            }
        ],
        dataZoom: [
            {
                y2: "10%",
                type: 'slider',//数据滑块
                start: 100,
                minSpan: 5,    //5min
                // minSpan:16,   //10min
                // minSpan:24,   //15min
                // minSpan:50,   //30min
                dataBackground: {
                    lineStyle: {
                        color: '#95BC2F'
                    },
                    areaStyle: {
                        color: '#95BC2F',
                        opacity: 1,
                    }
                },
                // fillerColor:'rgba(255,255,255,.6)'
            },
            {
                type: 'inside'//使鼠标在图表中时滚轮可用
            }
        ],
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                var result = params[0].value[0];
                params.forEach(function (item) {
                    result += '<br/>';
                    result += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;' +
                        'height:9px;background-color:' + item.color + '"></span>';
                    result += item.seriesName + "：";
                    result += isNaN(item.value[1]) ? 0 : (item.value[1] / 1).toFixed(2);
                });
                return result;
            },
        },
        series: [{
            name: '温度',
            type: 'line',
            showSymbol: false,
            data: data_init['temperature']
        }, {
            name: '湿度',
            type: 'line',
            showSymbol: false,
            data: data_init['humidity']
        }
        ]
    };
    chart.setOption(option);
    $("#timeSpan").on('click', 'li', function () {
        var timeSpan = $(this).html();
        switch (timeSpan) {
            case '1min':
                chart.setOption({
                    dataZoom: [
                        {
                            start: 98,
                            end: 100
                        }
                    ],
                });
                break;
            case '5min':
                chart.setOption({
                    dataZoom: [
                        {
                            start: 92,
                            end: 100
                        }
                    ],
                });
                break;
            case '10min':
                chart.setOption({
                    dataZoom: [
                        {
                            start: 84,
                            end: 100
                        }
                    ],
                });
                break;
            case '15min':
                chart.setOption({
                    dataZoom: [
                        {
                            start: 76,
                            end: 100
                        }
                    ],
                });
                break;
            case '30min':
                chart.setOption({
                    dataZoom: [
                        {
                            start: 50,
                            end: 100
                        }
                    ],
                });
                break;
        }
    });


    function refresh(device_id, data_now) {
        // 刷新并更新数据
        new_data = get_new_data(device_id);
        last_state_time = get_now_time();
        data_now['temperature'].push([last_state_time, new_data[4]]);
        data_now['humidity'].push([last_state_time, new_data[5]]);
        chart.setOption({
                series: [{
                    data: data_now['temperature']
                }, {
                    data: data_now['humidity']
                }]
            }
        )
        return data_now

    }

    setInterval(function () {
        refresh(device_id, data_init);
    }, 5000);

    window.onresize = function () {
        chart.resize();
    };
}

function chart_recommend(recommends) {
    //推荐分配方式饼状图
    var chart_recommend = echarts.init(document.getElementById("recommend_space"), "echarts_theme");
    var option = {
        title: {
            text: '推荐分配方式',
            top: 20
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c}%"
        },
        series: [
            {
                name: '推荐分配',
                type: 'pie',
                radius: '40%',
                center: ['50%', '40%'],
                data: [
                    {value: recommends[0], name: '厨余垃圾'},
                    {value: recommends[1], name: '有害垃圾'},
                    {value: recommends[2], name: '其它垃圾'},
                    {value: recommends[3], name: '可回收垃圾'}]
            }]
    }
    chart_recommend.setOption(option);
}