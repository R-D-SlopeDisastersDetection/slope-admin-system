<template>
  <div class="app-container">
    <div class="map_div">
      <baidu-map class="bm-view" :zoom="zoom" :center="center" :scroll-wheel-zoom="true" @ready="onMapReady">
        <bm-navigation anchor="BMAP_ANCHOR_BOTTOM_RIGHT"></bm-navigation>
        <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-map-type>
        <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT"></bm-city-list>

        <!-- 边坡监测点标记 -->
        <template v-for="section in sections" :key="section.section_id">
          <!-- 需加key属性，不然删除时数据会错乱 -->
          <bm-marker v-for="slope in section.slopes" :key="slope.slope_id" :position="slope.location" :dragging="false"
            :icon="markIcon" @mouseover="onSlopeMarkEvent($event, slope)" @mouseout="onSlopeMarkEvent($event, slope)"
            @click="onSlopeMarkEvent($event, slope)" @dblclick="onSlopeMarkEvent($event, slope)">
            <bm-context-menu>
              <bm-context-menu-item text="操作1"></bm-context-menu-item>
            </bm-context-menu>
          </bm-marker>
        </template>

        <!-- 右键菜单 -->
        <bm-context-menu>
          <bm-context-menu-item :callback="newSlope" text="新增边坡监测点"></bm-context-menu-item>
        </bm-context-menu>
      </baidu-map>
    </div>
    <div class="select_div">
      <el-cascader :options="sections" v-model="selectedValue" placeholder="==请选择监测点==" @change="handleChange"
        :props="{ expandTrigger: 'hover', value: 'ID', label: 'Name', children: 'slopes' }" clearable
        filterable></el-cascader>
    </div>

    <!-- 选中的边坡监测点的信息 -->
    <el-dialog v-model="showSlopeDialog" style="position: absolute; right: 20px" top="70px" :append-to-body="true"
      :close-on-click-modal="false" :title="'检测点:' + currentSlope.slope_name" width="500" :draggable="true"
      :modal="false" modal-class="dialog_class">
      <div>
        <el-row style="margin-bottom: 16px;">
          <el-col :span="4">
            <div>边坡名称：</div>
          </el-col>
          <el-col :span="20">
            <el-input v-model="currentSlope.slope_name" />
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 16px;">
          <el-col :span="4">
            <div>位置：</div>
          </el-col>
          <el-col :span="20">
            <div>经度:{{ currentSlope.location.lng }}</div>
            <div>纬度:{{ currentSlope.location.lat }}</div>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 16px;">
          <el-col :span="4">
            <div>监测内容：</div>
          </el-col>
          <el-col :span="20">
            <el-input v-model="currentSlope.slope_type" />
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 16px;">
          <el-col :span="4">
            <div>描述：</div>
          </el-col>
          <el-col :span="20">
            <el-input v-model="currentSlope.description" />
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 16px;">
          <el-col :span="4">
            <div>施工日期：</div>
          </el-col>
          <el-col :span="20">
            <el-date-picker v-model="currentSlope.construction_date" type="date" placeholder="请选择日期"
              :clearable="false" />
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 16px;">
          <el-col :span="4">
            <div>边坡高度：</div>
          </el-col>
          <el-col :span="20">
            <el-slider v-model="currentSlope.slope_hight" :min="0" :max="500" show-input />
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 16px;">
          <el-col :span="4">
            <div>边坡长度：</div>
          </el-col>
          <el-col :span="20">
            <el-slider v-model="currentSlope.slope_length" :min="0" :max="500" show-input />
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 16px;">
          <el-col :span="4">
            <div>状态：</div>
          </el-col>
          <el-col :span="20">
            <el-select v-model="currentSlope.status" placeholder="请选择预警等级">
              <el-option label="normal" value="normal" />
              <el-option label="disease" value="disease" />
            </el-select>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 16px;">
          <el-col :span="4">
            <div>预警数量：</div>
          </el-col>
          <el-col :span="20">
            <div>{{ currentSlope.alerts.length }}</div>
          </el-col>
        </el-row>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="changeSlope()">变更</el-button>
          <el-button type="danger" @click="deleteSlope()">
            删除
          </el-button>
        </div>
      </template>
    </el-dialog>
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
// const markIcon = new BMap.Icon("./images/map-slope.png", new BMap.Size(32, 32));
const markIcon = {
  url: "./images/map-slope.png",
  size: { width: 32, height: 32 }
}
const appStore = useAppStore();
const router = useRouter();
const currentSlope = ref({
  slope_id: 0,
  section_id: 0,
  slope_name: "",
  location: { lng: 0, lat: 0 },
  milepost: "",
  slope_type: "",
  slope_hight: 0,
  slope_length: 0,
  description: "",
  construction_date: "",
  status: "",
  alerts: []
});
const showSlopeDialog = ref(false);

const dialog = reactive({
  title: "",
  visible: true,
});

