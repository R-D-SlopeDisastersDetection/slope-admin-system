<template>
  <div class="app-container">
    <div id="slope-viewer" class="slope-viewer">
      <vc-config-provider :cesium-path="cesiumPath" :access-token="accesstToken">
        <vc-viewer
        ref="viewerRef"
        :info-box=false
        :fullscreen-button=true
        fullscreen-element=document.body
        @ready="onViewerReady">
          <vc-terrain-provider-cesium ref="provider"></vc-terrain-provider-cesium>
          <vc-layer-imagery>
            <vc-imagery-provider-bing
              bm-key="AmGu3cvB_g1HbkQErEyvmLc9j0YIGWS7IdOqR7-hQbO8J92Fzrzkhy_bYKSsyoEx"
            ></vc-imagery-provider-bing>
          </vc-layer-imagery>
          
          <div v-for="alert in alertInfo">
            <vc-entity
            :id="alert.alert_id.toString()"
            :name="alert.alert_name"
            :show="alertState"
            @mouseover="onEntityAlertEvt"
            @mouseout="onEntityAlertEvt">
              <vc-graphics-polygon
                :hierarchy="alert.disease.area"
                :material="[255,255,0,125]"
                :extrudedHeight="0"
                :perPositionHeight="true"
                :outline="true"
                outlineColor="black"
              ></vc-graphics-polygon>
            </vc-entity>
            <div v-for="(mark, index) in alert.disease.marks">
              <vc-entity
              :position="mark"
              :id="alert.alert_id.toString()+'|'+index"
              :name="alert.alert_name"
              :show="alertState"
              @click="pickEntityMarkEvt"
              @mouseover="onEntityMarkEvt"
              @mouseout="onEntityMarkEvt">
                <vc-graphics-billboard
                  ref="billboard"
                  :image="image"
                  :scale="scale"
                  :show="show"
                  :distance-display-condition="distanceDisplayCondition"
                  :horizontal-origin="horizontalOrigin"
                ></vc-graphics-billboard>
              </vc-entity>
            </div>
          </div>
        
        </vc-viewer>
      </vc-config-provider>
      <el-switch
        v-model="modelState"
        class="model-switch"
        active-text="完整模型"
        inactive-text="地表模型"
        inactive-text-color="#fff"
        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
        @change="switchModel"
      />
      <el-switch
        v-model="alertState"
        class="alert-switch"
        active-text="预警显示"
        inactive-text="预警关闭"
        inactive-text-color="#fff"
        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
      />
      <div class="slope-info">
        <ul>
          <li v-for="item in slopeInfo" >
            <span>{{item}}</span>
          </li>
        </ul>
      </div>
      <div class="alert-info" v-show="showPopup" :style="popupStyle">
        <h2 class="alert-info-title">{{ currentAlert.alert_name }}</h2>
        <div class="alert-info-content">
          <div>病害编码：{{ currentAlert.disease?.detection_id }}</div>
          <div>预警时间：{{ currentAlert.timestamp }}</div>
          <div>预警等级：{{ currentAlert.alert_level }}</div>
          <div>预警预测：{{ currentAlert.alert_prediction }}</div>
          <div>预警描述：{{ currentAlert.description }}</div>
          <div>预警状态：{{ currentAlert.status }}</div>
        </div>
        <div class='triangle-bottom'></div>
      </div>
      <div class="disease-info">
        <modal
        v-model="showModal"
        width="500"
        :show-modal="showModal"
        @close="closeModal"
        :title="'病害点:'+markIndex"
        >
        <div>
          <el-row>
            <el-col :span="6"><div>位置：</div></el-col>
            <el-col :span="8">
              <div>X:{{ currentDisease?.marks[markIndex].lng }}</div>
              <div>Y:{{ currentDisease?.marks[markIndex].lat }}</div>
              <div>Z:{{ currentDisease?.marks[markIndex].height }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6"><div>参数：</div></el-col>
            <el-col :span="18">
              <div v-show="currentDisease?.disease_type=='settle'">
                <div id="settle" style="width: 350px; height: 200px"></div>
              </div>
              <div v-if="currentDisease?.disease_type=='crack'">
                <div v-for="param in params">
                  <div>{{ param }}</div>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6"><div>病害：</div></el-col>
            <el-col :span="8">
              <div>{{ currentDisease?.assessment }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6"><div>状态：</div></el-col>
            <el-col :span="8">
              <div>{{ currentDisease?.status }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6"><div>图片：</div></el-col>
            <el-col :span="8">
              <el-image
              style="width: 100px; height: 100px"
              :src="currentDisease?.image_url[0]" 
              :zoom-rate="1.2"
              :preview-src-list="[].concat(currentDisease?.image_url)"
              :initial-index="0"
              fit="contain"
              hide-on-click-modal
              />
            </el-col>
          </el-row>
        </div>
        </modal>
      </div>

      <div v-show="showMenu" :style="{ left: menuX + 'px', top: menuY + 'px' }" style="position: absolute; background-color: rgba(255, 255, 255, 0.7); border: 1px solid #ccc; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <ul style="list-style-type: none; padding: 0;">
          <li style="padding: 5px;"><a href="javascript:void(0);" style="text-decoration: none; color: #333;"  @click="showImages()">查看图片</a></li>
        </ul>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store";
import { onMounted } from 'vue'
import MonitorAPI, { Section } from "@/api/monitor";
import { api as viewerApi } from 'v-viewer';
import { Check, Close } from '@element-plus/icons-vue'
import * as echarts from "echarts";
defineOptions({
  name: "Dashboard",
  inheritAttrs: false,
});

const appStore = useAppStore();
const sectionId = computed(() => appStore.sectionId);
const slopeId = computed(() => appStore.slopeId);

const cesiumPath = import.meta.env.VITE_VUE_CESIUMJS_PATH
//const accesstToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YmI1OTA2ZS05MTZlLTQxY2UtYTVhNS1lNjgxNDI2MzAxM2QiLCJpZCI6NjAyOTcsImlhdCI6MTYyNDk1OTIyMX0.kplgp5oaM5gsGPjBIhqouaylpnlRQa6okGQ80UsA_78'
const accesstToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiZGNiNGNkOC0zZWE1LTQwOGItYmQ3OS01OWMyNzcyYjNkNmUiLCJpZCI6MjI5NTM5LCJpYXQiOjE3MjE0NDI0MDJ9.GJE4ov7XP4jLXGP7oty3NELqaFp7mEbTZzvkgYPkhCc'
const image = './images/mark.png'
const viewerRef = ref<HTMLElement>(null)
const distanceDisplayCondition = { near: 0, far: 20000000 }
const horizontalOrigin = 0

var g_Cesium = null;
var g_viewer = null;
var g_slope = null;
var groundTileset = null;
var slopeTileset = null;
var imageList = [];
const scale = ref(1)
const show = ref(true)
const entity = ref(null)
const billboard = ref(null)
const modelState = ref(true)
const alertState = ref(false)
const slopeInfo = ref<string>([])
const alertInfo = ref([])
const currentAlert = ref({})
const currentDisease = ref(null)
const markIndex = ref(0)
const params = ref([])

const chart: Ref<echarts.ECharts | null> = ref(null);
var chartOption = {
  title: {
    text: '沉降偏移值'
  },
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: ['四月', '五月', '六月', '七月']
  },
  yAxis: {
    type: 'value',
  },
  series: [{
    data: [15.188,15.201,15.215,15.228],
    type: 'line'
  }]
};

const currentPos = {}

const showModal = ref(false)
const showPopup = ref(false)
const showMenu = ref(false)
const menuX = ref(0);
const menuY = ref(0);
const popupStyle = ref({position: 'absolute', top: '100px',left: '100px',})

// methods
const closeModal = e => {
  showModal.value = false;
}

onMounted(() => {
  //console.log('onMounted')
  MonitorAPI.getMonitorData()
    .then((data) => {
      data.forEach(section => {
        if(section.section_id == sectionId.value) {
          section.slopes.forEach(slope => {
            if(slope.slope_id == slopeId.value) {
              g_slope = slope.milepost;
              slopeInfo.value.push("监测地点：" + section.section_name + slope.milepost);
              slopeInfo.value.push(slope.description);
              slopeInfo.value.push("监测内容：" + slope.slope_type);
              slopeInfo.value.push("预警数量：" + slope.alerts.length);
              alertInfo.value = slope.alerts;
              //console.log(alertInfo.value)

              var path = '/' + g_slope + '/survey/image_list.json'
              fetch(path)
              .then(response => response.json())
              .then(data => {
                imageList = [].concat(data);
              })
              .catch(error => {
                console.error('Error fetching JSON data:', error);
              });
            }
          })
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });

  chart.value = markRaw(
    echarts.init(document.getElementById("settle"))
  );
})

const pickEntityMarkEvt = e => {
  //console.log(e.cesiumObject.id)
  var ids = e.cesiumObject.id.split("|")
  const index = alertInfo._rawValue.findIndex(item => item.alert_id === parseInt(ids[0]))
  if(index > -1) {
    currentDisease.value = alertInfo._rawValue[index].disease
    params.value = alertInfo._rawValue[index].disease.description.split('\n')
    const heights = alertInfo._rawValue[index].disease.heights
    if(heights) {
      const hts = heights[parseInt(ids[1])]
      chartOption.series[0].data=[0, (hts[1]-hts[0]).toFixed(5), (hts[2]-hts[0]).toFixed(5), (hts[3]-hts[0]).toFixed(5)]
      chart.value.setOption(chartOption);
    }
    showModal.value = true;
  }
  markIndex.value = parseInt(ids[1])
  showPopup.value = false
}

const onEntityAlertEvt = e => {
  //console.log(e)
  if (e.type === 'onmouseover') {
    const index = alertInfo._rawValue.findIndex(item => item.alert_id === parseInt(e.cesiumObject.id))
    if(index > -1) {
      currentAlert.value = alertInfo._rawValue[index]
      const location = alertInfo._rawValue[index].location
      const earthPosition = Cesium.Cartesian3.fromDegrees(location.lng, location.lat, location.height)
      const windowPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(g_viewer.scene, earthPosition);
      if (windowPosition) {
        let position = { top: windowPosition.y - 220 + 'px', left: windowPosition.x - 250 / 2 + 'px' }
        popupStyle.value = Object.assign(popupStyle.value, position)
        showPopup.value = true
      }
    }
  } else if (e.type === 'onmouseout') {
    showPopup.value = false
  }
}

const onEntityMarkEvt = e => {
  if (e.type === 'onmouseover') {
    scale.value = 1.25
  } else if (e.type === 'onmouseout') {
    scale.value = 1
  }
}

const switchModel = () => {
  groundTileset.show = !modelState.value
  slopeTileset.show = modelState.value
}

const showImages = () => {
  var imagesList=[]
  imageList.forEach(image => {
    if(Math.abs(image.gps.lng - currentPos.lng) < 0.0004 && Math.abs(image.gps.lat - currentPos.lat) < 0.0004) {
      imagesList.push('/' + g_slope +'/survey/'+ image.id + '.JPG')
    }
  })
  viewerApi({
    images:imagesList
  })
}

const hideMenu = () => {
  showMenu.value = false;
};

const onViewerReady = async({Cesium, viewer}) => {
  console.log(Cesium.VERSION);
  g_Cesium = Cesium;
  g_viewer = viewer;
  
  viewer._cesiumWidget._creditContainer.style.display = "none";
  viewer.scene.screenSpaceCameraController.tiltEventTypes = [Cesium.CameraEventType.LEFT_DRAG];
  viewer.scene.screenSpaceCameraController.zoomEventTypes = [Cesium.CameraEventType.MIDDLE_DRAG, Cesium.CameraEventType.WHEEL, Cesium.CameraEventType.PINCH];
  viewer.scene.screenSpaceCameraController.rotateEventTypes = [Cesium.CameraEventType.RIGHT_DRAG];

  viewer.scene.primitives.removeAll();

  groundTileset = await Cesium.Cesium3DTileset.fromIonAssetId(2670980);
  viewer.scene.primitives.add(groundTileset);
  groundTileset.show = !modelState.value;

  //加载倾斜模型数据
  var url = "./" + g_slope + "/terra/tileset.json"
  slopeTileset = await Cesium.Cesium3DTileset.fromUrl(
    url, {
    //控制切片视角显示的数量，可调整性能
    maximumScreenSpaceError: 2,
    maximumNumberOfLoadedTiles: 100000,
  });
  viewer.scene.primitives.add(slopeTileset);
  //slopeTileset.show = false;
  //控制模型的位置

  //获取3Dtlies的bounds范围
  var boundingSphere = slopeTileset.boundingSphere;
  viewer.camera.viewBoundingSphere(boundingSphere, new Cesium.HeadingPitchRange(0.0, -0.5, boundingSphere.radius * 1.5));
  viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);

  viewer.screenSpaceEventHandler.setInputAction(function onRightClick(movement) {
    var position = viewer.scene.pickPosition(movement.position)
    if(position) {
      //console.log("获取到的坐标：", position);
      const winPos = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, position);
      if (winPos) {
        showMenu.value = true;
        menuX.value = winPos.x;
        menuY.value = winPos.y;
        // 将世界坐标转换为经纬度
        var cartographic = Cesium.Cartographic.fromCartesian(position, viewer.scene.globe.ellipsoid);
        currentPos.lng = Cesium.Math.toDegrees(cartographic.longitude);
        currentPos.lat = Cesium.Math.toDegrees(cartographic.latitude);
        currentPos.height = cartographic.height;
        // 输出经纬度
        console.log('经度: ' + currentPos.lng + ', 纬度: ' + currentPos.lat+ ', 高度: ' + currentPos.height);
      }
    }
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });
  document.addEventListener('click', hideMenu);
}
</script>
<style lang="scss" scoped>
.el-row {
  margin-bottom: 10px;
}
.slope-viewer {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
}

.model-switch{
  position: absolute;
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center;
  top: 20px;
  left: 50%;
}
.alert-switch{
  position: absolute;
  top: 50px;
  left: 50%;
}
.slope-info {
  position: absolute;
  top: 20px;
  left: 20px;
  color: #e2dede;
}
.disease-info {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #7fd3cad9;
}

.alert-info {
  z-index: 1000;
  width: 250px;
  height: 180px;
  border: 2px solid #ffffff;
  border-radius: 4px;
  box-shadow: 0px 0px 2px grey;
  position: absolute;
  background-color: #7fd3cad9;

  .alert-info-title {
    text-align: center;
    font-size: 18px;
    margin: 0px;
    height: 25px;
  }

  .alert-info-content {
    margin: 0px 10px;
    height: 75px;
  }

  .triangle-bottom {
    width: 0;
    height: 0;
    border-top: 10px solid #ffffff;
    border-left: 10px dashed transparent;
    border-right: 10px dashed transparent;
    position: absolute;
    left: 115px;
    top: 180px;
  }
}

.image-list {
	display: grid;
	grid-row-gap: v-bind(rowGap);
	grid-template-columns: repeat(auto-fill, v-bind(width));
	justify-content: space-between;
	.image-style {
		width: v-bind(width);
		height: v-bind(height);
		border-radius: v-bind(borderRadius);
	}
}
</style>
