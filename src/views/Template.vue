<template>
  <a-layout>
    <a-layout-header>
      
    </a-layout-header>
    <a-layout-content>
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
      searchInput,
      onSearch,
      total,
      curPage,
      currentUser,
    };
  },
};
</script>
    
<style scoped>
</style>
