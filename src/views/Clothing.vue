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
            @success="onUploadCadSuccess" @error="onUploadCadError" :on-before-upload="(file) => { loading = true; return true; }">
            <template #upload-button>
              <!-- <a-button :disabled="!cad || !psb" type="primary">上传目标 CAD 图</a-button> -->
              <a-button  type="primary">上传目标 CAD 图</a-button>
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
    <!-- <a-spin :loading="loading" tip="上传中">
  </a-spin> -->
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
    const data = ref({
    });
    const srcCad = ref("");
    const loading = ref(false);
    const visible = ref(false);
    const visibleCad = ref(false);
    const visibleModel = ref(false);

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
    //   let testData = {
    //      "layers":[
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/02.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/03.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/04.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/05.png",
    //         "https://xianxin.cn-gd.ufileos.com/app/clothes/49510/S/1/layer/06.png",
    //     ],
    //     "srcCad":"app/clothes/49510/S/1/layer/25_cad.jpg"
    // }
    // let params = {
    //     layers: testData.layers,
    //     srcCad: testData.srcCad,
    //     dstCad: fileItem.file
    //   }
    let subLayers = layers.value.slice(0,5)

      let params = {
        layers: subLayers,
        srcCad: srcCad.value,
        dstCad: fileItem.file
      }
      
      console.log("params",params)
      postCad(params).then((res:any)=> {
        console.log("postCad",res)
        if(res && res.data) {
          imageListFinal.value = res.data;
          loading.value = false;
          console.log("imageListFinal",imageListFinal)
        } else {
          loading.value = false;
        }
      }).catch(() => {
        loading.value = false;
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
        layers.value = res.data.layers;
        srcCad.value = res.data.srcCad;
        console.log("imageList",imageList)
        psb.value = true;
      }
      // let res = fileItem
    };

    const onUploadCadSuccess = (fileItem: any) => {
      console.log('onUploadCadSuccess fileItem :>> ', fileItem);
      let res = fileItem.response || null;
      if(res && res.data) {
        imageListFinal.value = res.data;
        loading.value = false;
        console.log("imageListFinal",imageListFinal)
      } else {
        loading.value = false;
      }
    }

    const onUploadCadError = (fileItem: any) => {
      loading.value = false;
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
      customRequest,
      visibleModel,
      onUploadCadError
    };
  },
};
</script>
    
<style scoped>
.container {
  margin: 16px;
}
</style>
