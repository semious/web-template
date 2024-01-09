<template>
  <a-layout class="container">
    <a-space>
      <a-button type="primary">全部生成</a-button>
      <a-button type="primary" style="margin-left: 26px;"
        @click="downloadAll">全部下载</a-button>
    </a-space>

    <a-space style="margin-top: 16px;">
      <div class="psb-box">
        <a-table style="width: 1160px;margin-top: 18px;"
          :columns="psbColumns" :data="psbData"
          :pagination="false"
          :bordered="{wrapper: true, cell: true}">
          <template #XSOptional="{ record }">
            <a-space>
              <a-button type="text"
                size="small">立即生成</a-button>
            </a-space>

          </template>
        </a-table>
      </div>
    </a-space>
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
import axios from "axios";

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
    title: "XS",
    dataIndex: "XSName",
    width: 155,
    slotName: "XSOptional",
  },
  {
    title: "M",
    dataIndex: "MName",
    width: 155,
    slotName: "MOptional",
  },
  {
    title: "L",
    dataIndex: "LName",
    width: 155,
    slotName: "LOptional",
  },
  {
    title: "XL",
    dataIndex: "XLName",
    width: 155,
    slotName: "XLOptional",
  },
  {
    title: "XXL",
    dataIndex: "XXLName",
    width: 155,
    slotName: "XXLOptional",
  },
  {
    title: "状态提示",
    dataIndex: "statusTip",
    width: 180,
    slotName: "optional",
  },
];
const psbData = [
];


const downloadImage = (imageUrl: string) => {
  console.log("url :>> ", imageUrl);
  axios({
    url: imageUrl,
    method: "GET",
    responseType: "blob", // important
  }).then((response) => {
    let blob = new Blob([response.data], { type: "image/png" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    const filename = imageUrl.split("/").pop();
    link.download = filename || "image.png";
    link.click();
  });
};
const downloadAll = (list: any) => {
  list.forEach((item: any) => {
    downloadImage(item);
  });
};
</script>
<style lang="less" scoped>
.container {
  padding: 24px 0 0 24px;
  .basic-info {
    width: 1065px;
    padding: 18px 0;
    background: #ffffff;
    margin-top: 30px;
    align-items: center;
    .title {
      font-size: 16px;
      font-weight: bolder;
      color: #1d2129;
      text-align: center;
    }
  }
  .psb-box {
    width: 1200px;
    height: 238px;
    background: #ffffff;
    border-radius: 0px 0px 0px 0px;
    opacity: 1;
    padding: 24px;
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
    .img-item {
      width: 118px;
      display: flex;
      flex-direction: column;
      margin-right: 2px;
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