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
          <a-image-preview-group v-if="imageList.length > 0" :src-list="imageList"></a-image-preview-group>
          <a-empty v-else />
          <!-- <a-table></a-table> -->
        </a-space>
      </a-space>
      <a-space class="mt-2" direction="vertical" :size="16" style="display: block;">
        <h4>3. 执行优化</h4>
        <a-space direction="horizontal">
          <a-upload action="http://clothing.yuanzixx.cn/clothes/demo/layer" name="dstCad" :auto-upload="true"
            @success="onUploadPSBSuccess" :on-before-upload="(file) => { loading = true; return true; }">
            <template #upload-button>
              <a-button :disabled="!cad || !psb" type="primary">上传目标 CAD 图</a-button>
            </template>
          </a-upload>
          <!-- <a-button type="primary" :disabled="!cad || !psb" @click="">执行分解</a-button> -->
        </a-space>
      </a-space>
      <a-space class="mt-2" direction="vertical" :size="16" style="display: block;">
        <h4>4. 优化后图层</h4>
        <a-space direction="vertical">
          <a-button type="primary" :disabled="imageListFinal.length == 0"
            @click="() => { downloadAll(imageListFinal) }">下载所有图层</a-button>
          <a-image-preview-group v-if="imageListFinal.length > 0" :src-list="imageListFinal"></a-image-preview-group>
          <a-empty v-else />
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

export default {
  name: "App",
  components: {
  },
  setup() {
    const router = useRouter();
    const route = router.currentRoute;
    const uploadRef = ref();
    const files = ref([]);
    const psb = ref("");
    const cad = ref("");
    const imageList = ref([]);
    const imageListFinal = ref([]);
    const layers = ref([]);
    const data = ref({});
    const loading = ref(false);

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
      const { onProgress, onError, onSuccess, fileItem, name } = option
      console.log('fileItem :>> ', fileItem);
      console.log('name :>> ', name);
      const xhr = new XMLHttpRequest();
      if (xhr.upload) {
        xhr.upload.onprogress = function (event) {
          let percent;
          if (event.total > 0) {
            // 0 ~ 1
            percent = event.loaded / event.total;
          }
          onProgress(percent, event);
        };
      }
      xhr.onerror = function error(e) {
        onError(e);
      };
      xhr.onload = function onload() {
        if (xhr.status < 200 || xhr.status >= 300) {
          return onError(xhr.responseText);
        }
        onSuccess(xhr.response);
      };

      // const formData = new FormData();
      // formData.append(name || 'file', fileItem.file);
      // xhr.open('post', 'http://clothing.yuanzixx.cn/clothes/demo/layer', true);
      // xhr.send(formData);

      return {
        abort() {
          xhr.abort()
        }
      }
    };
    
    const onBeforeUpload = (file: any) => {

      return true;
    }

    const onUploadPSBSuccess = (fileItem: any) => {
      console.log('fileItem :>> ', fileItem);
    };

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
      imageList,
      imageListFinal,
      psb,
      cad,
      downloadAll,
      loading,
      onBeforeUpload,
    };
  },
};
</script>
    
<style scoped>
.container {
  margin: 16px;
}
</style>
