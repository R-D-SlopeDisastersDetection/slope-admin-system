<template>
  <div class="app-container">
    <div id="slope-viewer" class="slope-viewer">
      <vc-config-provider :cesium-path="cesiumPath" :access-token="accesstToken">
        <vc-viewer ref="viewerRef" :info-box="false" :fullscreen-button="true" :navigationHelpButton="true"
          fullscreen-element="document.body" :showCredit="false" :selectionIndicator="true" @ready="onViewerReady">
          <vc-terrain-provider-cesium ref="provider"></vc-terrain-provider-cesium>
          <vc-layer-imagery>
            <vc-imagery-provider-bing
              bm-key="AmGu3cvB_g1HbkQErEyvmLc9j0YIGWS7IdOqR7-hQbO8J92Fzrzkhy_bYKSsyoEx"></vc-imagery-provider-bing>
          </vc-layer-imagery>

          <!-- 地面模型 -->
          <vc-primitive-tileset ref="groundTileset" :assetId="2670980" :show="!modelState"
            :maximumScreenSpaceError="128">
          </vc-primitive-tileset>

          <!-- 倾斜模型 -->
          <vc-primitive-tileset ref="slopeTileset" :url="'./' + g_slope + '/terra/tileset.json'" :show="modelState"
            @ready="onSlopeTilesetReady" :maximumScreenSpaceError="2">
          </vc-primitive-tileset>

          <!-- 预警实体 -->
          <div v-for="alert in alertInfo">
            <vc-entity :id="alert.alert_id.toString()" :name="alert.alert_name" :show="alertState"
              @dblclick="pickEntityAlertEvt" @mouseover="onEntityAlertEvt" @mouseout="onEntityAlertEvt">
              <vc-graphics-polygon :hierarchy="alert.disease.area" :material="[255, 255, 0, 125]" :extrudedHeight="0"
                :perPositionHeight="true" :outline="true" outlineColor="black"></vc-graphics-polygon>
            </vc-entity>
            <!-- 灾害标记实体 -->
            <div v-for="(mark, index) in alert.disease.marks">
              <vc-entity :position="mark" :id="alert.alert_id.toString() + '|' + index" :name="alert.alert_name"
                :show="alertState" @click="pickEntityMarkEvt" @mouseover="onEntityMarkEvt" @mouseout="onEntityMarkEvt">
                <vc-graphics-billboard :image="image" :scale="scale"
                  :distance-display-condition="distanceDisplayCondition" :horizontal-origin="0"
                  :verticalOrigin="1"></vc-graphics-billboard>
              </vc-entity>
            </div>
          </div>

          <!-- 划定要新增的预警区域 -->
          <div>
            <vc-entity>
              <vc-graphics-polygon :hierarchy="newAlertForm.disease.area" :material="[0, 255, 255, 125]"
                :extrudedHeight="0" :perPositionHeight="true" :outline="true"
                outlineColor="black"></vc-graphics-polygon>
            </vc-entity>
            <div v-for="mark in newAlertForm.disease.area">
              <vc-entity :position="mark">
                <vc-graphics-billboard :image="image" :scale="scale" color="blue"
                  :distance-display-condition="distanceDisplayCondition" :verticalOrigin="1"
                  :horizontal-origin="0"></vc-graphics-billboard>
              </vc-entity>
            </div>
          </div>
        </vc-viewer>
      </vc-config-provider>

      <!-- 工具栏 -->
      <el-space class="viewer-toolbar" :size="8" direction="vertical" alignment="flex-start">
        <el-space :size="12" direction="horizontal">
          <div>
            <el-button type="danger" round @click="viewerRef.reload()">重载</el-button>
          </div>
          <div>
            <span>模型 </span>
            <el-switch v-model="modelState" style="--el-switch-on-color: #13ce66;--el-switch-off-color: #ff4949;" />
          </div>
          <div>
            <span>预警 </span>
            <el-switch v-model="alertState" style="--el-switch-on-color: #13ce66;--el-switch-off-color: #ff4949;" />
          </div>
        </el-space>
      </el-space>

      <!-- 当前滑坡信息 -->
      <div class="slope-info">
        <ul>
          <li>
            <span>监测地点：{{ slopeInfo.slope_name }}</span>
          </li>
          <li>
            <span>{{ slopeInfo.description }}</span>
          </li>
          <li>
            <span>监测内容：{{ slopeInfo.slope_type }}</span>
          </li>
          <li>
            <span>预警数量：{{ slopeInfo.alert_length }}</span>
          </li>
        </ul>
      </div>

      <!-- 当前鼠标所在预警区域的信息 -->
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
        <div class="triangle-bottom"></div>
      </div>

      <!-- 选中的预警信息 -->
      <el-dialog v-model="showAlertDialog" style="position: absolute; right: 20px" top="70px"
        :title="currentAlert.alert_name" width="500" :draggable="true" :modal="false">

        <el-form :model="currentAlert" label-position="left" label-width="auto">
          <el-form-item label="病害编码:">
            <el-input v-model="currentAlert.alert_id" :readonly="true" :disabled="true" />
          </el-form-item>
          <el-form-item label="病害名称:" placeholder="请输入病害名称">
            <el-input v-model="currentAlert.alert_name" />
          </el-form-item>
          <el-form-item label="预警时间:">
            <el-date-picker v-model="currentAlert.timestamp" type="date" placeholder="请选择预警时间" :readonly="true"
              :disabled="true" :clearable="false" />
          </el-form-item>
          <el-form-item label="预警等级:">
            <el-select v-model="currentAlert.alert_level" placeholder="请选择预警等级">
              <el-option label="低" value="低" />
              <el-option label="中" value="中" />
              <el-option label="高" value="高" />
            </el-select>
          </el-form-item>
          <el-form-item label="预警预测:">
            <el-input v-model="currentAlert.alert_prediction" :readonly="true" :disabled="true" />
          </el-form-item>
          <el-form-item label="预警描述:" placeholder="请输入预警描述">
            <el-input v-model="currentAlert.description" />
          </el-form-item>
          <el-form-item label="预警状态:">
            <el-select v-model="currentAlert.status" placeholder="请选择预警状态">
              <el-option label="未处理" value="未处理" />
              <el-option label="处理中" value="处理中" />
              <el-option label="已处理" value="已处理" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="changeAlert()">变更</el-button>
            <el-button type="danger" @click="deleteAlert()">
              删除
            </el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 选中的灾害点的信息 -->
      <el-dialog v-model="showDiseaseDialog" style="position: absolute; right: 20px" top="70px"
        :title="'病害点:' + markIndex" width="500" :draggable="true" :modal="false" @open="diseaseDialogOpen()">
        <div>
          <el-row style="margin-bottom: 16px;">
            <el-col :span="4">
              <div>位置：</div>
            </el-col>
            <el-col :span="20">
              <div>经度:{{ currentDisease?.marks[markIndex]?.lng }}</div>
              <div>纬度:{{ currentDisease?.marks[markIndex]?.lat }}</div>
              <div>高度:{{ currentDisease?.marks[markIndex]?.height }}</div>
            </el-col>
          </el-row>
          <el-row style="margin-bottom: 16px;">
            <el-col :span="4">
              <div>参数：</div>
            </el-col>
            <el-col :span="20">
              <div v-show="currentDisease?.disease_type == 'settle'">
                <div id="settle" style="width: 350px; height: 200px"></div>
              </div>
              <div v-if="currentDisease?.disease_type == 'crack'">
                <div v-for="param in params">
                  <div>{{ param }}</div>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row style="margin-bottom: 16px;">
            <el-col :span="4">
              <div>病害：</div>
            </el-col>
            <el-col :span="20">
              <el-input v-model="currentDisease.assessment" />
            </el-col>
          </el-row>
          <el-row style="margin-bottom: 16px;">
            <el-col :span="4">
              <div>状态：</div>
            </el-col>
            <el-col :span="20">
              <el-select v-model="currentDisease.status" placeholder="请选择状态">
                <el-option label="未处理" value="未处理" />
                <el-option label="处理中" value="处理中" />
                <el-option label="已处理" value="已处理" />
              </el-select>
            </el-col>
          </el-row>
          <el-row style="margin-bottom: 16px;">
            <el-col :span="4">
              <div>图片：</div>
            </el-col>
            <el-col :span="20">
              <el-image style="width: 100px; height: 100px" :src="currentDisease?.image_url[0]" :zoom-rate="1.2"
                :preview-src-list="[].concat(currentDisease?.image_url)" :initial-index="0" fit="contain"
                hide-on-click-modal />
            </el-col>
          </el-row>
        </div>

        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="changeMark()">变更</el-button>
            <el-button type="danger" @click="deleteMark()">
              删除
            </el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 右键菜单 -->
      <div v-show="showMenu" :style="{ left: menuX + 'px', top: menuY + 'px' }" style="
          position: absolute;
          background-color: rgba(255, 255, 255, 0.7);
          border: 1px solid #ccc;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        ">
        <ul style="list-style-type: none; padding: 0">
          <li style="padding: 5px">
            <a href="javascript:void(0);" style="text-decoration: none; color: #333" @click="showImages()">查看图片</a>
          </li>
          <li style="padding: 5px">
            <a href="javascript:void(0);" style="text-decoration: none; color: #333"
              @click="setAlertPolygon()">标定预警区域</a>
          </li>
          <li style="padding: 5px">
            <a href="javascript:void(0);" style="text-decoration: none; color: #333"
              @click="reSetAlertPolygon()">重置预警区域</a>
          </li>
          <li style="padding: 5px">
            <a href="javascript:void(0);" style="text-decoration: none; color: #333" @click="newAlert()">新增预警</a>
          </li>
          <li style="padding: 5px">
            <a href="javascript:void(0);" style="text-decoration: none; color: #333" @click="newMark()">新增灾害点</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store";
