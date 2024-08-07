<template>
  <div class="app-container">
    <div class="map_div">
      <baidu-map class="bm-view" :zoom="zoom" :center="center" :scroll-wheel-zoom="true" @ready="onMapReady">
        <bm-navigation anchor="BMAP_ANCHOR_BOTTOM_RIGHT"></bm-navigation>
        <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-map-type>
        <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT"></bm-city-list>
      </baidu-map>
    </div>
    <div class="select_div">
      <el-cascader
      :options="sections"
      v-model="selectedValue"
      placeholder="==请选择监测点=="
      @change="handleChange"
      :props="{expandTrigger: 'hover', value: 'ID', label: 'Name', children: 'Slopes'}"
      clearable
      ></el-cascader>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "Dashboard",
  inheritAttrs: false,
});
import { onMounted } from 'vue'
import MonitorAPI, { Section } from "@/api/monitor";
import { useAppStore } from "@/store";
import { useRouter } from "vue-router";

var g_BMap = null;
var g_map = null;
var sections = ref([]);
const selectedValue = ref([]);
const center = ref('广州市');
const zoom = ref(12);
const appStore = useAppStore();
const router = useRouter();

const dialog = reactive({
  title: "",
  visible: true,
});

onMounted(() => {
  MonitorAPI.getMonitorData()
    .then((data) => {
      data.forEach(section => {
        var sec = {};
        sec.ID = sections.value.length;
        sec.Name = section.section_name;
        sec.Location = section.location;
        sec.Slopes = [];

        section.slopes.forEach(slope => {
          var slp = {};
          slp.ID = sec.Slopes.length;
          slp.Name = slope.slope_name;
          slp.Location = slope.location;
          slp.Info = slope.description;
          slp.section_id = section.section_id;
          slp.slope_id = slope.slope_id;
          sec.Slopes.push(slp);
        })
        sections.value.push(sec);
      });
    })
    .catch((error) => {
      console.log(error);
    });
})

const onMapReady = ({BMap, BMapLib, map}) => {
  g_BMap = BMap;
  g_map = map;
  map.addEventListener("click", function (e) {
      // 经度、纬度
      console.info(e.point.lng + ", " + e.point.lat);
  });

  const mapIcon = new BMap.Icon("./images/map-slope.png", new BMap.Size(32, 32));
  const addMarker = (slope) => {
    // console.info(slope);
    var point = new BMap.Point(slope.Location.lng, slope.Location.lat);
    var marker = new BMap.Marker(point, { icon: mapIcon });  // 创建标注

    // 设置弹出信息
    var infoOpts = {
        width : 220,
        title: (slope.Name || ""),
        enableMessage: false,
        offset: new BMap.Size(0, -15)
    };
    var infoConten = slope.Info || "";
    infoConten += "<p style='color:red;'>注：双击打开模型</p>"
    var infoWindow = new BMap.InfoWindow(infoConten, infoOpts);
    
    map.addOverlay(marker); // 将标注添加到地图中
    //marker.setAnimation(BMAP_ANIMATION_DROP); // 坠落动画
    // 鼠标经过弹出信息
    marker.addEventListener("mouseover", function (e) {
        marker.openInfoWindow(infoWindow); 
    });
    // 鼠标移出关闭弹出信息
    marker.addEventListener("mouseout", function (e) {
        marker.closeInfoWindow();
    });
    marker.addEventListener("click", function (e) {
      var point = new g_BMap.Point(slope.Location.lng, slope.Location.lat);
      g_map.centerAndZoom(point, 18); // 移动成为中心点，并放大
    });
    // 双击打开模型
    marker.addEventListener("dblclick", function (e) {
      var point = new g_BMap.Point(slope.Location.lng, slope.Location.lat);
      g_map.centerAndZoom(point, 18); // 移动成为中心点，并放大
      appStore.setModelId(slope.section_id, slope.slope_id);
      router.replace("/redirect/slope/model");
    });
    return marker;
  }
  sections.value.forEach(section => {
    section.Slopes.forEach(slope => {
      addMarker(slope);
    })
  });

  var drv = new BMap.DrivingRoute('广州', {
    onSearchComplete: function(res) {
      if (drv.getStatus() == 0) {
        var plan = res.getPlan(0);
        var arrPois =[];
        for(var j=0; j<plan.getNumRoutes(); j++){
          var route = plan.getRoute(j);
          arrPois= arrPois.concat(route.getPath());
        }
        console.log(arrPois);
        map.addOverlay(new BMap.Polyline(arrPois, {strokeColor: '#111', strokeWeight: 6}));
        //map.setViewport(arrPois);
      }
    }
  });

  var baishahe=new BMap.Point(113.22199, 23.15377);
  var guangzhouqiao=new BMap.Point(113.32227, 23.11345);
  //drv.search(baishahe, guangzhouqiao);

  var driv = new BMap.DrivingRoute(map, { 
    renderOptions: {
      map: map,
      autoViewport: false
    }
  });

  var yangchun=new BMap.Point(111.72878815363339, 22.191629402109715);
  var zhanjiang=new BMap.Point(110.55048081658448, 21.421899242941098);
  driv.search(yangchun, zhanjiang);

  var driving = new BMap.DrivingRoute(map, { 
    renderOptions: {
      map: map,
      autoViewport: true
    }
  });
  var qingyuan=new BMap.Point(112.90856430832153, 23.72229814727207);
  var yunfu=new BMap.Point(112.20528409775535, 22.94680534408388);
  driving.search(qingyuan, yunfu);

/*
var local = new BMap.LocalSearch(map, {      
    renderOptions:{map: map}      
});      
local.search("汕湛高速");
*/
}

const handleChange = (value) => {
  console.log(value);
  if(value == null || value == undefined) return;
  var slope = sections.value[value[0]].Slopes[value[1]];
  var point = new g_BMap.Point(slope.Location.lng, slope.Location.lat);
  g_map.centerAndZoom(point, 18); // 移动成为中心点，并放大
}
</script>

<style lang="scss" scoped>
.bm-view {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
}
.map_div{
  width: 100%;
  height: 100%;
  /* background-color: aliceblue; */
}
	
.select_div{
  width: 200px;
  height: 30px;
  background-color: rgba(255, 255, 255, 0);;
  position: absolute;	/* 固定定位 */
  top: 5px;
  left: 90px;
}

iframe {
  width: 100%;
  height: 100%;
}
</style>

<style>
.anchorBL {
  display: none;
}
</style>