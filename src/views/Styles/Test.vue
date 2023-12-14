<template>
  <Layout active="7">
    <template #content>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>模板验证</el-breadcrumb-item>
      </el-breadcrumb>
      <a-layout>
        <a-layout-header class="py-12">
        </a-layout-header>
        <a-layout-content>
          <a-space direction="vertical">
            <div>
              模板名:
              <a-select :model-value="currentStyle.id" v-if="currentStyle" @change="changeStyle" :style="{ width: '500px' }" placeholder="模板名">
                <a-option :value="style.id" v-for="style in styleList">
                  {{ style.app_id }} - {{ style.style_name }}</a-option>
              </a-select>
            </div>
            <div>
              <a-image height="200" v-if="currentStyle" :src="currentStyle.style_img_url" />
            </div>
            <div>
              服务器:
              <a-select v-if="currentServer" v-model="currentServer.url" :style="{ width: '500px' }" placeholder="服务器">
                <a-option :value="server.url" v-for="server in sdServers">
                  {{ server.server }} - {{ server.model }})</a-option>
              </a-select>
            </div>
            <div>
              类型: <a-radio-group v-model="currentType" default-value="img2img" :options="typeOptions" @click="changeType" />
            </div>
            <div>
              <a-button type="primary" @click="startDraw">开始生成</a-button>
            </div>
          </a-space>
        </a-layout-content>
      </a-layout>
    </template>
  </Layout>
</template>
    
<script lang="ts">
import { ref, onMounted, computed, reactive, watch } from "vue";
import { ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';

import Layout from "@/components/Layout.vue";
import { getModelInfo } from "@/api/sd";
import { SDModel } from "@/api/types";
import { queryImageStyle, styleItem } from "@/api/imagestyle";
import { getServerList } from "@/api/servers";

interface SDServerDataView {
  server: string;
  model: string;
  vae: string;
  modelList: SDModel[];
  url: string,
  optional: string;
}

export default {
  name: "App",
  components: {
    Layout,
  },
  setup() {
    const router = useRouter();
    const route = router.currentRoute;
    const sdServers: SDServerDataView[] = [];
    const styleList = ref<styleItem[]>([]);

    const currentStyle = ref<styleItem>();
    const currentServer = ref<SDServerDataView>();
    const currentType = ref('img2img');

    const options = [
      { label: '所有应用', value: '' },
      { label: 'AI头像', value: 'WX001' },
      { label: 'AI写真', value: 'WX002' },
    ];

    const typeOptions = [
      { label: '图生图', value: 'img2img' },
      { label: '文生图', value: 'txt2img' },
    ];

    function onChangeAppId(value: any) {
      console.log('value :>> ', value);
    }

    onMounted(() => {
      getServerData();
      queryImageStyle().then((res: styleItem[]) => {
        console.log('style list :>> ', res);
        res.sort((a, b) => a.app_id.localeCompare(b.app_id));
        styleList.value = res;
        // console.log('styleList.value[0] :>> ', styleList.value[0]);
        currentStyle.value = styleList.value[0];
      });
    });

    async function getServerData() {
      const serverList = getServerList();
      serverList.map((server) => {
        getModelInfo(server).then(({ models, options }) => {
          models = models.sort((a, b) => a.title.localeCompare(b.title));
          // console.log('modelInfo :>> ', modelInfo);
          const currentModel = models.find((item) => item.sha256 === options.sd_checkpoint_hash) as SDModel;
          sdServers.push({
            server,
            url: 'http://' + server,
            model: currentModel.title,
            vae: options.sd_vae,
            modelList: models,
            optional: '查看',
          });
          currentServer.value = sdServers[0];
        });
      });
    }

    function changeType(val: any) {
      // console.log('val :>> ', val);
      // currentType = val;
    }

    function openBlankPage(url: string) {
      window.open(url, '_blank');
    }

    function changeStyle(val: any) {
      console.log('val :>> ', val);
      currentStyle.value = styleList.value.find((item) => item.id === val);
    }

    function startDraw() {

    }

    return {
      sdServers,
      router,
      openBlankPage,
      options,
      onChangeAppId,
      startDraw,
      styleList,
      currentStyle,
      changeStyle,
      currentServer,
      changeType,
      typeOptions,
      currentType
    };
  },
};
</script>
    
<style scoped>
</style>
