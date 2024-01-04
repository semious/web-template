<template>
  <a-space class="basic-info" direction="vertical">
    <a-space class="desc-box" direction="vertical">
      <a-space class="desc-header">
        <div class="title">基本信息</div>
        <a-button type="primary" @click="addUser">
          修改基本样式
        </a-button>
      </a-space>
      <a-descriptions :column="1">
        <a-descriptions-item label="款式ID:">
          {{styleDetail.styleCode}}123
        </a-descriptions-item>
        <a-descriptions-item label="设计师:">
          {{styleDetail.designerName}}
        </a-descriptions-item>
        <a-descriptions-item label="纸样师:">
          {{styleDetail.paperUserName}}
        </a-descriptions-item>
        <a-descriptions-item label="创建时间:">
          {{styleDetail.createTime}}
        </a-descriptions-item>
        <a-descriptions-item label="更新时间:">
          {{styleDetail.updateTime}}
        </a-descriptions-item>
        <a-descriptions-item label="尺码数:">
          {{styleDetail.sizes.length}}
          {{handleSize(styleDetail.sizes)}}
        </a-descriptions-item>
        <a-descriptions-item label="标准码:">
          {{styleDetail.standardSize}}
        </a-descriptions-item>
        <a-descriptions-item label="纸样数:">
          {{styleDetail.partNum}}
        </a-descriptions-item>
      </a-descriptions>
    </a-space>

  </a-space>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
import { getStyleDetail } from "@/api/style";
const props = defineProps(["styleCode"]);
console.log("props", props);
const emit = defineEmits(["addUser"]);
const styleDetail = ref({
  id: "",
  styleCode: "",
  styleName: "",
  effectImg: "",
  paperUserId: "",
  paperUserName: "",
  designerId: "",
  designerName: "",
  sizes: [],
  standardSize: "",
  partNum: "",
  styleRemark: "",
  styleStatus: "",
  createTime: "",
  updateTime: "",
});

const getStyleDetailReq = (styleCode: any) => {
  getStyleDetail(styleCode).then((res: any) => {
    console.log("getStyleDetail", res);
    if (res && res.data) {
      styleDetail.value = res.data;
    }
  });
};

const addUser = () => {
  emit("addUser");
};
const handleSize = (sizes: any) => {
  if (sizes && sizes.length > 0) {
    return "（" + sizes.join(" ") + "）";
  } else {
    return "";
  }
};

defineExpose({
  getStyleDetailReq,
});
</script>
<style lang="less" scoped>
.basic-info {
  width: 308px;
  height: 404px;
  background: #ffffff;
  border-radius: 0px 0px 0px 0px;
  opacity: 1;
  display: flex;
  align-items: center;
  justify-content: center;
 
  .desc-header {
    height: 56px;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
  }
  .desc-box {
    width: 280px;
    border-radius: 0px 0px 0px 0px;
    opacity: 1;
    border: 1px solid #e5e6eb;
    margin: 0 auto;
    :deep(.arco-space-item) {
        margin-bottom: 0 !important;
    }
    :deep(.arco-descriptions-body) {
      .arco-descriptions-row {
        height: 40px;
        border-radius: 0px 0px 0px 0px;
        opacity: 1;
        border-top: 1px solid #e5e6eb;
        .arco-descriptions-item-label {
          padding: 0 !important;
          padding-left: 20px !important;
          color: #4e5969;
        }
        .arco-descriptions-item-value {
          padding: 0 !important;
          color: #1d2129;
        }
      }
    }
  }
  .title {
    font-size: 16px;
    font-weight: bolder;
    color: #1d2129;
  }
}
</style>
