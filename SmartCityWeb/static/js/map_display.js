function map_display() {
    var map = new AMap.Map('container', {
        viewMode: '3D',
        turboMode: false,
        showIndoorMap: false,
        defaultCursor: '',
        showBuildingBlock: true,
        buildingAnimation: true,
        zooms: [16, 20],
        showLabel: false,
        zoom: 16,
        pitch: 55,
        rotation: -45,
        center: [113.928926, 22.571839],
        forceVector: true,
    });
    map.addControl(new AMap.ControlBar({
        showZoomBar: false,
        showControlButton: true,
        position: {
            right: '10px',
            top: '10px'
        }
    }))
    var facilities = [];
    var zoomStyleMapping1 = {
        14: 0,
        15: 0,
        16: 0,
        17: 0,
        18: 0,
        19: 0,
        20: 0
    }
    for (var i = 0; i < trash_can_info.length; i += 1) {
        var marker = new AMap.ElasticMarker({
            position: trash_can_info[i].position,
            zooms: [14, 20],
            clickable: true,
            styles: [{
                icon: {
                    img: trash_can_info[i].icon,
                    size: [16, 16],//可见区域的大小
                    ancher: [16, 16],//锚点
                    fitZoom: 16,//最合适的级别
                    scaleFactor: 2,//地图放大一级的缩放比例系数
                    maxScale: 2.5,//最大放大比例
                    minScale: 0.8//最小放大比例
                },
                label: {
                    content: trash_can_info[i].name,
                    offset: [-25, 0],
                    position: 'BM',
                    minZoom: 15
                }
            }],
            zoomStyleMapping: zoomStyleMapping1
        })
        facilities.push(marker);
    }

    function clicked() {
        //创建信息窗口
        var text = '        <iframe class="info_windows" id = \'info_windows\' src="/content/" width="100%" height="100%">\n' +
            '        </iframe> '
        var info_shower = document.getElementById('info_windows_container')
        info_shower.innerHTML = text
    }

    function map_clicked() {
        //关闭信息窗口
        var info_shower = document.getElementById('info_windows_container')
        info_shower.innerHTML = ''
    }

    function refresh() {
        // 仅仅提供device_id = 0 的刷新
        // 因为其他设备未接入
        var data = get_new_data(1);

        var device_0 = new AMap.ElasticMarker({
            position: trash_can_info[0].position,
            zooms: [14, 20],
            clickable: true,
            styles: [{
                icon: {
                    img: get_icons_by_data(data),
                    size: [16, 16],//可见区域的大小
                    ancher: [16, 16],//锚点
                    fitZoom: 16,//最合适的级别
                    scaleFactor: 2,//地图放大一级的缩放比例系数
                    maxScale: 2.5,//最大放大比例
                    minScale: 0.8//最小放大比例
                },
                label: {
                    content: trash_can_info[0].name,
                    offset: [-25, 0],
                    position: 'BM',
                    minZoom: 15
                }
            }],
            zoomStyleMapping: zoomStyleMapping1
        })
        facilities[0] = device_0
        facilities[0].on('click', function (e) {
            clicked()
        })
    }

    map.on('click', function (e) {
            map_clicked()
        }
    )

    refresh();
    map.add(facilities)
    setInterval(function () {
        refresh();
        map.add(facilities)
    }, 5000);



}

