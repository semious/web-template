<template>
  <div id="container">
    <el-container>
      <el-header :class="className">
        <Header />
      </el-header>
      <el-container>
        <el-aside class="nav">
          <LeftMenu :active="active" />
        </el-aside>
        <el-container>
          <el-main class="content">
            <!-- <a-alert v-if="showTip" class="mb-12 sticky-top" type="error">生产环境，请谨慎操作数据！</a-alert> -->
            <slot name="content"></slot>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { ref } from "vue";
import Header from "@/components/layouts/Header.vue";
import LeftMenu from "@/components/layouts/LeftMenu.vue";

export default {
  props: {
    active: String
  },
  components: {
    Header,
    LeftMenu,
  },
  setup() {
    const env =  window.sessionStorage.getItem('env');
    const showTip = ref(env === 'prod');
    return {
      className: env === 'prod' ? 'header_product': 'header',
      showTip
    };
  },
  methods: {
  },
};
</script>
<style scoped>
#container {
  background-color: white;
  width: 100%;
  height: 100%;
}

.header {
  background-color: #324057;
}

.header_product {
  background-color: rgb(06,161,255);
  color: #324057;
}

.nav_product {
  background-color: rgb(06,161,255);
  color: #324057;
}

.nav {
  /* background-color: #324057; */
  height:calc(100vh - 60px);
  width: 150px;
}

.content {
  background-color: #fff;
  height:calc(100vh - 60px);
  width: calc(100vw - 150px);
  overflow: auto;
}
</style>
