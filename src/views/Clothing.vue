<template>
  <a-layout class="container">
    <a-layout-header>
      <h3>制衣流程管理</h3>
    </a-layout-header>
    <a-layout-content>
      <a-space direction="vertical" :size="16" style="display: block;">
        <h4>1. 上传文件</h4>
        <a-space direction="horizontal">
          <a-upload action="http://clothing.yuanzixx.cn/clothes/demo/layer" name="srcPsd" :auto-upload="true"
            @success="onUploadPSBSuccess">
            <template #upload-button>
              <a-button type="primary">上传 PSB</a-button>
            </template>
          </a-upload>
        </a-space>
      </a-space>
      <a-space class="mt-2" direction="vertical" :size="16" style="display: block;">
        <h4>2. 分解后的图层效果</h4>
        <a-space direction="vertical">
          <a-button type="primary" :disabled="imageList.length == 0"
            @click="() => { downloadAll(imageList) }">下载所有图层</a-button>
          <!-- <a-button type="primary" :disabled="imageList.length == 0"
            @click="() => { visible = true }">预览所有图层</a-button> -->
        <a-image-preview-group infinite v-if="imageList.length > 0">
          <a-space style="display:flex;flex-wrap:wrap;width:100%;">
            <div v-for="(item,idx) in imageList" :key="idx">
              <a-image  v-if="idx<30" :src="item" width="200"  :preview-props="{
                actionsLayout: ['rotateRight', 'zoomIn', 'zoomOut'],
              }"/>
            </div>
          </a-space>
        </a-image-preview-group>
          
          <a-empty v-else />
          <a-image-preview-group  v-model:visible="visible" infinite v-if="imageList.length > 0" :srcList="imageList"></a-image-preview-group>
        </a-space>
      </a-space>
      <a-space class="mt-2" direction="vertical" :size="16" style="display: block;">
        <h4>3. 执行优化</h4>
        <a-space direction="horizontal">
          <a-upload :custom-request="customRequest" name="dstCad" :auto-upload="true"
            @success="onUploadCadSuccess" :on-before-upload="(file) => { loading = true; return true; }">
            <template #upload-button>
              <!-- <a-button :disabled="!cad || !psb" type="primary">上传目标 CAD 图</a-button> -->
              <a-button :disabled="!psb" type="primary">上传目标 CAD 图</a-button>
            </template>
          </a-upload>
          <!-- :disabled="!psb" -->
          <!-- <a-button type="primary" :disabled="!cad || !psb" @click="">执行分解</a-button> -->
        </a-space>
      </a-space>
      <a-space class="mt-2" direction="vertical" :size="16" style="display: block;">
        <h4>4. 优化后图层</h4>
        <a-space direction="vertical">
          <a-button type="primary" :disabled="imageListFinal.length == 0"
            @click="() => { downloadAll(imageListFinal) }">下载所有图层</a-button>
          <!-- <a-button type="primary" :disabled="imageListFinal.length == 0"
            @click="() => { visibleCad = true }">预览所有图层</a-button> -->
            <a-image-preview-group infinite v-if="imageListFinal.length > 0">
          <a-space style="display:flex;flex-wrap:wrap;width:100%;">
            <div v-for="(item,idx) in imageListFinal" :key="idx">
              <a-image  v-if="idx<30" :src="item" width="200"  :preview-props="{
                actionsLayout: ['rotateRight', 'zoomIn', 'zoomOut'],
              }"/>
            </div>
          </a-space>
        </a-image-preview-group>
        <a-empty v-else />
          <a-image-preview-group v-model:visible="visibleCad" infinite v-if="imageListFinal.length > 0" :src-list="imageListFinal"></a-image-preview-group>
         
        </a-space>
      </a-space>
      <!-- <a-table :pagination="false" :columns="columns" :data="data" :stripe="true">
      </a-table>
      <a-pagination :pageSize="50" :current="curPage" :style='{ "justify-content": "flex-end" }' :total="total" /> -->
    </a-layout-content>
  </a-layout>
</template>
    
<script lang="ts">
import { ref, onMounted, computed, reactive, watch, onUpdated } from "vue";
import { Message } from '@arco-design/web-vue';
import { useRouter } from 'vue-router';
import { request } from '@/utils/request'
import axios from "axios";
import { postCad } from "@/api/upload";

