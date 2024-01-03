<template>
     <a-space>
        <a-input class="search-input" v-model="styleCode" placeholder="请输入款式ID进行筛选" allow-clear>
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
        Message.info('请输入款式ID进行筛选');
        return;
    }
    emit("searchKeyword",styleCode.value)
}

</script>