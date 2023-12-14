<template>
  <Layout active="4">
    <template #content>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>客服后台</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/product/course' }">课程信息</el-breadcrumb-item>
        <el-breadcrumb-item>视频信息</el-breadcrumb-item>
      </el-breadcrumb>
      <a-layout>
        <a-layout-header class="py-12">
          <a-space direction="vertical">
            <h3>当前课程: {{ product_name }}</h3>
            <a-space direction="horizontal" size="small">
              <!-- <a-input-search class="mr-6" :style="{ width: '250px' }" @change="onSearch" v-model="searchInput"
              placeholder="输入老师名搜索" search-button /> -->
              状态筛选: <a-radio-group @change="onChangeStatus" v-model="currentStatus" :options="statusOptions" />
            </a-space>
          </a-space>
        </a-layout-header>
        <a-layout-content>
          <a-table size="small" :loading="isLoading" class="mb-12" :pagination="false" :columns="columns" :data="data"
            :stripe="true">
            <template #product_sort="{ record }">
              <a-input-number size="small" :disabled="!record.editable" :min="0" :max="9999"
                v-model="record.product_sort" />
            </template>
            <template #product_name="{ record }">
              <a-input size="small" :disabled="!record.editable" v-model="record.product_name" placeholder="套餐名称" />
            </template>
            <template #product_duration="{ record }">
              <a-input-number size="small" :disabled="!record.editable" :min="0" :max="9999"
                v-model="record.product_duration" />
            </template>
            <template #product_price="{ record }">
              <a-input-number size="small" :disabled="!record.editable" v-model="record.product_price"
                placeholder="套餐价格" />
            </template>
            <template #video_url="{ record }">
              <!-- <video v-if="record.video_url" width="200">
                <source :src="record.video_url">
              </video> -->
              <a-space>
                <a-button v-if="record.video_url" target="_blank" :href="record.video_url">查看</a-button>
                <a-upload :headers="{ token }" :disabled="!record.editable" :action="uploadApi"
                  accept="video/mp4,video/x-m4v,video/*"
                  :fileList="[record.videoFile]" :show-file-list="false"
                  @change="(_, file) => { isLoading = file.status === 'init'; console.log('change', file) }"
                  @success="(file) => { onFileUploadSuccess(record, file) }" @error="() => { isLoading = false }">
                  <template #upload-button>
                    <a-button size="small" v-if="record.editable">上传</a-button>
                  </template>
                </a-upload>
              </a-space>

            </template>
            <template #product_status="{ record }">
              <a-tag size="small" v-if="record.product_status === 1" color="green">在线</a-tag>
              <a-tag size="small" v-else color="red">已下线</a-tag>
            </template>
            <template #optional="{ record }">
              <a-space direction="horizontal" size="small" v-if="record.id">
                <a-button size="small" v-if="record.editable" type="secondary" status="warning"
                  @click="() => { updateProductInfo(record) }">更新</a-button>
                <a-button size="small" type="primary" status="danger" @click="() => { toggleStatus(record) }">{{
                  record.product_status === 1 ? '下线' : '上线' }}</a-button>
              </a-space>
              <a-button size="small" type="primary" @click="() => { addProduct(record) }" v-else>新增</a-button>
            </template>
            <template #product_introduce="{ record }">
              <a-textarea placeholder="套餐简介" :disabled="!record.editable" v-model="record.product_introduce" auto-size />
            </template>
          </a-table>
          <a-pagination :pageSize="10" @change="getDataByPage" :current="curPage"
            :style='{ "justify-content": "flex-end" }' :total="total" />
        </a-layout-content>
      </a-layout>
    </template>
  </Layout>
</template>
    
<script lang="ts">
import { ref, onMounted, computed, reactive, watch } from "vue";
import { Message } from '@arco-design/web-vue';
import { useRouter } from 'vue-router';
import { getCourseVideoInfo, updatesProductInfo, addProductInfo } from "@/api/product";
import { API_BASE_URL } from '@/api/constants';
import { getToken } from '@/utils/auth';
import Layout from "@/components/Layout.vue";

