<template>
  <div class="not-found">
    <img src="../assets/img/404.gif" alt="" />
  </div>
</template>
  
<script lang="ts">
import { onMounted } from "vue";
export default {
  name: '404',
  setup() {
    onMounted(() => {
    });
  }
}
</script>
<style lang="less" scoped>
.not-found {
  width: 100%;
  height: 100%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>
  
  