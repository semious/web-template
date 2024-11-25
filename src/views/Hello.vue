<template>
  <h3>Hello</h3>
</template>

<script lang="ts">
import { ref, onMounted, computed, reactive, watch, onUpdated } from "vue";
import { useRouter } from 'vue-router';

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


    const data = ref([]);

    onMounted(() => {

    });

    onUpdated(() => {
    });

    function onSearch() {

    }



    return {
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

<style scoped></style>