export default {
  name: "App",
  components: {
  },
  setup() {
    const router = useRouter();
    const route = router.currentRoute;
    const uploadRef = ref();
    const files = ref([]);
    const psb = ref(false);
    const cad = ref("");
    const imageList = ref([]);
    const imageListFinal = ref([]);
    const layers = ref([]);
    const data = ref({});
    const loading = ref(false);
    const visible = ref(false);
    const visibleCad = ref(false);

    watch(() => (layers.value, cad.value), () => {
      data.value = {
        layerVO: {
          layers: layers.value,
          srcCad: cad.value,
        },
      }
      // console.log('router.currentRoute.value.query', router.currentRoute.value.query);
    }, { immediate: true });

    // const columns = [
    //   {
    //     title: 'test',
    //     dataIndex: 'test',
    //     width: 80,
    //   },
    // ];

    onMounted(() => {

    });

    onUpdated(() => {
    });

    const customRequest = (option: any) => {
      const { fileItem } = option
      console.log('fileItem :>> ', fileItem);

    //   let data ={
    //     "layers":[
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/02.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/03.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/04.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/05.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/06.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/07.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/08.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/09.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/10.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/11.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/12.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/13.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/14.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/15.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/16.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/17.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/18.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/19.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/20.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/21.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/22.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/23.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/24.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/25_cad.jpg",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/26.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/27.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/28.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/29.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/30.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/31.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/32.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/33.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/34.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/35.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/36.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/37.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/38.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/39.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/40.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/41.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/42.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/43.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/44.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/45.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/46.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/47.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/48.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/49.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/50_cad.jpg",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/51.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/52.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/53.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/54.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/55.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/56.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/57.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/58.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/59.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/60.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/61.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/62.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/63.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/64.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/65.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/66.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/67.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/68.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/69.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/70.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/71.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/72.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/73.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/74.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/75_cad.jpg",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/76.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/77.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/78.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/79.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/80.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/81.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/82.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/83.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/84.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/85.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/86.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/87.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/88.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/89.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/90.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/91.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/92.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/93.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/94.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/95.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/96.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/97.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/98.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/99.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/100_cad.jpg",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/101.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/102.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/103.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/104.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/105.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/106.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/107.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/108.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/109.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/110.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/111.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/112.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/113.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/114.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/115.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/116.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/117.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/118.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/119.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/120.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/121.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/122.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/123.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/124.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/125_cad.jpg",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/126.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/127.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/128.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/129.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/130.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/131.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/132.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/133.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/134.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/135.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/136.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/137.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/138.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/139.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/140.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/141.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/142.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/143.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/144.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/145.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/146.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/147.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/148.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/149.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/150_cad.jpg",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/151.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/152.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/153.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/154.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/155.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/156.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/157.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/158.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/159.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/160.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/161.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/162.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/163.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/164.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/165.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/166.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/167.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/168.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/169.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/170.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/171.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/172.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/173.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/174.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/175_cad.jpg",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/176.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/177.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/178.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/179.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/180.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/181.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/182.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/183.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/184.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/185.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/186.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/187.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/188.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/189.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/190.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/191.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/192.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/193.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/194.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/195.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/196.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/197.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/198.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/199.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/200_cad.jpg",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/201.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/202.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/203.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/204.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/205.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/206.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/207.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/208.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/209.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/210.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/211.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/212.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/213.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/214.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/215.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/216.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/217.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/218.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/219.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/220.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/221.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/222.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/223.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/224.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/225_cad.jpg",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/226.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/227.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/228.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/229.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/230.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/231.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/232.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/233.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/234.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/235.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/236.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/237.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/238.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/239.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/240.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/241.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/242.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/243.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/244.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/245.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/246.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/247.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/248.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/249.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/250_cad.jpg",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/251.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/252.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/253.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/254.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/255.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/256.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/257.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/258.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/259.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/260.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/261.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/262.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/263.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/264.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/265.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/266.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/267.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/268.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/269.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/270.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/271.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/272.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/273.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/274.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/275_cad.jpg"
    //     ],
    //     "srcCad":"app/clothes/49510/S/1/layer/275_cad.jpg"
    // }

      let params = {
        layerVO: data,
        dstCad: fileItem.file
      }
      console.log("params",params)
      postCad(params).then((res)=> {
        console.log("postCad",res)
      })

    };
    
    const onBeforeUpload = (file: any) => {

      return true;
    }

    const onUploadPSBSuccess = (fileItem: any) => {
      console.log('onUploadPSBSuccess fileItem :>> ', fileItem);
      let res = fileItem.response || null;
      if(res && res.data && res.data.layers) {
        imageList.value = res.data.layers;
        console.log("imageList",imageList)
        psb.value = true;
      }
      // let res = fileItem
    };

    const onUploadCadSuccess = (fileItem: any) => {
      console.log('onUploadCadSuccess fileItem :>> ', fileItem);
      let res = fileItem.response || null;
      if(res && res.data && res.data.layers) {
        imageListFinal.value = res.data.layers;
        console.log("imageListFinal",imageListFinal)
      }
    }

    // const onScale

    function downloadAll(list: any) {
      list.forEach((item: any) => {
        downloadImage(item);
      });
    }

    function downloadImage(imageUrl: string) {
      console.log('url :>> ', imageUrl);
      axios({
        url: imageUrl,
        method: 'GET',
        responseType: 'blob', // important
      }).then((response) => {
        let blob = new Blob([response.data], { type: 'image/png' });
        let link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        const filename = imageUrl.split('/').pop();
        link.download = filename || 'image.png';
        link.click();
      });
    }

    // function goToUsers() {
    //   window.sessionStorage.removeItem('currentUser');
    //   router.push({
    //     path: '/home',
    //   });
    // }

    function get(url: string, params: any) {
      request({
        url,
        method: 'GET',
        params,
      }).then((res: any) => {
        console.log('res', res);
      })
    }

    function post(url: string, data: any) {
      request({
        url,
        method: 'POST',
        data,
      }).then((res: any) => {
        console.log('res', res);
      })
    }

    return {
      // columns,
      data,
      onUploadPSBSuccess,
      onUploadCadSuccess,
      imageList,
      imageListFinal,
      psb,
      cad,
      downloadAll,
      loading,
      onBeforeUpload,
      visible,
      visibleCad,
      customRequest
    };
  },
};
</script>
    
<style scoped>
.container {
  margin: 16px;
}
</style>
