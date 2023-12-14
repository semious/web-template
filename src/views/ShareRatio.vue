<template>
  <Layout>
    <template #content>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>客服后台</el-breadcrumb-item>
        <el-breadcrumb-item>分成管理</el-breadcrumb-item>
      </el-breadcrumb>
      <a-layout class="flex-center">
        <h3>分成列表</h3>
        <a-layout-content>
          <a-table :loading="isLoading" size="small" class="mb-12" :pagination="false" :columns="columns" :data="data"
            :stripe="true">
            <template #param_value="{ record }">
              <a-input-number :step="0.01" size="small" :min="0" :max="1" v-model="record.param_value" />
            </template>
            <template #action="{ record }">
              <a-popconfirm type="warning" @ok="() => { update(record.id, record.param_value) }" content="请确认是否修改?">
                <a-button type="primary">更新</a-button>
              </a-popconfirm>
            </template>
          </a-table>
        </a-layout-content>
      </a-layout>
    </template>
  </Layout>
</template>

<script lang="ts">
import { ref, onMounted, computed, reactive, watch } from "vue";
import { Message } from '@arco-design/web-vue';
import { useRouter } from 'vue-router';

import Layout from "@/components/Layout.vue";
import { getSharoRatioService, updateSharoRatioService } from "@/api/cash";

export default {
  name: "App",
  components: {
    Layout,
  },
  setup() {
    const router = useRouter();
    const route = router.currentRoute;
    const total = ref(0);
    const curPage = ref(1);
    const isLoading = ref(false);

    const columns = [
      {
        title: '分成名称',
        dataIndex: 'param_name',
        width: 200,
      },
      {
        title: "分成比例",
        dataIndex: "param_value",
        width: 110,
        slotName: 'param_value',
      },
      {
        title: "操作",
        dataIndex: "action",
        width: 100,
        slotName: 'action',
      },
    ];

    const data = ref<{ id: number, param_name: string, param_value: number }[]>([]);

    onMounted(() => {
      getData();
    });

    function getData() {
      isLoading.value = true;
      // console.log(searchInput.value);
      getSharoRatioService().then((res: any) => {
        isLoading.value = false;
        const output: any[] = []
        res.forEach((item: any) => {
          output.push({
            ...item,
            param_value: Number(item.param_value)
          })
        });
        data.value = output;
      }).catch((error: any) => {
        console.error(error);
      });
    }

    function update(id: string, value: number) {
      // console.log('value :>> ', value);
      isLoading.value = true;
      updateSharoRatioService(id, value).then(res => {
        isLoading.value = false;
        getData();
      });
    }

    return {
      columns,
      data,
      getData,
      total,
      curPage,
      isLoading,
      update,
    };
  },
};
</script>
    
<style scoped>
.green {
  color: black;
  font-size: 15px;
}

.user-info {
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;
}

.transparent-modal {
  background-color: transparent;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
