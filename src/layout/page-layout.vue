<template>
  <router-view v-slot="{ Component, route }">
    <transition name="fade" mode="out-in" appear>
      <component
        :is="Component"
        :key="route.fullPath"
      />
    </transition>
  </router-view>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
</script>

<style scoped lang="less"></style>
