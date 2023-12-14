<template>
  <Layout active="7">
    <template #content>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户订单</el-breadcrumb-item>
      </el-breadcrumb>
      <a-layout>
        <a-layout-header class="py-12">
          <a-space direction="vertical" size="small">
            <a-input-search class="mr-6" :style="{ width: '300px', }" v-model="searchInput" placeholder="输入用户名或微信订单Id搜索"
              @change="onSearch" search-button />
            <!-- <a-input-search class="mr-6" :style="{ width: '250px' }" @change="onSearch" v-model="searchInput"
              placeholder="输入老师名搜索" search-button /> -->
            <a-space>产品类型: <a-radio-group @change="changeType" v-model="currentType" :options="typeOptions" /></a-space>
            <a-space>支付状态: <a-radio-group @change="changePayStatus" v-model="currentPayStatus"
                :options="payStatusOptions" /></a-space>
          </a-space>
        </a-layout-header>
        <a-layout-content>
          <a-table :loading="isLoading" size="mini" :columns="consult_columns" :data="data" :pagination="false" stripe>
            <template #userid="{ record }">
              <router-link :to="'/users?search=' + record.nick_name" class="">{{ record.nick_name }}</router-link>
            </template>
          </a-table>
          <a-pagination :pageSize="50" @change="changePage" :style='{ "justify-content": "flex-end" }' :total="total" />
        </a-layout-content>
      </a-layout>
    </template>
  </Layout>
</template>
    
<script lang="ts">
import { ref, onMounted, computed, reactive, watch } from "vue";
import { useRouter } from 'vue-router'

import Layout from "@/components/Layout.vue";
import { getPayOrder, searchPayOrder } from "@/api/payorder";
import { formatMoney } from "@/utils/format";

export default {
  name: "App",
  components: {
    Layout,
  },
  setup() {
    const router = useRouter();
    const total = ref(1);
    const curPage = ref(1);
    const isLoading = ref(false);
    const data = ref([]);
    const searchInput = ref("");

    watch(() => router.currentRoute.value, () => {
      // console.log('router.currentRoute.value.query', router.currentRoute.value.query);
      searchInput.value = router.currentRoute.value.query?.search as string || "";
    }, { immediate: true });

    function goToPageWithUserId(userName: string) {
      router.push({ path: '/users', query: { userName } });
    }

    const typeOptions = [
      { label: '咨询', value: 1 },
      { label: '课程', value: 2 },
    ]
    const currentType = ref(1);

    function changeType(val: any) {
      // console.log('changeType val :>> ', val);
      currentType.value = val;
      searchInput.value = "";
      getData();
    }

    const payStatusOptions = [
      { label: '全部', value: 0 },
      { label: '支付中', value: 1 },
      { label: '预支付失败', value: 2 },
      { label: '支付成功', value: 3 },
      { label: '支付失败', value: 4 },
      { label: '订单取消', value: 6 },
    ]

    const currentPayStatus = ref(0);

    function changePayStatus(val: any) {
      // console.log('changePayStatus val :>> ', val);
      currentPayStatus.value = val;
      searchInput.value = "";
      getData();
    }

    const course_columns = [
      {
        title: "用户昵称",
        width: 120,
        dataIndex: "nick_name",
        slotName: "userid",
      },
      {
        title: "手机号码",
        width: 120,
        dataIndex: "user_phone",
      },
      {
        title: "产品名",
        dataIndex: "product_name",
        width: 150,
      },
      {
        title: "金额",
        width: 100,
        dataIndex: "total_amount",
        render: (item: any) => {
          return item.record?.total_amount ? formatMoney(item.record.total_amount) : "";
        },
      },
      {
        title: "状态",
        dataIndex: "pay_status",
        width: 100,
        render(item: any) {
          const pay_status = item.record?.pay_status;
          switch (pay_status) {
            case 1:
              return "支付中";
            case 2:
              return "预支付失败";
            case 3:
              return "支付成功";
            case 4:
              return "支付失败";
            case 6:
              return "订单取消";
            default:
              return "未知状态";
          }
        }
      },
      {
        title: "微信订单",
        dataIndex: "wx_pay_id",
        width: 180,
      },
      {
        title: "订单时间",
        dataIndex: "create_time",
        width: 160,
      },
    ];

    const consult_columns = course_columns.concat({
      title: "支付时间",
      dataIndex: "update_time",
      width: 160,
    });

    function getData() {
      isLoading.value = true;
      curPage.value = 1;
      getPayOrder(curPage.value, currentType.value, currentPayStatus.value)
        .then((res: any) => {
          data.value = res.list;
          total.value = res.total;
        })
        .catch((error) => {
          console.error(error);
        }).finally(() => {
          isLoading.value = false;
        })
    }
    onMounted(() => {
      onSearch();
    });

    function onSearch() {
      // console.log(searchInput.value);
      if (searchInput.value.length < 1) {
        getData();
        return;
      }
      isLoading.value = true;
      searchPayOrder(searchInput.value)
        .then((res: any) => {
          // console.log('res :>> ', res);
          data.value = res;
          total.value = res.length;
          curPage.value = 1;
        })
        .catch((error) => {
          console.error(error);
        }).finally(() => {
          isLoading.value = false;
        })
    }

    function changePage(page: number) {
      curPage.value = page;
      getPayOrder(page, currentType.value, currentPayStatus.value).then((res: any) => {
        data.value = res.info_list;
        total.value = res.total_list;
      });
    }

    return {
      course_columns,
      consult_columns,
      data,
      searchInput,
      onSearch,
      goToPageWithUserId,
      total,
      curPage,
      changePage,
      typeOptions,
      currentType,
      changeType,
      payStatusOptions,
      currentPayStatus,
      changePayStatus,
      isLoading,
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