import { onMounted, nextTick } from "vue";
import MonitorAPI, { Section } from "@/api/monitor";
import { api as viewerApi } from "v-viewer";
import { Check, Close } from "@element-plus/icons-vue";
import * as echarts from "echarts";
defineOptions({
  name: "Dashboard",
  inheritAttrs: false,
});

const appStore = useAppStore();
const sectionId = computed(() => appStore.sectionId);
const slopeId = computed(() => appStore.slopeId);

const cesiumPath = import.meta.env.VITE_VUE_CESIUMJS_PATH;
//const accesstToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YmI1OTA2ZS05MTZlLTQxY2UtYTVhNS1lNjgxNDI2MzAxM2QiLCJpZCI6NjAyOTcsImlhdCI6MTYyNDk1OTIyMX0.kplgp5oaM5gsGPjBIhqouaylpnlRQa6okGQ80UsA_78'
const accesstToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiZGNiNGNkOC0zZWE1LTQwOGItYmQ3OS01OWMyNzcyYjNkNmUiLCJpZCI6MjI5NTM5LCJpYXQiOjE3MjE0NDI0MDJ9.GJE4ov7XP4jLXGP7oty3NELqaFp7mEbTZzvkgYPkhCc";
const image = "./images/mark.png";
const viewerRef = ref(null);
const distanceDisplayCondition = { near: 0, far: 20000000 };

