<template>
  <a-layout class="container">
    <CodeSearch @searchKeyword="searchKeyword"></CodeSearch>
    <BasicInfo :styleId="styleId" @addUser="addUser"
      ref="basicInfoRef" v-show="showDetail"
      @showDetailInfo="showDetailInfo"></BasicInfo>

    <a-space style="margin-top: 12px;" v-show="showDetail">
      <div class="psb-box">
        <a-row justify="space-between">
          <a-col :span="22">
            <div class="desc">提示：这里是放提示语句的</div>
          </a-col>
          <a-col :span="2">
            <a-button type="primary" @click="splitLayer">
              全部解析
            </a-button>
          </a-col>

        </a-row>
        <a-table style="width: 1000px;margin-top: 18px;"
          :columns="psbColumns" :data="psbData"
          :pagination="false"
          :bordered="{wrapper: true, cell: true}">
          <template #statusOptional="{ record }">
            <div>{{calStatus(record.status)}}</div>
          </template>
          <template #cadUrlOptional="{ record }">
            <a-image v-if="record.cadUrl" width="67"
              :src="record.cadUrl" />
          </template>
          <template #optional="{ record }">
            <a-space>
              <a-button type="text" size="small"
                @click="viewLayer(record)">查看图层</a-button>
              <a-button type="text" size="small" @click="splitLayer(record)">解析图层</a-button>
            </a-space>

          </template>
        </a-table>
      </div>
    </a-space>
    <a-space style="margin-top: 20px;margin-left: 24px;"
      v-show="showLayers">
      <a-space>
        <a-button type="text" size="small"
          @click="checkAll">全选</a-button>
        <!-- <a-button type="text" size="small" @click="checkInvert">反选</a-button> -->
        <!-- <a-button type="text" size="small" @click="clearAll">清空选择</a-button> -->
      </a-space>
    </a-space>
    <a-space class="img-box" v-show="showLayers">
      <div class="img-item" v-for="(item,i) in layerList"
        :key="i" @click="checkItem(i)">
        <i class="check-i" v-if="hasCheck(i)"> <icon-check
            class="check" /></i>
        <a-image width="118" height="70" :src="item.imgSrc"
          :preview="false" />
        <div class="img-desc">{{item.name}}</div>
      </div>

    </a-space>

    <StyleAdd :userTitle="userTitle"
      :visibleAdd="visibleAdd" @closeDrawer="closeDrawer"
      :isModify="isModify">
    </StyleAdd>
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
  nextTick,
} from "vue";
import CodeSearch from "@/components/codeSearch/index.vue";
import StyleAdd from "@/components/styleAdd/index.vue";
import BasicInfo from "@/components/basicInfo/index.vue";
import { Message } from "@arco-design/web-vue";
import {
  getLayerList,
  getPartionListBySize,
  getLayerByPartionId,
  partionSplit,
} from "@/api/style";

const psbColumns = [
  {
    title: "纸样号",
    dataIndex: "partionNo",
    width: 75,
  },
  {
    title: "纸样名称",
    dataIndex: "remark",
    width: 100,
  },
  {
    title: "图层数",
    dataIndex: "totalNum",
    width: 100,
  },
  {
    title: "有效图层数",
    dataIndex: "validNum",
    width: 100,
  },
  {
    title: "CAD框图",
    dataIndex: "cadBlock",
    width: 116,
  },
  {
    title: "状态",
    dataIndex: "status",
    width: 116,
    slotName: "statusOptional",
  },
  {
    title: "缩略图",
    dataIndex: "cadUrl",
    width: 116,
    slotName: "cadUrlOptional",
  },
  {
    title: "操作",
    dataIndex: "",
    width: 180,
    slotName: "optional",
  },
];
const psbData = ref([]);

const visible = ref(false);
const showInput = ref(false);
const showDetail = ref(false);
const styleDetail = ref();
const styleId = ref();
const showLayers = ref(false);
const getPartionListBySizeReq = () => {
  getPartionListBySize(styleDetail.value.id, styleDetail.value.standardSize)
    .then((res: any) => {
      psbData.value = res.data || [];
    })
    .catch(() => {});
};

