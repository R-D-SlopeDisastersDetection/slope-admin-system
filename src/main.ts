import { createApp } from "vue";
import App from "./App.vue";
import setupPlugins from "@/plugins";
import BaiduMap from 'vue-baidu-map-3x';
import VueCesium from 'vue-cesium';
import VueViewer from 'v-viewer'

// 本地SVG图标
import "virtual:svg-icons-register";

// 样式
import "element-plus/theme-chalk/dark/css-vars.css";
import 'viewerjs/dist/viewer.css'
import 'vue-cesium/dist/index.css'
import "@/styles/index.scss";
import "uno.css";
import "animate.css";

//import { Ion } from 'cesium'
//Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YmI1OTA2ZS05MTZlLTQxY2UtYTVhNS1lNjgxNDI2MzAxM2QiLCJpZCI6NjAyOTcsImlhdCI6MTYyNDk1OTIyMX0.kplgp5oaM5gsGPjBIhqouaylpnlRQa6okGQ80UsA_78'
//Ion.defaultAccessToken  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiZGNiNGNkOC0zZWE1LTQwOGItYmQ3OS01OWMyNzcyYjNkNmUiLCJpZCI6MjI5NTM5LCJpYXQiOjE3MjE0NDI0MDJ9.GJE4ov7XP4jLXGP7oty3NELqaFp7mEbTZzvkgYPkhCc'
const app = createApp(App);
app.use(BaiduMap, {
  ak: 'a1LpAFzHFpc0QcVd82Bbpq5ztuU0Gzgg',
  // v:'2.0',  // 默认使用3.0
  // type: 'WebGL' // ||API 默认API  (使用此模式 BMap=BMapGL)
});
app.use(VueViewer);
app.use(VueCesium);
app.use(setupPlugins);
app.mount("#app");
