function map_display() {
    var map = new AMap.Map('container', {
        viewMode: '3D',
        turboMode: false,
        showIndoorMap: false,
        defaultCursor: 'pointer',
        showBuildingBlock: false,
        zooms: [16, 20],
        showLabel: true,
        zoom: 16,
        pitch: 55,
        rotation: -45,
        center: [113.928926, 22.571839],
        forceVector: true,
    });
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
            clickable:true,
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

    function refresh(){
        // 仅仅提供device_id = 0 的刷新
        // 因为其他设备未接入
        var data = get_new_data(1);

        var device_0 = new AMap.ElasticMarker({
            position: trash_can_info[0].position,
            zooms: [14, 20],
            clickable:true,
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
    }

    refresh();
    setInterval(function () {
    }, 20000);

    map.add(facilities)


    map.on('click', function (e) {
        console.log(e.lnglat + '')
    })
    new AMap.Polygon({
        cursor: 'pointer',
        bubble: true,
        map: map,
        fillOpacity: 0.3,
        strokeWeight: 1,
        fillColor: 'green'

    })

}
