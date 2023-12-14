<template>
  <Layout>
    <template #content>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>课程信息</el-breadcrumb-item>
      </el-breadcrumb>
      <a-layout>
        <a-layout-header class="py-12">
          <a-input-search class="mr-6" :style="{ width: '250px' }" @change="onSearch" v-model="searchInput"
            placeholder="输入课程名搜索" search-button />
          <!-- <a-button type="primary" class="mr-6" @click="getLatestUsers">显示最近十个新用户</a-button> -->
          <!-- <a-button type="primary" @click="() => { getTeacherInfo(true) }">显示所有用户</a-button> -->
        </a-layout-header>
        <a-layout-content>
          <a-table size="small" class="mb-12" :pagination="false" :columns="columns" :data="data" :stripe="true">
            <template #avatar="{ record }">
              <a-avatar :imageUrl="record.avatar_url" :size="40" />
            </template>
            <template #videl_url="{ record }">
              <a v-if="record.video_url" :href="record.video_url" target="_blank">点击查看</a>
              <span v-else>无</span>
            </template>
          </a-table>
          <a-pagination :pageSize="50" @change="getDataByPage" :current="curPage"
            :style='{ "justify-content": "flex-end" }' :total="total" />
        </a-layout-content>
      </a-layout>
    </template>
  </Layout>
</template>
    
<script lang="ts">
import { ref, onMounted, computed, reactive, watch } from "vue";
import { Message } from '@arco-design/web-vue';
import { useRouter } from 'vue-router';
import { getProductInfo as getProduct, searchProduct } from "@/api/product";

import Layout from "@/components/Layout.vue";

export default {
  name: "App",
  components: {
    Layout,
  },
  setup() {
    const router = useRouter();
    const route = router.currentRoute;
    const searchInput: any = ref("");
    const total = ref(1);
    const curPage = ref(1);

    watch(() => router.currentRoute.value, () => {
      searchInput.value = router.currentRoute.value.query?.user_id || "";
    }, { immediate: true });

    const columns = [
      // {
      //   title: '课程Id',
      //   dataIndex: 'id',
      //   width: 80,
      // },
      {
        title: '课程名称',
        dataIndex: 'product_name',
        width: 150,
      },
      {
        title: "类型",
        dataIndex: "product_type",
        width: 60,
      },
      {
        title: "父课程",
        dataIndex: " parent_product_id",
        width: 80,
        render: ({ record }: { record: any }) => {
          return record.parent_product_id ? record.parent_product_id : '无'
        }
      },
      {
        title: "课程介绍",
        dataIndex: "product_introduce",
      },
      {
        title: "状态",
        dataIndex: "product_status",
        width: 60,
      },
      {
        title: "课程价格",
        dataIndex: "product_price",
        width: 90,
      },
      {
        title: "课程地址",
        dataIndex: "video_url",
        width: 90,
        slotName: 'videl_url',
      },
      // {
      //   title: "生成时间",
      //   dataIndex: "create_time",
      //   width: 180,
      // },
      // {
      //   title: "操作",
      //   slotName: "optional",
      // },
    ];
    const data = ref([]);

    function getProductInfo(ignoreSearch?: boolean) {
      if (searchInput.value.length > 0 && !ignoreSearch) {
        onSearch();
        return;
      }
      curPage.value = 1;
      getDataByPage(curPage.value);
    }

    onMounted(() => {
      getProductInfo();
    });

    function onSearch() {
      if (searchInput.value.length < 1) {
        getProductInfo();
        return;
      }
      // console.log(searchInput.value);
      searchProduct(searchInput.value)
        .then((res: any) => {
          data.value = res.map((item: any) => {
            // item.exp_date = item.exp_date ? formatLocalDate(item.exp_date) : null;
            // item.create_time = formatLocalDate(item.create_time);
            // item.update_time = item.update_time ? formatLocalDate(item.update_time) : null;
            return item;
          })
          total.value = res.length;
          curPage.value = 1;
        }).catch((error) => {
          console.error(error);
        });
    }

    function getDataByPage(page: number) {
      curPage.value = page;
      getProduct(page).then((res: any) => {
        data.value = res.list.map((item: any) => {
          // item.exp_date = item.exp_date ? formatLocalDate(item.exp_date) : null;
          // item.create_time = formatLocalDate(item.create_time);
          // item.update_time = item.update_time ? formatLocalDate(item.update_time) : null;
          return item;
        })
        total.value = res.total;
      });
    }

    return {
      columns,
      data,
      searchInput,
      onSearch,
      total,
      curPage,
      getDataByPage,
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
