function map_display() {
    var map = new AMap.Map('container', {
        viewMode:'3D',
        turboMode:false,
        showIndoorMap:false,
        defaultCursor:'pointer',
        showBuildingBlock:false,
        zooms:[14,20],
        showLabel:true,
        zoom:16,
        pitch:55,
        rotation:-45,
        center:[113.928926,22.571839],
        forceVector:true,
    });


    var spots = [];
    var zoomStyleMapping2 = {
        14:0,
        15:0,
        16:1,
        17:1,
        18:1,
        19:1,
        20:1
    }
    for(var i=0;i<trash_can_info.length;i+=1){
        var marker = new AMap.ElasticMarker({
            position:trash_can_info[i].position,
            zooms:[14,20],
            styles:[{
                icon:{
                    img:trash_can_info[i].smallIcon,
                    size:[16,16],//可见区域的大小
                    ancher:[8,16],//锚点
                    fitZoom:14,//最合适的级别
                    scaleFactor:2,//地图放大一级的缩放比例系数
                    maxScale:2,//最大放大比例
                    minScale:1//最小放大比例
                },
                label:{
                    content:trash_can_info[i].name,
                    offset:[-35,0],
                    position:'BM',
                    minZoom:15
                }
            }],
            zoomStyleMapping:zoomStyleMapping2
        })
        spots.push(marker);
    }
    map.add(spots)

    map.on('click',function(e){
        console.log(e.lnglat+'')
    })
    new AMap.Polygon({
        cursor:'pointer',
        bubble:true,
        map:map,
        fillOpacity:0.3,
        strokeWeight:1,
        fillColor:'green'

    })

}
