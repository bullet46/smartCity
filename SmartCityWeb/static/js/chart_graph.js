function chart_of_trash(device_id) {
    //四分类空间满度历史
    // var data123 = [
    //     { value: [ '2016/2/18 03:00:00', 363 ] },
    //     { value: [ '2016/2/18 04:00:00', 384 ] },
    //     { value: [ '2016/2/18 05:00:00', 371 ] },
    // ];
    //把new Date出来的时间格式转换为data123中的日期格式
    //用来返回data123一样的数据格式
    function chartData(i, data, now) {
        return {
            value: [
                riqigeshi(now),
                data[i],
            ]
        }
    }

    //把原数据改成data123一样的格式
    function changeData(datain) {
        var liuru = [];
        for (var i = 0; i < 50; i++) {
            startTime = new Date(+startTime + fiveMinutes);
            liuru.push(chartData(i, datain, startTime));
        }
        console.log(liuru)
        return liuru;
    }

    function refresh() {
        // liuru先shift(),再push()
        var liuruShift = liuru.shift();
        var liuruShiftVal = liuruShift.value[1];
        var newlrtime = riqigeshi(new Date(+new Date(liuruShift.value[0]) + oneDay + fiveMinutes));
        liuru.push({value: [newlrtime, liuruShiftVal]});
        chart.setOption({
            series: [{
                data: liuru,
            }, {
                data: liuru,
            }, {
                data: liuru,
            }, {
                data: liuru,
            }
            ]
        });
    }

    var chart = echarts.init(document.getElementById("data_trans"), "echarts_theme");
    var history_state = get_init_data(device_id);
    var data_init = get_element_by_data(history_state);
    console.log(data_init)
    console.log(data_init['harmful_distance'])
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
            data: data_init['kitchen_distance']
        }, {
            name: '有害垃圾',
            type: 'line',
            showSymbol: false,
            data: data_init['harmful_distance']
        }, {
            name: '其它垃圾',
            type: 'line',
            showSymbol: false,
            data: data_init['others_distance']
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


    // setInterval(function () {
    //     refresh();
    // }, 1000);

    window.onresize = function () {
        chart.resize();
    };
}


function chart_th_history() {
    //温度与湿度历史表格
}

function chart_recommend() {
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
                    {value: 25, name: '厨余垃圾'},
                    {value: 25, name: '有害垃圾'},
                    {value: 45, name: '其它垃圾'},
                    {value: 10, name: '可回收垃圾'}]
            }]
    }
    chart_recommend.setOption(option);
}