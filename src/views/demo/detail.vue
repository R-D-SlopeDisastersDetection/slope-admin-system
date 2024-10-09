<template>
  <div>
    <div class="slope-viewer">
      <vc-config-provider :cesium-path="cesiumPath" :access-token="accessToken">
        <vc-viewer
          ref="viewerRef"
          :info-box="false"
          :fullscreen-button="true"
          :navigationHelpButton="true"
          fullscreen-element="document.body"
          :showCredit="false"
          :selectionIndicator="true"
          @ready="onViewerReady"
        >
          <!-- <vc-terrain-provider-cesium ref="provider" />
        <vc-layer-imagery>
          <vc-imagery-provider-bing bm-key="AmGu3cvB_g1HbkQErEyvmLc9j0YIGWS7IdOqR7-hQbO8J92Fzrzkhy_bYKSsyoEx" />
        </vc-layer-imagery> -->

          <!-- 地面模型 -->
          <vc-primitive-tileset
            ref="groundTileset"
            :assetId="currentAlert.disease.asset_id_point_cloud"
            @ready="onGroundTilesetReady"
            :show="showModel"
            :maximumScreenSpaceError="2"
            :pointCloudShading="{ attenuation: true, maximumAttenuation: 2 }"
          />

          <!-- 地面模型 -->
          <vc-primitive-tileset
            :assetId="currentAlert.disease.asset_id_point_cloud_detect"
            :show="showDetect"
            @ready="onGroundTilesetReady"
            :maximumScreenSpaceError="2"
            :pointCloudShading="{ attenuation: true, maximumAttenuation: 2 }"
          />
        </vc-viewer>
      </vc-config-provider>
    </div>

    <!-- 工具栏 -->
    <div class="viewer-toolbar">
      <el-space direction="horizontal" :size="16">
        <el-button type="primary" @click="back">返回</el-button>
        <!-- <el-select v-model="currentAlert.timestamp" placeholder="请选择模型日期" style="width: 200px">
          <el-option :label="currentAlert.timestamp" :value="currentAlert.timestamp" />
        </el-select> -->
        <div>
          <span>显示缺陷 </span>
          <el-switch
            v-model="showDetect"
            style="

              --el-switch-on-color: #13ce66;
              --el-switch-off-color: #ff4949;
            "
          />
        </div>
        <div>
          <span>显示模型 </span>
          <el-switch
            v-model="showModel"
            style="

              --el-switch-on-color: #13ce66;
              --el-switch-off-color: #ff4949;
            "
          />
        </div>
      </el-space>
    </div>

    <!-- 预警信息 -->
    <div class="alert-info">
      <h3>{{ currentAlert.alert_name }}</h3>
      <ul>
        <li>
          <span>预警编号：{{ currentAlert.disease?.detection_id }}</span>
        </li>
        <li>
          <span>预警时间：{{ currentAlert.timestamp }}</span>
        </li>
        <li>
          <span>预警等级：{{ currentAlert.alert_level }}</span>
        </li>
        <li>
          <span>预测概率：{{ currentAlert.alert_prediction }}</span>
        </li>
        <li>
          <span>预警描述：{{ currentAlert.description }}</span>
        </li>
        <li>
          <span>预警状态：{{ currentAlert.status }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import router from "@/router";
import { useAppStore } from "@/store";
import MonitorAPI from "@/api/monitor";

const cesiumPath = import.meta.env.VITE_VUE_CESIUMJS_PATH;
//const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YmI1OTA2ZS05MTZlLTQxY2UtYTVhNS1lNjgxNDI2MzAxM2QiLCJpZCI6NjAyOTcsImlhdCI6MTYyNDk1OTIyMX0.kplgp5oaM5gsGPjBIhqouaylpnlRQa6okGQ80UsA_78'
const accessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmNzM0NjJhNi0wNDNhLTQ2NWYtYjM1ZC0xOThjMGUxNDdiNjIiLCJpZCI6MjM0NjcyLCJpYXQiOjE3MjM2MTY4NDJ9.q3bfwOGOUoxUrJwFKwaOJsNNQ-JbIPuzAkakY_BbFgY";
const viewerRef = ref(null);
var g_Cesium = null;
var g_viewer = null;
var groundTileset = ref(null);

const appStore = useAppStore();
const sectionId = computed(() => appStore.sectionId);
const slopeId = computed(() => appStore.slopeId);
const alertId = computed(() => appStore.alertId);
const currentAlert = ref({
  alert_id: -1,
  alert_name: "",
  timestamp: "",
  slope_id: -1,
  alert_level: "低",
  alert_prediction: "",
  location: { lng: 0, lat: 0, height: 0 },
  description: "",
  status: "未处理",
  disease: {
    detection_id: -1,
    flight_id: -1,
    slope_id: -1,
    asset_id_point_cloud: -1,
    asset_id_point_cloud_detect: -1,
    discovery_date: "",
    image_url: [],
    disease_type: "crack",
    severity: "low",
    area: [],
    marks: [],
    description: "",
    assessment: "",
    status: "未处理",
  },
});

const showDetect = ref(true);
const showModel = ref(true);

onMounted(() => {
  //console.log(alertId.value);
  MonitorAPI.getMonitorData()
    .then((data) => {
      data.forEach((section) => {
        if (section.section_id == sectionId.value) {
          section.slopes.forEach((slope) => {
            if (slope.slope_id == slopeId.value) {
              slope.alerts.forEach((alert) => {
                if (alert.alert_id == alertId.value) {
                  currentAlert.value = alert;
                }
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

const onViewerReady = async ({ Cesium, viewer }) => {
  // console.log("Cesium Version:", Cesium.VERSION);
  g_Cesium = Cesium;
  g_viewer = viewer;

  // 隐藏地球，仅显示点云
  viewer.scene.sun.show = false;
  viewer.scene.moon.show = false;
  viewer.scene.skyBox.show = false;
  viewer.scene.undergroundMode = true; //重要，开启地下模式，设置基色透明，这样就看不见黑色地球了
  viewer.scene.globe.show = false; //不显示地球，这条和地球透明度选一个就可以
  viewer.scene.globe.baseColor = new Cesium.Color(0, 0, 0, 0);
  viewer.scene.backgroundcolor = new Cesium.Color(0, 0, 0, 0);
};

const onGroundTilesetReady = ({ cesiumObject: tileset, viewer }) => {
  const cartographic = Cesium.Cartographic.fromCartesian(
    tileset.boundingSphere.center
  );
  const surface = Cesium.Cartesian3.fromRadians(
    cartographic.longitude,
    cartographic.latitude,
    cartographic.height
  );
  const offset = Cesium.Cartesian3.fromRadians(
    cartographic.longitude,
    cartographic.latitude,
    0
  );
  const translation = Cesium.Cartesian3.subtract(
    offset,
    surface,
    new Cesium.Cartesian3()
  );
  tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
  viewer.zoomTo(tileset);
};

const back = () => {
  router.replace("/redirect/slope/model");
};
</script>

<style lang="scss" scoped>
.slope-viewer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.viewer-toolbar {
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 10px;
  color: #e2dede;
  // background: rgb(0 0 0 / 20%);
  // border-radius: 25px;
}

.alert-info {
  position: absolute;
  bottom: 20px;
  left: 20px;
  // padding: 10px;

  color: #e2dede;
  // background: rgba(0, 0, 0, 0.2);
  // border-radius: 25px 25px 25px 25px;
}
</style>
