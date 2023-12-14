<template>
  <Layout active="5">
    <template #content>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>样式配置</el-breadcrumb-item>
      </el-breadcrumb>
      <a-layout>
        <a-layout-header class="py-12">
          <!-- <a-input-search class="mr-6" :style="{ width: '250px' }" @change="onSearch" v-model="searchInput"
            placeholder="输入样式id搜索" search-button /> -->
          <a-space size="large">
            <a-radio-group @change="onChangeAppId" :options="options" />
            <a-button type="primary" @click="() => { router.push({ path: '/styles/new' }) }">新增</a-button>
          </a-space>
        </a-layout-header>
        <a-layout-content>
          <a-table :bordered="true" class="mb-12" :pagination="false" :columns="columns" :data="filterData"
            :stripe="true">
            <template #style_img_url="{ record }">
              <a-image width="120" :src="record.style_img_url" />
            </template>
            <template #optional="{ record }">
              <a-button type="primary" status="danger"
                @click="() => { router.push({ path: '/styles/' + record.id }) }">修改</a-button>
            </template>
          </a-table>
        </a-layout-content>
      </a-layout>
    </template>
  </Layout>
</template>
    
<script lang="ts">
import { ref, onMounted, computed, reactive, watch } from "vue";
import { ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';

import Layout from "@/components/Layout.vue";
import { queryImageStyle } from "@/api/imagestyle";

export default {
  name: "App",
  components: {
    Layout,
  },
  setup() {
    const router = useRouter();
    const route = router.currentRoute;
    const curPage = ref(1);
    let data: any = [];
    const filterData = ref([]);

    const columns = [
      {
        title: "应用",
        dataIndex: "appId",
        width: 100,
        // filterable: {
        //   filters: [{
        //     text: 'AI写真',
        //     value: 'WX002',
        //   }, {
        //     text: 'AI头像',
        //     value: 'WX001',
        //   }],
        //   filter: (value: any, record: any) => {
        //     console.log('value :>> ', value);
        //     console.log('record :>> ', record.app_id);
        //     return record.app_id === value[0]
        //   },
        //   multiple: true
        // },
        render: (item: any) => {
          return item.record.app_id === "WX002" ? "AI写真" : "AI头像";
        },
      },
      {
        title: "模板名称",
        dataIndex: "style_name",
        // width: 120,
      },
      {
        title: '模板封面',
        slotName: 'style_img_url',
        width: 120,
      },
      {
        title: "模板描述",
        dataIndex: "style_desc",
        width: 100,
        tooltip: true,
        ellipsis: true,
      },
      {
        title: "模型",
        dataIndex: "style_model",
        sortable: {
          sortDirections: ['ascend', 'descend']
        }
      },
      {
        title: '图生图配置',
        children: [
          {
            title: '提示词',
            dataIndex: 'img_prompt',
            tooltip: true,
            ellipsis: true,
          },
          {
            title: '配置',
            dataIndex: 'img_content',
            tooltip: true,
            ellipsis: true,
            render: (item: any) => {
              return item.record.img_content ? JSON.stringify(item.record.img_content, null, 2) : '';
            }
          }
        ]
      },
      {
        title: "文生图配置",
        children: [
          {
            title: '提示词',
            dataIndex: 'txt_prompt',
            tooltip: true,
            ellipsis: true,
          },
          {
            title: '配置',
            dataIndex: 'txt_content',
            tooltip: true,
            ellipsis: true,
            // width:200,
            render: (item: any) => {
              return item.record.txt_content && JSON.stringify(item.record.txt_content, null, 2);
            }
          }
        ]
      },
      {
        title: '状态',
        dataIndex: 'style_status',
        width: 100,
        // sortable: {
        //   sortDirections: ['ascend']
        // },
        filterable: {
          filters: [{
            text: '启用',
            value: 1,
          }, {
            text: '禁用',
            value: 2,
          }],
          filter: (value: any, record: any) => {
            console.log('value :>> ', value);
            console.log('record :>> ', record.style_status);
            return record.style_status === value[0]
          },
          multiple: true
        },
        render(item: any) {
          return item.record.style_status === 1 ? '启用' : '禁用';
        }
      },
      {
        title: '操作',
        slotName: 'optional',
      }
    ];

    const options = [
      { label: '所有应用', value: '' },
      { label: 'AI头像', value: 'WX001' },
      { label: 'AI写真', value: 'WX002' },
    ];

    onMounted(() => {
      getData();
    });

    const expandable = reactive({
      title: 'Expand',
      width: 80,
      expandedRowRender: (record: any) => {
        console.log('record :>> ', record);
        // if(record.key==='3'){
        // return `My Name is ${record.name}`
        // }
        return ''
      }
    });

    function getData() {
      queryImageStyle("1").then((res: any) => {
        // console.log('res :>> ', res);
        data = res;
        filterData.value = data;
      });
    }

    function onChangeAppId(value: any) {
      // console.log('value :>> ', value);
      if (value) {
        filterData.value = data.filter((item: any) => item.app_id === value);
        return;
      }
      filterData.value = data;
    }

    return {
      columns,
      data,
      curPage,
      getData,
      options,
      onChangeAppId,
      filterData,
      router,
      expandable,
    };
  },
};
</script>
    
<style scoped>
</style>
