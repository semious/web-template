<template>
  <a-layout class="container">
    <a-layout-header>
      <h3>制衣流程管理</h3>
    </a-layout-header>
    <a-layout-content>
      <a-space direction="vertical" :size="16" style="display: block;">
        <h4>1. 上传文件</h4>
        <a-space direction="horizontal">
          <!-- PSB和CAD文件 <a-input disabled /> <a-button type="primary" @click="">上传</a-button> -->
          <a-upload action="http://clothing.yuanzixx.cn/clothes/demo/layer" :auto-upload="false" ref="uploadRef"
            @change="onChange" multiple>
            <template #upload-button>
              <a-button type="primary">上传PSB和CAD文件</a-button>
              <a-button type="primary" @click="submit"> start upload</a-button>
            </template>
          </a-upload>
        </a-space>
      </a-space>
      <a-space class="mt-2" direction="vertical" :size="16" style="display: block;">
        <h4>2. 执行PSB图层分解</h4>
        <a-space direction="horizontal">
          <a-button type="primary" @click="">执行分解</a-button>
        </a-space>
      </a-space>
      <a-space class="mt-2" direction="vertical" :size="16" style="display: block;">
        <h4>3. 分解后的图层效果</h4>
        <a-space direction="horizontal">
          <a-button type="primary" @click="">下载所有图层</a-button>
          <!-- <a-table></a-table> -->
        </a-space>
      </a-space>
      <a-space class="mt-2" direction="vertical" :size="16" style="display: block;">
        <h4>4. 执行优化</h4>
        <a-space direction="horizontal">
          <a-button type="primary" @click="">执行分解</a-button>
        </a-space>
      </a-space>
      <a-space class="mt-2" direction="vertical" :size="16" style="display: block;">
        <h4>5. 优化后图层</h4>
        <a-space direction="horizontal">
          <a-button type="primary" @click="">下载</a-button>
          <!-- <a-table></a-table> -->
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

export default {
  name: "App",
  components: {
  },
  setup() {
    const router = useRouter();
    const route = router.currentRoute;
    const uploadRef = ref();
    const files = ref([]);

    watch(() => router.currentRoute.value, () => {
      // console.log('router.currentRoute.value.query', router.currentRoute.value.query);
    }, { immediate: true });

    const columns = [
      {
        title: 'test',
        dataIndex: 'test',
        width: 80,
      },
    ];
    const data = ref([]);

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

    const submit = (e: any) => {
      console.log('uploadRef :>> ', uploadRef);
      console.log('submit');
      e.stopPropagation();
      uploadRef.value.submit();
    };

    const onChange = (fileList: any) => {
      console.log('fileList :>> ', fileList);
      files.value = fileList;
    };

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
      columns,
      data,
      customRequest,
      submit,
      onChange,
    };
  },
};
</script>
    
<style scoped>
.container {
  margin: 16px;
}
</style>