const showDetailInfo = (val: any) => {
  showDetail.value = true;
  styleDetail.value = val;
  getPartionListBySizeReq();
};

const visibleAdd = ref(false);
const userTitle = ref("");
const isModify = ref(0);
const addUser = (val: number) => {
  userTitle.value = "修改基本信息";
  visibleAdd.value = true;
  isModify.value = val;
};
const updateUser = () => {
  userTitle.value = "修改款式";
  visibleAdd.value = true;
};
const handleAddOk = () => {
  visibleAdd.value = false;
};
const handleAddCancel = () => {
  visibleAdd.value = false;
};
const delSizeName = (record) => {
  console.log("record", record);
  visible.value = true;
};
const editInputRef = ref(null);
const modifyName = (record) => {
  showInput.value = true;
  nextTick(() => {
    editInputRef.value.focus();
  });
};
const inputBlur = () => {
  showInput.value = false;
};

const checkList = ref([]);
const layerList = ref([]);
layerList.value = [];

const checkAll = () => {
  checkList.value = [];
  for (let i = 0, j = layerList.value.length; i < j; i++) {
    checkList.value.push(i);
  }
};

const checkIdx = (i) => {
  if (checkList.value.indexOf(i) >= 0) {
    let idx = checkList.value.indexOf(i);
    checkList.value.splice(idx, 1);
  } else {
    checkList.value.push(i);
  }
};

const checkInvert = () => {
  for (let i = 0, j = layerList.value.length; i < j; i++) {
    checkIdx(i);
  }
};

const clearAll = () => {
  checkList.value = [];
};

const checkItem = (i) => {
  checkIdx(i);
};
const hasCheck = (i) => {
  //   console.log("checkList", checkList.value);
  // console.log("checkList.value.indexOf(idx)",checkList.value.indexOf(idx))
  if (checkList.value.indexOf(i) >= 0) {
    return true;
  } else {
    return false;
  }
};

const basicInfoRef = ref<any>();
const searchKeyword = (val: any) => {
  styleId.value = val;
  basicInfoRef.value.getStyleDetailReq(styleId.value);
};

const closeDrawer = () => {
  visibleAdd.value = false;
};

const viewLayer = (record) => {
  showLayers.value = true;
  //record.partionNo
  getLayerByPartionId(record.id).then((res) => {

  });
};

const splitLayer = (record) => {
  partionSplit(record.id).then((res) => {
      if (res && res.retCode === 0) {
        Message.info("图层解析成功");
        getPartionListBySizeReq()
      } else {
        Message.info(res.retMsg || "图层解析失败，请稍后重试");
      }
  }).catch(()=> {
    Message.info(res.retMsg || "图层解析失败，请稍后重试");
  });
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
  .psb-box {
    width: 1065px;
    height: 270px;
    background: #ffffff;
    border-radius: 0px 0px 0px 0px;
    opacity: 1;
    padding: 24px;
    margin-left: 24px;

    .desc {
      font-size: 14px;
      font-weight: 400;
      color: #1d2129;
      line-height: 22px;
    }

    .opration-item {
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    .upload-info {
      display: flex;
      align-items: center;

      .upload-desc {
        font-size: 14px;
        font-weight: 400;
        color: #86909c;
        margin-left: 8px;
        line-height: 42px;
      }

      :deep(.arco-upload-wrapper) {
        font-size: 14px;
      }
    }

    :deep(.arco-input-wrapper) {
      padding-top: 0;
      padding-bottom: 0;
    }
  }

  .img-box {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    margin-left: 24px;

    .img-item {
      width: 118px;
      display: flex;
      flex-direction: column;
      margin-right: 2px;
      position: relative;

      .img-desc {
        margin-top: 7px;
        font-size: 16px;
        font-weight: 500;
        color: #1d2129;
        line-height: 24px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      .check-i {
        width: 14px;
        height: 14px;
        background: #165dff;
        border-radius: 2px 2px 2px 2px;
        opacity: 1;
        top: 50px;
        left: 8px;
        position: absolute;
        z-index: 9;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .check {
        color: #fff;
        font-size: 12px;
      }
    }
  }

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
      //   margin-right: 0 !important;
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
}
</style>