export default {
  name: "App",
  components: {
    Layout,
  },
  setup() {
    const uploadApi = `${API_BASE_URL}/api/upload`;
    const router = useRouter();
    const route = router.currentRoute;
    const pageSize = 10;
    const total = ref(1);
    const curPage = ref(1);
    const isLoading = ref(false);
    const product_id = ref("");
    const product_name = ref("");

    watch(() => router.currentRoute.value, () => {
      product_id.value = router.currentRoute.value.query?.id as string || "";
      product_name.value = router.currentRoute.value.query?.name as string || "";
    }, { immediate: true });

    const currentStatus = ref("1,2");
    const statusOptions = [
      { label: '全部', value: '1,2' },
      { label: '在线', value: "1" },
      { label: '已下线', value: "2" },
    ]

    const columns = [
      {
        title: '排序',
        dataIndex: 'product_sort',
        width: 110,
        slotName: 'product_sort',
      },
      {
        title: "名称",
        dataIndex: "product_name",
        width: 150,
        slotName: 'product_name',
      },
      {
        title: "简介",
        dataIndex: "product_introduce",
        width: 250,
        slotName: 'product_introduce',
      },
      {
        title: "时长 (分钟)",
        dataIndex: "product_duration",
        width: 120,
        slotName: 'product_duration',
      },
      {
        title: "价格 (元)",
        dataIndex: "product_price",
        width: 120,
        slotName: "product_price",
      },
      {
        title: "视频 (mp4)",
        dataIndex: "video_url",
        width: 200,
        slotName: "video_url",
      },
      {
        title: "状态",
        dataIndex: "product_status",
        width: 60,
        slotName: "product_status",
      },
      {
        title: "操作",
        slotName: "optional",
      },
    ];
    const data = ref([]);

    onMounted(() => {
      getDataByPage(curPage.value);
    });

    function onChangeStatus() {
      curPage.value = 1;
      getDataByPage(1);
    }

    function toggleStatus(record: any) {
      // console.log('record :>> ', record);
      const { product_status, id } = record;
      const newStatus = product_status === 1 ? 2 : 1;
      updatesProductInfo({
        id,
        product_status: newStatus,
      }).then(() => {
        Message.success('更新成功');
        getDataByPage(curPage.value);
      });
    }

    function getDataByPage(page: number) {
      isLoading.value = true;
      curPage.value = page;
      getCourseVideoInfo(page, currentStatus.value, product_id.value).then((res: any) => {
        const outputData = res.list.map((item: any) => ({
          ...item,
          editable: item.product_status === 1,
          product_price: item.product_price / 100,
          videoFile: {
            url: item.video_url,
          },
        }))
        outputData.push({
          editable: true,
          product_name: '',
          product_sort: 9999,
          product_introduce: '',
          product_duration: 0,
          product_status: 1,
          product_price: 1,
          videoFile: {
            url: "",
          },
        });
        data.value = outputData;
        total.value = res.total;
        setTimeout(() => {
          isLoading.value = false;
        }, 500);
      });
    }

    function validateInfo(record: any) {
      const { product_name, product_introduce, product_sort, product_price, video_url, product_duration } = record;
      if (!product_name || !product_introduce) {
        Message.error('请填写完整的套餐信息');
        return false;
      }
      if (product_sort < 0 || product_sort > 9999) {
        Message.error('排序必须在0-9999之间');
        return false;
      }
      if (!video_url) {
        Message.error('请上传视频');
        return false;
      }
      if (product_name.length > 100) {
        Message.error('课程名称不能超过100个字符');
        return false;
      }
      if (product_introduce.length > 200) {
        Message.error('课程介绍不能超过200个字符');
        return false;
      }
      if (product_duration < 1 || product_duration > 120) {
        Message.error('时长必须在1-120分钟之间');
        return false;
      }
      if (product_price < 0 || (product_price) > 999999) {
        Message.error('价格必须在1-9999元之间');
        return false;
      }
      return true;
    }

    function updateProductInfo(record: any) {
      // console.log('record :>> ', record);
      if (!validateInfo(record)) {
        return;
      }

      const updateData = {
        id: record.id,
        product_sort: record.product_sort,
        product_name: record.product_name,
        product_introduce: record.product_introduce,
        product_duration: record.product_duration,
        product_price: (record.product_price) * 100,
        video_url: record.video_url,
      }

      isLoading.value = true;
      updatesProductInfo(updateData).then(res => {
        Message.success('更新成功');
        getDataByPage(curPage.value);
      });
    }

    function addProduct(record: any) {
      // console.log('record :>> ', record);
      if (!validateInfo(record)) {
        return;
      }

      const addData = {
        product_name: record.product_name,
        product_introduce: record.product_introduce,
        product_sort: record.product_sort,
        product_price: record.product_price * 100,
        product_duration: record.product_duration,
        product_status: 1,
        product_type: 2,
        parent_product_id: product_id.value,
        video_url: record.video_url,
      }

      isLoading.value = true;
      addProductInfo(addData).then(res => {
        Message.success('新增成功');
        getDataByPage(curPage.value);
      });
    }

    function onFileUploadSuccess(record: any, file: any) {
      record.video_url = file.response[0].url;
      isLoading.value = false;
      Message.success('上传成功');
    }

    return {
      columns,
      data,
      total,
      curPage,
      getDataByPage,
      statusOptions,
      currentStatus,
      onChangeStatus,
      isLoading,
      addProduct,
      updateProductInfo,
      toggleStatus,
      pageSize,
      uploadApi,
      product_name,
      console,
      onFileUploadSuccess,
      token: getToken()
    };
  },
};
</script>
    
<style scoped>
</style>
