<template>
  <Layout>
    <template #content>
      <a-layout>
        <a-layout-header class=""></a-layout-header>
        <a-layout-content>
          <a-table :pagination="false" :columns="columns" :data="data" :stripe="true">
          </a-table>
          <a-pagination :pageSize="50" :current="curPage"
            :style='{ "justify-content": "flex-end" }' :total="total" />
        </a-layout-content>
      </a-layout>
    </template>
  </Layout>
</template>
    
<script lang="ts">
import { ref, onMounted, computed, reactive, watch, onUpdated } from "vue";
import { Message } from '@arco-design/web-vue';
import { useRouter } from 'vue-router';
import { getUserInfo as getUserInfoService, searchUser } from "@/api/user";

import Layout from "@/components/Layout.vue";

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
    const currentUser = ref<any>({});

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

    function onSearch() {
     
    }

    // function goToPage(relation: string, user: any) {
    //   window.sessionStorage.setItem('currentUser', JSON.stringify(user));
    //   router.push({
    //     path: '/users',
    //     query: {
    //       userId: user.id,
    //       relate: relation,
    //     }
    //   });
    // }

    // function goToUsers() {
    //   window.sessionStorage.removeItem('currentUser');
    //   router.push({
    //     path: '/home',
    //   });
    // }

    function getDataByPage(page: number) {
      curPage.value = page;
      getUserInfoService(page).then((res: any) => {
        // data.value = res.list.map((item: any) => {
        //   return item;
        // })
        // total.value = res.total;
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
      currentUser,
    };
  },
};
</script>
    
<style scoped></style>
