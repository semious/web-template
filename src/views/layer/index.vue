<template>
  <a-layout class="container">
    <CodeSearch @searchKeyword="searchKeyword"></CodeSearch>
    <BasicInfo :styleCode="styleCode" @addUser="addUser"
      ref="basicInfoRef"></BasicInfo>

    <a-space style="margin-top: 12px;">
      <div class="psb-box">
        <a-row justify="space-between">
          <a-col :span="22">
            <div class="desc">提示：这里是放提示语句的</div>
          </a-col>
          <a-col :span="2">
            <a-button type="primary">
              全部解析
            </a-button>
          </a-col>

        </a-row>
        <a-table style="width: 1000px;margin-top: 18px;"
          :columns="psbColumns" :data="psbData"
          :pagination="false"
          :bordered="{wrapper: true, cell: true}">

          <template #optional="{ record }">
            <a-space>
              <a-button type="text"
                size="small" @click="viewLayer">查看图层</a-button>
              <a-button type="text"
                size="small">解析图层</a-button>
            </a-space>

          </template>
        </a-table>
      </div>
    </a-space>
    <a-space style="margin-top: 20px;margin-left: 24px;">
      <a-space>
        <a-button type="text" size="small"
          @click="checkAll">全选</a-button>
        <a-button type="text" size="small"
          @click="checkInvert">反选</a-button>
        <a-button type="text" size="small"
          @click="clearAll">清空选择</a-button>
      </a-space>
    </a-space>
    <a-space class="img-box">
      <div class="img-item" v-for="(item,i) in layerList"
        :key="i" @click="checkItem(i)">
        <i class="check-i" v-if="hasCheck(i)"> <icon-check
            class="check" /></i>
        <a-image width="118" height="70" :src="item.imgSrc"
          :preview="false" />
        <div class="img-desc">{{item.name}}</div>
      </div>

    </a-space>
    <a-modal v-model:visible="visible" @ok="handleOk"
      @cancel="handleCancel">
      <template #title>
        是否删除该纸样
      </template>
      <div>删除该纸样</div>
    </a-modal>
    <a-modal v-model:visible="visibleDelete"
      @ok="handleDeleteOk" @cancel="handleDeleteCancel">
      <template #title>
        是否删除该用户
      </template>
      <div>删除该用户后需要重新添加账号才可以登录</div>
    </a-modal>
    <StyleAdd :userTitle="userTitle"
      :visibleAdd="visibleAdd" @closeDrawer="closeDrawer">
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
import { getLayerList } from "@/api/style";

const psbColumns = [
  {
    title: "纸样号",
    dataIndex: "patternNumber",
    width: 75,
  },
  {
    title: "纸样名称",
    dataIndex: "patternName",
    width: 100,
  },
  {
    title: "图层数",
    dataIndex: "layerNumber",
    width: 100,
  },
  {
    title: "有效图层数",
    dataIndex: "vaildLayer",
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
  },
  {
    title: "缩略图",
    dataIndex: "thumbnail",
    width: 116,
  },
  {
    title: "操作",
    dataIndex: "",
    width: 180,
    slotName: "optional",
  },
];
const tagStatus = ref("");
const psbData = [
  {
    patternNumber: 1,
    patternName: "",
    layerNumber: "",
    vaildLayer: "",
    cadBlock: "",
    status: "",
    thumbnail: "",
  },
];
const tagValue = ref("");

const visible = ref(false);
const showInput = ref(false);

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
const deleteUser = () => {
  visibleDelete.value = true;
};
const handleDeleteOk = () => {
  visibleDelete.value = false;
};
const handleDeleteCancel = () => {
  visibleDelete.value = false;
};

const visibleAdd = ref(false);
const userTitle = ref("");
const addUser = () => {
  userTitle.value = "修改基本信息";
  visibleAdd.value = true;
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
layerList.value = [
  {
    imgSrc:
      "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp",
    name: "测试1",
  },
  {
    imgSrc:
      "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp",
    name: "测试2",
  },
  {
    imgSrc:
      "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp",
    name: "测试3",
  },
  {
    imgSrc:
      "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp",
    name: "测试4",
  },
  {
    imgSrc:
      "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp",
    name: "测试5",
  },
  {
    imgSrc:
      "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp",
    name: "测试6",
  },
  {
    imgSrc:
      "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp",
    name: "测试7",
  },
  {
    imgSrc:
      "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp",
    name: "测试8",
  },
  {
    imgSrc:
      "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp",
    name: "测试9",
  },
  {
    imgSrc:
      "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp",
    name: "测试10",
  },
];

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
const styleCode = ref();
const searchKeyword = (val: any) => {
  styleCode.value = val;
  basicInfoRef.value.getStyleDetailReq(styleCode.value)
};

const closeDrawer = () => {
  visibleAdd.value = false;
};

const viewLayer = ()=> {
    getLayerList({
        partionId: ""
    }).then((res)=> {

    })
}
</script>
    <style lang="less" scoped>
.container {
//   padding: 24px 0 0 46px;
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