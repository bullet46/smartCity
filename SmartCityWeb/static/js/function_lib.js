function get_today_date() {
    //获取今天的日期
    var date = new Date();
    var year = date.getFullYear(); //获取当前年份
    var month = date.getMonth() + 1; //获取当前月份
    var day = date.getDate(); //获取当前日
    return year + "-" + month + "-" + day
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

function get_init_data(id, date = null) {
    // 针对四分类垃圾桶，获取初始数据
    //
    if (date == null) {
        date = get_today_date();
    }
    var file_in = new XMLHttpRequest();

    file_in.open('GET',
        'http://127.0.0.1/API/?device_data_search_by_day={"device_id":{0},"date":"{1}"}'.format(id, date),
        false)
    file_in.send(null)
    if (file_in.readyState == 4 && file_in.status == 200) {
        // 接收服务器端的数据
        if (file_in == 'None') {
            return null;
        } else {
            var data_back = JSON.parse(file_in.responseText)
            for (var k in data_back) {
                console.log(k);
            }
            return data_back;
        }

    }
}
