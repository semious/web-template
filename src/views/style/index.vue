<template>
  <a-layout class="container">
    <CodeSearch @searchKeyword="searchKeyword"></CodeSearch>
    <a-space style="margin-top:30px;">
      <div class="text">筛选</div>
      <a-radio-group v-model="tagValue" type="button">
        <a-radio value="1"
          @click="timeFilter(1)">最近一周更新</a-radio>
        <a-radio value="2"
          @click="timeFilter(2)">最近一月更新</a-radio>
        <a-radio value="3"
          @click="timeFilter(3)">最近一周新增</a-radio>
        <a-radio value="4"
          @click="timeFilter(4)">最近一月新增</a-radio>
        <a-radio value="all"
          @click="timeFilter()">全部</a-radio>
      </a-radio-group>
    </a-space>
    <a-space style="margin-top:20px;">
      <a-radio-group v-model="tagStatus" type="button">
        <a-radio value="1"
          @click="filterStatus(1)">初始</a-radio>
        <a-radio value="2"
          @click="filterStatus(2)">已上传</a-radio>
        <a-radio value="3"
          @click="filterStatus(3)">生成中</a-radio>
        <a-radio value="4"
          @click="filterStatus(4)">已完成</a-radio>
        <a-radio value="all"
          @click="filterStatus()">全部</a-radio>
      </a-radio-group>
    </a-space>
    <a-space style="margin-top: 27px;">
      <a-button type="primary" @click="addUser">
        <template #icon>
          <icon-plus />
        </template>
        新增款式
      </a-button>
    </a-space>
    <a-table style="margin-top: 24px;width: 1230px;"
      filter-icon-align-left :columns="columns" :data="data"
      :pagination="false" @cell-click="cellClick">
      <template #imgOptional="{ record }">
        <a-image width="80" :src="record.effectImg" />
      </template>
      
      <template #createTimeOptional="{ record }">
        <div> {{formatDateInfo(record.createTime)}}</div>
      </template>
      <template #statusOptional="{ record }">
        <div> {{calStatus(record.styleStatus)}}</div>
      </template>
      <template #optional="{ record }">
        <a-button type="text" size="small"
          @click="deleteUser(record.id)">删除</a-button>
        <a-button type="text" size="small"
          @click="updateUser(record.id)">修改</a-button>
      </template>
    </a-table>
    <a-pagination :total="total" show-total
      @change="pageChange" />
    <a-modal v-model:visible="visible" @ok="handleOk"
      @cancel="handleCancel">
      <template #title>
        是否禁用该用户
      </template>
      <div>禁用该用户后则该用户无法登录</div>
    </a-modal>
    <a-modal v-model:visible="visibleDelete"
      @ok="handleDeleteOk" @cancel="handleDeleteCancel">
      <template #title>
        是否删除该款式
      </template>
      <div>是否删除该款式</div>
    </a-modal>
    <StyleAdd :userTitle="userTitle"
      :visibleAdd="visibleAdd" @closeDrawer="closeDrawer"
      :isModify="isModify" ref="styleAddRef"></StyleAdd>
  </a-layout>
</template>
<script lang="ts" setup>
import {
  ref,
  onMounted,
  computed,
  reactive,
  watch,
  onUpdated,
  onUnmounted,
} from "vue";
import { useRouter } from 'vue-router';

import { getStyleList, deleteStyle } from "@/api/style";
import CodeSearch from "@/components/codeSearch/styleSearch.vue";
import StyleAdd from "@/components/styleAdd/index.vue";

import { Message } from "@arco-design/web-vue";
import { formatDate } from "@/utils/format";
const formatDateInfo = (dateTime: any) => {
  return formatDate(dateTime);
};
const router = useRouter();
const columns = [
  {
    title: "款式编号",
    dataIndex: "styleCode",
    width: 125,
    slotName: "codeOptional",
  },
  {
    title: "名称",
    dataIndex: "styleName",
    width: 130,
    slotName: "nameOptional",
  },
  {
    title: "客户",
    dataIndex: "customer",
    width: 100,
  },
  {
    title: "新增时间",
    dataIndex: "createTime",
    slotName: "createTimeOptional",
    width: 170,
  },
  {
    title: "纸样师",
    dataIndex: "paperUserName",
    width: 120,
  },
  {
    title: "设计师",
    dataIndex: "designerName",
    width: 120,
  },
  {
    title: "效果图",
    dataIndex: "effectImg",
    slotName: "imgOptional",
    width: 80,
  },
  {
    title: "状态",
    dataIndex: "styleStatus",
    width: 80,
    slotName: "statusOptional",
  },
  {
    title: "备注",
    dataIndex: "styleRemark",
    width: 100,
  },
  {
    title: "操作",
    slotName: "optional",
    width: 160,
    align: "center",
  },
];
const tagStatus = ref("");
const data = ref([]);
const tagValue = ref("");

