function get_today_date() {
    //获取今天的日期
    var date = new Date();
    var year = date.getFullYear(); //获取当前年份
    var month = date.getMonth() + 1; //获取当前月份
    var day = date.getDate(); //获取当前日
    return year + "-" + month + "-" + day
}

function get_now_time() {
    var now = new Date();
    var day = get_today_date()
    var hh = now.getHours();            //时
    var mm = now.getMinutes();          //分
    var ss = now.getSeconds();
    return day + ' ' + hh + ':' + mm + ':' + ss
}

function str_to_percent(values) {
    try {
        percents = (1 - parseFloat(values) / 10) * 100
        if (percents < 0) {
            return 0.00
        } else {
            return percents
        }

    } catch (err) {
        return null
    }

}

function convert_date(dateString) {
    //时间字符串转日期
    if (dateString) {
        var arr1 = dateString.split(" ");
        var sdate = arr1[0].split('-');
        var date = new Date(sdate[0], sdate[1] - 1, sdate[2]);
        return date;
    }
}

String.prototype.format = function () {
    // 字符串格式化输出，例如
    // "{0} is not {1}".format("Linux", "Unix")
    // "Linux is not Unix"
    var args = arguments;
    return this.replace(/\{(\d+)\}/gm, function (ms, p1) {
        return typeof (args[p1]) == 'undefined' ? ms : args[p1]
    });
}

function get_init_data(device_id, date = null) {
    // 针对四分类垃圾桶，获取初始数据
    // 即今天内所有数据
    // {time:[其它垃圾，可回收，厨余垃圾，有害垃圾]}
    if (date == null) {
        date = get_today_date();
    }
    var data_init = new XMLHttpRequest();

    data_init.open('GET',
        '/API/?device_data_search_by_day={"device_id":{0},"date":"{1}"}'.format(device_id, date),
        false)
    data_init.send(null)
    if (data_init.readyState == 4 && data_init.status == 200) {
        // 接收服务器端的数据
        if (data_init.responseText == 'None' || data_init.responseText == '{}') {
            return null;
        } else {
            var data_back = JSON.parse(data_init.responseText)
            return data_back;
        }
    }
}

function get_new_data(device_id) {
    //返回某个设备的最新状态
    //返回列表 其中内容为[时间，其它垃圾，可回收，厨余垃圾，有害垃圾，温度，湿度]
    var data_new = new XMLHttpRequest();
    data_new.open('GET', '/API/?device_data_id_now=' + device_id.toString(), false)
    data_new.send(null)
    var data_back_list = []
    if (data_new.readyState == 4 && data_new.status == 200) {
        // 接收服务器端的数据
        if (data_new.responseText == 'None' || data_new.responseText == '{}') {
            return null;
        } else {
            var data_back = JSON.parse(data_new.responseText)
            data_back_list = [data_back['time'], str_to_percent(data_back['others_distance']), str_to_percent(data_back['recyclable']),
                str_to_percent(data_back['kitchen_distance']), str_to_percent(data_back['harmful_distance']), data_back['temperature'], data_back['humidity']]
            return data_back_list;
        }
    }
}

function get_element_by_data(data) {
    //根据返回数据进行拼装
    //返回对象 如针对{others_distance:[[时间,值1],...]
    //              recyclable:..,kitchen_distance:..,harmful_distance:..,temperature:..,humidity:..}
    others_distance_l = []
    recyclable_l = []
    kitchen_distance_l = []
    harmful_distance_l = []
    temperature_l = []
    humidity_l = []
    for (keys in data) {
        var key_str = keys
        others_distance_l.push([key_str, str_to_percent(data[key_str][0])]);
        recyclable_l.push([key_str, str_to_percent(data[key_str][1])]);
        kitchen_distance_l.push([key_str, str_to_percent(data[key_str][2])]);
        harmful_distance_l.push([key_str, str_to_percent(data[key_str][3])]);
        temperature_l.push([key_str, data[key_str][4]]);
        humidity_l.push([key_str, data[key_str][5]]);
    }
    dict_back = {
        others: others_distance_l,
        recyclable: recyclable_l,
        kitchen: kitchen_distance_l,
        harmful: harmful_distance_l,
        temperature: temperature_l,
        humidity: humidity_l
    }
    return dict_back
}

function get_all_data_now() {
    //通过接口获取目前所有设备的最新状态
    var data_init = new XMLHttpRequest();
    data_init.open('GET',
        '/API/?device_data_all_now',
        false)
    data_init.send(null)
    if (data_init.readyState == 4 && data_init.status == 200) {
        // 接收服务器端的数据
        if (data_init.responseText == 'None' || data_init.responseText == '{}') {
            return null;
        } else {
            var data_back = JSON.parse(data_init.responseText)
            return data_back;
        }
    }
}

function get_icons_by_data(data) {
    // data内容 [时间，str(其它垃圾)，可回收，厨余垃圾，有害垃圾，温度，湿度]
    // 注，垃圾均为百分比转换
    var others = data[1]
    var recyclable = data[2]
    var kitchen = data[3]
    var harmful = data[4]
    var temperature = parseFloat(data[5])
    var max_percent = Math.max(others, recyclable, kitchen, harmful)
    if (temperature >= 50) {
        return 'static/icons/info_fire.png'
    }
    if (max_percent <= 20) {
        return 'static/icons/trash_20.png'
    } else if (max_percent <= 40) {
        return 'static/icons/trash_40.png'
    } else if (max_percent <= 60) {
        return 'static/icons/trash_60.png'
    } else if (max_percent <= 80) {
        return 'static/icons/trash_80.png'
    } else if (max_percent <= 100) {
        return 'static/icons/trash_100.png'
    } else if (window.isNaN(max_percent) == true) {
        return 'static/icons/info_offline.png'
    }

}

function get_icons_by_data_single(data, area) {
    // area 取值为 0-3
    //代表 其它垃圾，可回收，厨余垃圾，有害垃圾
    var temperature = parseFloat(data[5])
    var percent = parseFloat(data[area + 1])
    if (temperature >= 50) {
        return '/static/icons/info_fire.png'
    }
    if (percent <= 20) {
        return '/static/icons/trash_20.png'
    } else if (percent <= 40) {
        return '/static/icons/trash_40.png'
    } else if (percent <= 60) {
        return '/static/icons/trash_60.png'
    } else if (percent <= 80) {
        return '/static/icons/trash_80.png'
    } else if (percent <= 100) {
        return '/static/icons/trash_100.png'
    } else if (window.isNaN(percent) == true) {
        return '/static/icons/info_offline.png'
    }
}

function change_image(data) {
    var others =document.getElementById("other_can_img")
    var recyclable = document.getElementById("recover_can_img")
    var kitchen = document.getElementById("kitchen_can_img")
    var harmful = document.getElementById("harm_can_img")
    others.src = get_icons_by_data_single(data,0)
    recyclable.src = get_icons_by_data_single(data,1)
    kitchen.src = get_icons_by_data_single(data,2)
    harmful.src =get_icons_by_data_single(data,3)
    var others_info = document.getElementById("other_can_info")
    var recyclable_info = document.getElementById("recover_can_info")
    var kitchen_info = document.getElementById("kitchen_can_info")
    var harmful_info = document.getElementById("harm_can_info")
    console.log('123')
    console.log(others_info)
    others_info.innerText = parseInt(data[1]) + ' %'
    recyclable_info.innerHTML = parseInt(data[2]) + ' %'
    kitchen_info.innerHTML = parseInt(data[3])+ ' %'
    harmful_info.innerHTML = parseInt(data[4])+ ' %'
}