var g_Cesium = null;
var g_viewer = null;
var g_slope = null;
var groundTileset = ref(null);
var slopeTileset = ref(null);
var imageList = [];
const scale = ref(1.25);
const modelState = ref(true);
const alertState = ref(true);
const slopeInfo = ref({
  slope_name: "",
  location: {
    lng: 0,
    lat: 0
  },
  description: "",
  slope_type: "",
  alert_length: 0
});
const alertInfo = ref([]);
const currentAlert = ref({});
const currentDisease = ref(null);
const markIndex = ref(0);
const params = ref([]);

const chart: Ref<echarts.ECharts | null> = ref(null);
var chartOption = {
  title: {
    text: "沉降偏移值",
  },
  tooltip: {
    trigger: "axis",
  },
  xAxis: {
    type: "category",
    data: ["四月", "五月", "六月", "七月"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      data: [15.188, 15.201, 15.215, 15.228],
      type: "line",
    },
  ],
};

const currentPos = {};

const showDiseaseDialog = ref(false);
const showPopup = ref(false);
const showMenu = ref(false);
const showAlertDialog = ref(false);
const menuX = ref(0);
const menuY = ref(0);
const popupStyle = ref({ position: "absolute", top: "100px", left: "100px" });

const newAlertForm = ref({
  disease: {
    area: [],
  },
});