const visible = ref(false);
const deleteId = ref("");

const disabledEnabled = () => {
  visible.value = true;
};

const handleOk = () => {
  visible.value = false;
};

const handleCancel = () => {
  visible.value = false;
};

const visibleDelete = ref(false);
const deleteUser = (id: any) => {
  visibleDelete.value = true;
  deleteId.value = id;
};

const handleDeleteOk = () => {
  visibleDelete.value = false;
  deleteStyle(deleteId.value)
    .then((res: any) => {
      if (res && res.retCode === 0) {
        Message.info("删除款式成功");
        deleteId.value = "";
        getStyleListReq();
      } else {
        Message.info("删除款式失败，请稍后重试");
      }
    })
    .catch(() => {
      Message.info("删除款式失败，请稍后重试");
    });
};
const handleDeleteCancel = () => {
  visibleDelete.value = false;
};
const visibleAdd = ref(false);
const userTitle = ref("");
const addUser = () => {
  userTitle.value = "新增款式";
  visibleAdd.value = true;
  isModify.value = 0;
};
const isModify = ref(0);
const styleId = ref(0);
const styleAddRef = ref(null);
const updateUser = (val: number) => {
  userTitle.value = "修改款式";
  visibleAdd.value = true;
  isModify.value = 1;
  styleId.value = val;
  styleAddRef.value.getStyleDetailReq(styleId.value);
};
const closeDrawer = () => {
  visibleAdd.value = false;
  getStyleListReq();
};

const queryParams = ref({
  styleCode: "",
  timeFilter: "",
  status: "",
  pageNo: 1,
});
const total = ref(0);
const getStyleListReq = () => {
  getStyleList(queryParams.value).then((res: any) => {
    console.log("getStyleList", res);
    if (res && res.data) {
      total.value = res.data.total || 0;
      data.value = res.data.records || [];
    }
  });
};
getStyleListReq();

const pageChange = (val: number) => {
  console.log("pageChange", val);
  queryParams.value.pageNo = val;
  getStyleListReq();
};

const searchKeyword = (val: any) => {
  queryParams.value.styleCode = val;
  getStyleListReq();
};

const timeFilter = (val: any) => {
  queryParams.value.timeFilter = val;
  getStyleListReq();
};

const filterStatus = (val: any) => {
  queryParams.value.status = val;
  getStyleListReq();
};

const cellClick = (row,column) => {
  let dataIndex = column.dataIndex;
  switch(dataIndex) {
    case "styleCode":
        router.push({ name: "Create" });
        break;
    case "styleName":
        router.push({ name: "Create" });
        break;
  }
};

const statusList = {
  1: "未分解图层",
  2: "未筛选图层",
  3: "待缩放",
  4: "缩放完成",
  5: "生成完成",
};
const calStatus = (status) => {
  return statusList[status] || "";
};
</script>
<style lang="less" scoped>
.container {
  padding: 24px 0 0 46px;

  :deep(.arco-space) {
    display: flex;
    font-size: 32px;

    .search-input {
      width: 388px;
      height: 32px;
      background: #ffffff;
      border-radius: 2px 2px 2px 2px;
      opacity: 1;
    }

    .arco-space-item {
      margin-right: 0 !important;
    }

    .text {
      font-size: 14px;
      font-weight: 400;
      color: #1d2129;
      padding-right: 20px;
      line-height: 32px;
    }

    .tag-content {
      height: 32px;
      background: #f2f3f5;
      border-radius: 2px 2px 2px 2px;
      opacity: 1;
      display: flex;
    }

    .arco-tag-size-large {
      line-height: 32px !important;
    }

    .tag-checked {
      background: #ffffff !important;
      border-radius: 2px 2px 2px 2px;
      opacity: 1;
    }
  }

  .arco-pagination {
    width: 1230px;
    padding: 10px 0;
    justify-content: flex-end;
  }
}
</style>