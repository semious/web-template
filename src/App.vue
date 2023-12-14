<template>
  <router-view />
</template>

<script lang="ts">
// import { checkEnv } from "@/api/env";
export default {
  name: "App",
  setup() {
    setTimeout(() => {
      sessionStorage.clear();
    }, 60 * 60 * 1000);
    // setInterval(() => {
    //   checkEnv();
    // }, 60 * 1000);
  }
};

</script>

<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
}
</style>
