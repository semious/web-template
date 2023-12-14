<template>
  <Layout active="0">
    <template #content>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>客服后台</el-breadcrumb-item>
        <el-breadcrumb-item>咨询查询</el-breadcrumb-item>
      </el-breadcrumb>
      <a-layout class="flex-center">
        <a-layout-header class="py-12 mt-3">
          <a-space size="large">
            <div>用户手机<a-input name="phone" autocomplete="on" class="mr-6 ml-1" :style="{ width: '200px' }" v-model="userPhone" placeholder="手机号" /></div>
            <!-- <div>用户微信<a-input class="ml-1" :style="{ width: '200px' }" v-model="userWeixin" placeholder="微信号" /></div> -->
          </a-space>
          <a-button type="primary" class="mr-6" @click="onSearch">查询</a-button>
          <!-- <a-button type="primary" @click="() => { getUserInfo(true) }">显示所有用户</a-button> -->
        </a-layout-header>
        <a-layout-content>
          <a-table size="small" class="mb-12 mt-1" :pagination="false" :columns="columns" :data="data" :stripe="true">
            <template #avatar="{ record }">
              <a-avatar :imageUrl="record.avatar_url" :size="40" />
            </template>
          </a-table>
          <a-pagination :pageSize="10" @change="(value) => { curPage = value; onSearch() }" :current="curPage"
            :style='{ "justify-content": "flex-end" }' :total="total" />

          <!-- <div class="mb-12">历史查询记录</div>
          <a-alert v-if="error" class="mb-12" type="error">当前用户微信号与历史查询不一致</a-alert>
          <a-table size="small" class="mb-12" :pagination="false" :columns="query_columns" :data="query_data"
            :stripe="true">
            <template #wx_id="{ record }">
              <span :class="userWeixin !== record.wx_id ? 'text-red' : ''">{{ record.wx_id }}</span>
            </template>
          </a-table> -->
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
import { searchPayOrderByPhone } from "@/api/payorder";
import { getUserOrderQuery } from "@/api/query";

export default {
  name: "App",
  components: {
    Layout,
  },
  setup() {
    const userPhone = ref("");
    const userWeixin = ref("");
    const router = useRouter();
    const route = router.currentRoute;
    const total = ref(0);
    const curPage = ref(1);
    const error = ref(false);

    const columns = [
      {
        title: '付费时间',
        dataIndex: 'create_time',
        width: 180,
      },
      {
        title: "咨询老师",
        dataIndex: "teacher_name",
        width: 100,
      },
      {
        title: "购买服务",
        dataIndex: "product_name",
        width: 500,
        // ellipsis: true,
        // tooltip: true,
      },
      {
        title: "支付金额",
        dataIndex: "total_amount",
        width: 100,
      },
    ];
    const query_columns = [
      {
        title: '查询时间',
        dataIndex: 'create_time',
        width: 180,
      },
      {
        title: "查询客服",
        dataIndex: "admin_name",
        width: 100,
      },
      {
        title: "用户微信号",
        dataIndex: "wx_id",
        width: 100,
        slotName: 'wx_id',
      },
    ];
    const query_data = ref<any[]>([]);
    const data = ref([]);

    onMounted(() => {
    });

    function onSearch() {
      if (!userPhone.value) {
        Message.error('请输入用户手机号');
        return;
      }
      // console.log('userWeixin.value :>> ', userWeixin.value.length);
      if (userPhone.value.length < 11) {
        Message.error('请输入正确的手机号');
        return;
      }
      // console.log(searchInput.value);
      searchPayOrderByPhone(userPhone.value, curPage.value, "1").then((res: any) => {
        data.value = res.list.map((item: any) => {
          return item;
        })
        total.value = Number(res.total);
      }).catch((error) => {
        console.error(error);
      });
      error.value = false;
      // getUserOrderQuery(userPhone.value, userWeixin.value).then((res: any) => {
      //   console.log('res :>> ', res);
      //   const output: any[] = []
      //   res.forEach((item: any) => {
      //     // item.exp_date = item.exp_date ? formatLocalDate(item.exp_date) : null;
      //     // item.create_time = formatLocalDate(item.create_time);
      //     // item.update_time = item.update_time ? formatLocalDate(item.update_time) : null;
      //     if (item.wx_id !== userWeixin.value) {
      //       error.value = true;
      //       output.unshift(item);
      //     } else {
      //       output.push(item);
      //     }
      //   })
      //   query_data.value = output;
      // }).catch((error) => {
      //   console.error(error);
      // });
    }

    return {
      columns,
      data,
      onSearch,
      userPhone,
      userWeixin,
      total,
      curPage,
      query_columns,
      query_data,
      error,
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
