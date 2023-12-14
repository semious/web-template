<template>
  <Layout>
    <template #content>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户分成</el-breadcrumb-item>
      </el-breadcrumb>
      <a-layout>
        <a-layout-header class="py-12">
          <a-input-search class="mr-6" :style="{ width: '250px' }" @change="onSearch" v-model="searchInput"
            placeholder="输入手机号码或用户昵称搜索" search-button />
          <!-- <a-button type="primary" @click="goToUsers">查询所有用户</a-button> -->
        </a-layout-header>
        <a-layout-content>
          <a-table size="mini" class="mb-12" :pagination="false" :columns="columns" :data="data" :stripe="true">
            <template #optional="{ record }">
              <a-space class="my-5">
                <a-button size="small" @click="() => { goToUsers(record.nick_name) }">查看来源</a-button>
                <a-button size="small" @click="() => { gotToOrders(record.refer_id) }">查看订单</a-button>
              </a-space>
            </template>
          </a-table>
          <a-pagination :pageSize="50" @change="getData" :current="curPage" :style='{ "justify-content": "flex-end" }'
            :total="total" />
        </a-layout-content>
      </a-layout>
    </template>
  </Layout>
</template>
    
<script lang="ts">
import { ref, onMounted, computed, reactive, watch, onUpdated } from "vue";
import { Message } from '@arco-design/web-vue';
import { useRouter } from 'vue-router';

import Layout from "@/components/Layout.vue";
import { getUsersShareRatioService, searchUsersShareRatioService } from "@/api/cash";

export default {
  name: "App",
  components: {
    Layout,
  },
  setup() {
    const router = useRouter();
    const route = router.currentRoute;
    const searchInput = ref<string>("");
    const total = ref<number>(1);
    const curPage = ref<number>(1);

    watch(() => router.currentRoute.value, () => {
      // console.log('router.currentRoute.value.query', router.currentRoute.value.query);
      searchInput.value = router.currentRoute.value.query?.search as string || "";
    }, { immediate: true });

    const columns = [
      {
        title: "用户昵称",
        dataIndex: "nick_name",
        width: 100,
      },
      {
        title: "手机号",
        dataIndex: "user_phone",
        width: 120,
        slotName: "member_status",
      },
      {
        title: "分成时间",
        dataIndex: "create_time",
        width: 160,
      },
      {
        title: "分成金额",
        dataIndex: "change_amount",
        width: 80,
      },
      {
        title: '分成后余额',
        dataIndex: 'change_after',
        width: 100,
      },
      {
        title: '分成来源',
        dataIndex: 'change_remark',
        width: 120,
      },
      {
        title: '分成比例',
        dataIndex: 'share_ratio',
        width: 80,
      },
      {
        title: '分成级别',
        dataIndex: 'relation_level',
        widt: 80,
      },
      {
        title: "操作",
        slotName: "optional",
        width: 200,
      },
    ];
    const data = ref([]);

    function getUserInfo(ignoreSearch?: boolean) {
      if (searchInput.value.length > 0 && !ignoreSearch) {
        onSearch();
        return;
      }
      curPage.value = 1;
      getData(curPage.value);
    }

    onMounted(() => {
      getUserInfo();
    });

    function onSearch() {
      curPage.value = 1;

      if (searchInput.value.length < 1) {
        getUserInfo();
        return;
      }
      // console.log(searchInput.value);
      searchUsersShareRatioService(searchInput.value)
        .then((res: any) => {
          data.value = res.map((item: any) => {
            return item;
          })
          total.value = res.length;
          curPage.value = 1;
        }).catch((error) => {
          console.error(error);
        });
    }

    function getData(page: number) {
      curPage.value = page;
      getUsersShareRatioService(page).then((res: any) => {
        data.value = res.list.map((item: any) => {
          return item;
        })
        total.value = res.total;
      });
    }

    function goToUsers(search: string) {
      router.push({
        path: '/users',
        query: {
          search,
        },
      });
    }

    console.log('router :>> ', router.getRoutes());
    
    function gotToOrders(search: string) {
      router.push({
        path: '/users/payorder',
        // path: router.getRoutes().find((item) => item.name === 'payorder')?.path,
        query: {
          search,
        },
      });
    }

    return {
      columns,
      data,
      searchInput,
      onSearch,
      getUserInfo,
      total,
      curPage,
      getData,
      goToUsers,
      gotToOrders,
    };
  },
};
</script>
    
<style scoped>
</style>
