function get_today_date() {
    //获取今天的日期
    var date = new Date();
    var year = date.getFullYear(); //获取当前年份
    var month = date.getMonth() + 1; //获取当前月份
    var day = date.getDate(); //获取当前日
    return year + "-" + month + "-" + day
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
        'http://127.0.0.1/API/?device_data_search_by_day={"device_id":{0},"date":"{1}"}'.format(device_id, date),
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
    data_new.open('GET', 'http://127.0.0.1/API/?device_data_id_now=' + device_id.toString(), false)
    data_new.send(null)
    var data_back_list = []
    if (data_new.readyState == 4 && data_new.status == 200) {
        // 接收服务器端的数据
        if (data_new.responseText == 'None' || data_new.responseText == '{}') {
            return null;
        } else {
            var data_back = JSON.parse(data_new.responseText)
            data_back_list = [data_back['time'], data_back['others_distance'], data_back['recyclable'],
                data_back['kitchen_distance'], data_back['harmful_distance'], data_back['temperature'], data_back['humidity']]
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
        others_distance_l.push([key_str, data[key_str][0]]);
        recyclable_l.push([key_str, data[key_str][1]]);
        kitchen_distance_l.push([key_str, data[key_str][2]]);
        harmful_distance_l.push([key_str, data[key_str][3]]);
        temperature_l.push([key_str, data[key_str][4]]);
        humidity_l.push([key_str, data[key_str][5]]);
    }
    dict_back = {
        others_distance: others_distance_l,
        recyclable: recyclable_l,
        kitchen_distance: kitchen_distance_l,
        harmful_distance: harmful_distance_l,
        temperature: temperature_l,
        humidity: humidity_l
    }
    return dict_back
}