<template>
  <div style="width: 100%; height: 100%">
    <el-scrollbar>
      <!-- <el-image
        v-for="(url, index) in imageUrls"
        :key="index"
        style="width: 25%; height: 25%"
        :src="url"
        :initial-index="index"
        :preview-src-list="imageUrls"
        fit="fill"
        hide-on-click-modal
        lazy
      /> -->

      <div style="padding: 8px">
        <el-upload
          v-model:file-list="fileList"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          list-type="picture"
        >
          <el-button type="primary">上传实景图片</el-button>
          <template #tip>
            <div class="el-upload__tip">jpg/png file</div>
          </template>
        </el-upload>
      </div>
    </el-scrollbar>
    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAppStore } from "@/store";
import MonitorAPI from "@/api/monitor";

const appStore = useAppStore();
const sectionId = computed(() => appStore.sectionId);
const slopeId = computed(() => appStore.slopeId);

// const imageUrls = ref([
//   "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
//   "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg",
//   "https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg",
//   "https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg",
//   "https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg",
//   "https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg",
//   "https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg",
// ]);

const fileList = ref([
  {
    name: "food.jpeg",
    url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
  },
  {
    name: "food2.jpeg",
    url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
  },
]);
const dialogVisible = ref(false);
const dialogImageUrl = ref("");

const handleRemove = (uploadFile, uploadFiles) => {
  // console.log(uploadFile, uploadFiles);
};

const handlePreview = (file) => {
  // console.log(file);
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
};

onMounted(() => {
  // console.log(sectionId.value, slopeId.value);
  // MonitorAPI.getMonitorData()
  //   .then((data) => {
  //     data.forEach((section) => {
  //       if (section.section_id == sectionId.value) {
  //         section.slopes.forEach((slope) => {
  //           if (slope.slope_id == slopeId.value) {
  //             var path = "/" + slope.milepost + "/2024-07-01/survey/image_list.json";
  //             fetch(path)
  //               .then((response) => response.json())
  //               .then((data) => {
  //                 data.forEach((image) => {
  //                   // imageUrls.value.push("/" + slope.milepost + "/survey/" + image.id + ".JPG");
  //                   fileList.value.push({
  //                     name: image.id + ".JPG",
  //                     url: "/" + slope.milepost + "/2024-07-01/survey/" + image.id + ".JPG"
  //                   })
  //                 })
  //               })
  //               .catch((error) => {
  //                 console.error("Error fetching JSON data:", error);
  //                 ElNotification({
  //                   title: "Error",
  //                   message: "图片加载失败",
  //                   type: "error",
  //                   offset: 50,
  //                 });
  //               });
  //           }
  //         });
  //       }
  //     });
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
});
</script>
