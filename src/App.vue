<template>
  <router-view />
</template>

<script lang="ts">
export default {
  name: "App",
  setup() {
    setTimeout(() => {
      sessionStorage.clear();
    }, 60 * 60 * 1000);
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
