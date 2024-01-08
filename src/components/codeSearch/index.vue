<template>
     <a-space class="search-box">
        <a-input class="search-input" v-model="styleCode" placeholder="请输入款式ID进行查询" allow-clear>
        </a-input>
        <a-button type="primary" @click="searchKeyword">查询</a-button>
        <!-- <a-button type="outline" style="margin-left: 26px;" @click="searchAll">查询全部</a-button> -->
    </a-space>
</template>
<script lang="ts" setup>
import {
  ref
} from "vue";
import { Message } from '@arco-design/web-vue';
const emit = defineEmits(["searchKeyword"])
const styleCode = ref();
const searchKeyword = () => {
    if(!styleCode.value) {
        Message.info('请输入款式ID进行查询');
        return;
    }
    emit("searchKeyword",styleCode.value)
}

</script>
<style lang="less" scoped>
.search-box {
    height: 65px;
    background: #fff;
    padding-left: 24px;
    .search-input {
        height: 32px;
        background: #F7F8FA !important;
        border-radius: 2px 2px 2px 2px;
        opacity: 1;
    }
}
</style>