onMounted(() => {
  //console.log('onMounted')
  MonitorAPI.getMonitorData()
    .then((data) => {
      data.forEach((section) => {
        if (section.section_id == sectionId.value) {
          section.slopes.forEach((slope) => {
            if (slope.slope_id == slopeId.value) {
              g_slope = slope.milepost;
              slopeInfo.value.slope_name = section.section_name + slope.milepost;
              slopeInfo.value.location = slope.location;
              slopeInfo.value.slope_type = slope.slope_type;
              slopeInfo.value.alert_length = slope.alerts.length;
              slopeInfo.value.description = slope.description;

              alertInfo.value = slope.alerts;
              //console.log(alertInfo.value)

              var path = "/" + g_slope + "/survey/image_list.json";
              fetch(path)
                .then((response) => response.json())
                .then((data) => {
                  imageList = [].concat(data);
                })
                .catch((error) => {
                  console.error("Error fetching JSON data:", error);
                  ElNotification({
                    title: 'Error',
                    message: '图片加载失败',
                    type: 'error',
                    offset: 50,
                  });
                });
            }
          });
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

const pickEntityAlertEvt = (e) => {
  // console.log(e.cesiumObject.id);
  showAlertDialog.value = true;
  showPopup.value = false;
};

const pickEntityMarkEvt = (e) => {
  //console.log(e.cesiumObject.id)
  var ids = e.cesiumObject.id.split("|");
  const index = alertInfo.value.findIndex(
    (item) => item.alert_id === parseInt(ids[0])
  );
  if (index > -1) {
    currentDisease.value = alertInfo.value[index].disease;
    // 打开后会触发diseaseDialogOpen事件
    showDiseaseDialog.value = true;
  }
  markIndex.value = parseInt(ids[1]);
  showPopup.value = false;
};

const diseaseDialogOpen = () => {
  // el-dialog是延迟创建的，因此dialog里面的图表也需要延迟初始化
  if (chart.value == null) {
    if (document.getElementById("settle")) {
      chart.value = markRaw(echarts.init(document.getElementById("settle")));
    }
  }

  // 更新图表
  params.value = currentDisease.value.description.split("\n");
  const heights = currentDisease.value.heights;
  if (heights) {
    if (chart.value != null) {
      const hts = heights[parseInt(markIndex.value)];
      chartOption.series[0].data = [
        0,
        (hts[1] - hts[0]).toFixed(5),
        (hts[2] - hts[0]).toFixed(5),
        (hts[3] - hts[0]).toFixed(5),
      ];
      chart.value.setOption(chartOption);
    }
  }
};

const onEntityAlertEvt = (e) => {
  //console.log(e)
  if (e.type === "onmouseover") {
    const index = alertInfo.value.findIndex(
      (item) => item.alert_id === parseInt(e.cesiumObject.id)
    );
    if (index > -1) {
      currentAlert.value = alertInfo.value[index];
      const location = alertInfo.value[index].location;
      const earthPosition = Cesium.Cartesian3.fromDegrees(
        location.lng,
        location.lat,
        location.height
      );
      const windowPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
        g_viewer.scene,
        earthPosition
      );
      if (windowPosition) {
        let position = {
          top: windowPosition.y - 220 + "px",
          left: windowPosition.x - 250 / 2 + "px",
        };
        popupStyle.value = Object.assign(popupStyle.value, position);
        showPopup.value = true;
      }
    }
  } else if (e.type === "onmouseout") {
    showPopup.value = false;
    currentAlert.value = {};
  }
};

const onEntityMarkEvt = (e) => {
  if (e.type === "onmouseover") {
    scale.value = 1.5;
  } else if (e.type === "onmouseout") {
    scale.value = 1.25;
  }
};

// const switchModel = () => {
//   groundTileset.show = !modelState.value;
//   slopeTileset.show = modelState.value;
// };

const showImages = () => {
  var imagesList = [];
  imageList.forEach((image) => {
    if (
      Math.abs(image.gps.lng - currentPos.lng) < 0.0004 &&
      Math.abs(image.gps.lat - currentPos.lat) < 0.0004
    ) {
      imagesList.push("/" + g_slope + "/survey/" + image.id + ".JPG");
    }
  });
  viewerApi({
    images: imagesList,
  });
};

const setAlertPolygon = () => {
  newAlertForm.value.disease.area.push([
    currentPos.lng,
    currentPos.lat,
    currentPos.height + 0.1,
  ]);
};

const reSetAlertPolygon = () => {
  newAlertForm.value.disease.area = [];
};

const newMark = () => {
  if (currentAlert.value.disease) {
    currentAlert.value.disease.marks.push({
      lng: currentPos.lng,
      lat: currentPos.lat,
      height: currentPos.height
    });
  }
};

const deleteMark = () => {
  // 调用接口

  currentDisease.value.marks.splice(markIndex.value, 1);
  if (currentDisease.value.heights) {
    currentDisease.value.heights.splice(markIndex.value, 1);
  }
  ElMessage.success('删除成功');
  showDiseaseDialog.value = false;
}

const changeMark = () => {
  // 调用接口

  ElMessage.success('变更成功');
  showDiseaseDialog.value = false;
}

const newAlert = () => {
  const al = {
    alert_id: Date.now(),
    alert_name: "",
    timestamp: Date.now(),
    slope_id: 5,
    alert_level: "低",
    alert_prediction: "70%",
    location: currentPos,
    description: "",
    status: "未处理",
    disease: {
      detection_id: Date.now(),
      flight_id: 7,
      slope_id: 5,
      discovery_date: Date.now(),
      image_url: [],
      disease_type: "crack",
      severity: "low",
      area: newAlertForm.value.disease.area,
      marks: [],
      description: "裂缝长度(m) 3 \n裂缝宽度(m) 3 \n裂缝深度(m) 0.5",
      assessment: "",
      status: "未处理",
    },
  };
  alertInfo.value.push(al);
  // console.log(al);
  newAlertForm.value.disease.area = [];
};

const deleteAlert = () => {
  // 调用接口

  const index = alertInfo.value.findIndex(
    (item) => item.alert_id === currentAlert.value.alert_id
  );
  alertInfo.value.splice(index, 1)
  ElMessage.success('删除成功');
  showAlertDialog.value = false;
}

const changeAlert = () => {
  // 调用接口

  ElMessage.success('变更成功');
  showAlertDialog.value = false;
}

const hideMenu = () => {
  showMenu.value = false;
};


const onViewerReady = async ({ Cesium, viewer }) => {
  console.log(Cesium.VERSION);
  g_Cesium = Cesium;
  g_viewer = viewer;

  // 设置拖拽方式：
  // viewer.scene.screenSpaceCameraController.tiltEventTypes = [Cesium.CameraEventType.LEFT_DRAG];
  // viewer.scene.screenSpaceCameraController.zoomEventTypes = [Cesium.CameraEventType.MIDDLE_DRAG, Cesium.CameraEventType.WHEEL, Cesium.CameraEventType.PINCH];
  // viewer.scene.screenSpaceCameraController.rotateEventTypes = [Cesium.CameraEventType.RIGHT_DRAG];

  // viewer.scene.primitives.removeAll();

  //加载地面模型数据
  // groundTileset = await Cesium.Cesium3DTileset.fromIonAssetId(2670980);
  // viewer.scene.primitives.add(groundTileset);
  // groundTileset.show = !modelState.value;

  //加载倾斜模型数据
  // var url = "./" + g_slope + "/terra/tileset.json";
  // slopeTileset = await Cesium.Cesium3DTileset.fromUrl(url, {
  //   //控制切片视角显示的数量，可调整性能
  //   maximumScreenSpaceError: 2,
  //   maximumNumberOfLoadedTiles: 100000,
  // });
  // viewer.scene.primitives.add(slopeTileset);
  // slopeTileset.show = false;
  //控制模型的位置

  //获取3Dtlies的bounds范围，然后移动相机
  // var boundingSphere = slopeTileset.boundingSphere;
  // viewer.camera.viewBoundingSphere(
  //   boundingSphere,
  //   new Cesium.HeadingPitchRange(0.0, -0.5, boundingSphere.radius * 1.5)
  // );
  // viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);


  // 获取加载请求对象，处理滑坡模型加载失败的情况
  slopeTileset.value.creatingPromise.catch((err) => {
    ElNotification({
      title: 'Error',
      message: '模型加载失败',
      type: 'error',
      offset: 50,
    });
  })



  viewer.screenSpaceEventHandler.setInputAction(function onRightClick(
    movement
  ) {
    var position = viewer.scene.pickPosition(movement.position);
    if (position) {
      //console.log("获取到的坐标：", position);
      const winPos = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
        viewer.scene,
        position
      );
      if (winPos) {
        showMenu.value = true;
        menuX.value = winPos.x;
        menuY.value = winPos.y;
        // 将世界坐标转换为经纬度
        var cartographic = Cesium.Cartographic.fromCartesian(
          position,
          viewer.scene.globe.ellipsoid
        );
        currentPos.lng = Cesium.Math.toDegrees(cartographic.longitude);
        currentPos.lat = Cesium.Math.toDegrees(cartographic.latitude);
        currentPos.height = cartographic.height;
        // 输出经纬度
        // console.log('经度: ' + currentPos.lng + ', 纬度: ' + currentPos.lat + ', 高度: ' + currentPos.height);
      }
    }
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });
  document.addEventListener("click", hideMenu);
};

const onSlopeTilesetReady = ({ cesiumObject: tileset, viewer }) => {
  // 获取3Dtlies的bounds范围，然后移动相机至模型
  var boundingSphere = tileset.boundingSphere;
  viewer.camera.viewBoundingSphere(
    boundingSphere,
    g_Cesium.HeadingPitchRange(0.0, -0.5, boundingSphere.radius * 1.5)
  );
  viewer.camera.lookAtTransform(g_Cesium.Matrix4.IDENTITY);
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

// .model-switch {
//   position: absolute;
//   display: flex;
//   align-items: center;
//   /* 垂直居中 */
//   justify-content: center;
//   top: 20px;
//   left: 50%;
// }

// .alert-switch {
//   position: absolute;

//   top: 50px;
//   left: 50%;
// }

.viewer-toolbar {
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 10px;

  color: #e2dede;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 25px 25px 25px 25px;
}

.slope-info {
  position: absolute;
  bottom: 20px;
  left: 20px;
  // padding: 10px;

  color: #e2dede;
  // background: rgba(0, 0, 0, 0.2);
  // border-radius: 25px 25px 25px 25px;
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