onMounted(() => {
  MonitorAPI.getMonitorData()
    .then((data) => {
      sections.value = data;
      sections.value.forEach((section) => {
        // 设置监测点的value和label
        section.ID = section.section_id;
        section.Name = section.section_name;
        section.slopes.forEach((slope) => {
          slope.ID = slope.slope_id;
          slope.Name = slope.slope_name;
          slope.section_id = section.section_id;
        })
      })
    })
    .catch((error) => {
      console.log(error);
    });
})

const newSlope = (e) => {
  // console.log(e.point.lng, e.point.lat);
  currentSlope.value = {
    slope_id: 0,
    section_id: 0,
    slope_name: "",
    location: { lng: e.point.lng, lat: e.point.lat },
    milepost: "",
    slope_type: "",
    slope_hight: 0,
    slope_length: 0,
    description: "",
    construction_date: Date.now(),
    status: "",
    alerts: []
  }
  showSlopeDialog.value = true;
}

const deleteSlope = () => {
  // 调用接口

  const section = sections.value.find(item => item.section_id === currentSlope.value.section_id);
  const index = section.slopes.findIndex(item => item.slope_id === currentSlope.value.slope_id);
  if (index > -1) {
    section.slopes.splice(index, 1);
  }
  ElMessage.success('删除成功');
  showSlopeDialog.value = false;
}

const changeSlope = () => {
  // 调用接口

  currentSlope.value.Name = currentSlope.value.slope_name; // 更新级联选择器的label
  ElMessage.success('变更成功');
  showSlopeDialog.value = false;
}

const onSlopeMarkEvent = ({ type, target }, slope) => {
  if (type === "onmouseover") {
    // 设置弹出信息
    var infoOpts = {
      width: 220,
      title: (slope.slope_name || ""),
      enableMessage: false,
      offset: new BMap.Size(0, -15)
    };
    var infoConten = slope.description || "";
    infoConten += "<p style='color:red;'>注：双击打开模型</p>"
    var infoWindow = new BMap.InfoWindow(infoConten, infoOpts);
    target.openInfoWindow(infoWindow);

  } else if (type === "onmouseout") {
    target.closeInfoWindow();

  } else if (type === "onclick") {
    selectedValue.value[0] = slope.section_id;
    selectedValue.value[1] = slope.slope_id;
    // 移动成为中心点，并放大
    var point = new BMap.Point(slope.location.lng, slope.location.lat);
    g_map.centerAndZoom(point, 18);
    showSlopeDialog.value = true;
    currentSlope.value = slope;

  } else if (type === "ondblclick") {
    var point = new BMap.Point(slope.location.lng, slope.location.lat);
    g_map.centerAndZoom(point, 18); // 移动成为中心点，并放大
    appStore.setModelId(slope.section_id, slope.slope_id);
    router.replace("/redirect/slope/model");
  }
}

const onMapReady = ({ BMap, BMapLib, map }) => {
  g_BMap = BMap;
  g_map = map;

  map.addEventListener("click", function (e) {
    // 获取当前点击位置的经度、纬度
    // console.info(e.point.lng + ", " + e.point.lat);
  });

  var drv = new BMap.DrivingRoute('广州', {
    onSearchComplete: function (res) {
      if (drv.getStatus() == 0) {
        var plan = res.getPlan(0);
        var arrPois = [];
        for (var j = 0; j < plan.getNumRoutes(); j++) {
          var route = plan.getRoute(j);
          arrPois = arrPois.concat(route.getPath());
        }
        console.log(arrPois);
        map.addOverlay(new BMap.Polyline(arrPois, { strokeColor: '#111', strokeWeight: 6 }));
        //map.setViewport(arrPois);
      }
    }
  });

  var baishahe = new BMap.Point(113.22199, 23.15377);
  var guangzhouqiao = new BMap.Point(113.32227, 23.11345);
  //drv.search(baishahe, guangzhouqiao);

  var driv = new BMap.DrivingRoute(map, {
    renderOptions: {
      map: map,
      autoViewport: false
    }
  });

  var yangchun = new BMap.Point(111.72878815363339, 22.191629402109715);
  var zhanjiang = new BMap.Point(110.55048081658448, 21.421899242941098);
  driv.search(yangchun, zhanjiang);

  var driving = new BMap.DrivingRoute(map, {
    renderOptions: {
      map: map,
      autoViewport: true
    }
  });
  var qingyuan = new BMap.Point(112.90856430832153, 23.72229814727207);
  var yunfu = new BMap.Point(112.20528409775535, 22.94680534408388);
  driving.search(qingyuan, yunfu);

  /*
  var local = new BMap.LocalSearch(map, {      
      renderOptions:{map: map}      
  });      
  local.search("汕湛高速");
  */
}

const handleChange = (value) => {
  if (value == null || value == undefined) return;
  // 获取选中的边坡检测点
  var slope = sections.value.find(item => item.section_id === value[0]).slopes.find(item => item.slope_id === value[1]);
  var point = new g_BMap.Point(slope.location.lng, slope.location.lat);
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

.map_div {
  width: 100%;
  height: 100%;
  /* background-color: aliceblue; */
}

.select_div {
  width: 200px;
  height: 30px;
  background-color: rgba(255, 255, 255, 0);
  ;
  position: absolute;
  /* 固定定位 */
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