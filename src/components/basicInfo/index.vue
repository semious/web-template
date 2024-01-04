<template>
    <a-row class="basic-info" justify="space-between">
     <a-col :span="3">
       <div class="title">基本信息</div>
     </a-col>
     <a-col :span="18">
       <a-descriptions :column="4" table-layout="fixed">
         <a-descriptions-item label="款式ID:">
           {{styleDetail.styleCode}}
         </a-descriptions-item>
         <a-descriptions-item label="标准码:">
           {{styleDetail.standardSize}}
         </a-descriptions-item>
         <a-descriptions-item label="创建时间:">
           {{styleDetail.createTime}}
         </a-descriptions-item>
         <a-descriptions-item label="纸样师:">
           {{styleDetail.paperUserName}}
         </a-descriptions-item>
         

       </a-descriptions>
       <a-descriptions :column="4" table-layout="fixed">
         <a-descriptions-item label="尺码数:">
           {{styleDetail.sizes.length}}
           {{handleSize(styleDetail.sizes)}}
         </a-descriptions-item>
         
         <a-descriptions-item label="纸样数:">
           {{styleDetail.partNum}}
         </a-descriptions-item>
         <a-descriptions-item label="更新时间:">
           {{styleDetail.updateTime}}
         </a-descriptions-item>
         <a-descriptions-item label="设计师:">
           {{styleDetail.designerName}}
         </a-descriptions-item>
         
         
         
       </a-descriptions>
     </a-col>
     <a-col :span="3">
       <a-button type="dashed" @click="addUser">
         修改基本样式
       </a-button>
     </a-col>
   </a-row>
</template>
<script lang="ts" setup>
import {
 ref, watch
} from "vue";
import { getStyleDetail } from "@/api/style";
const props = defineProps(["styleCode"]);
console.log("props", props);
const emit = defineEmits(["addUser"])
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


const getStyleDetailReq = (styleCode:any) => {
 getStyleDetail(styleCode).then((res: any) => {
   console.log("getStyleDetail", res);
   if (res && res.data) {
     styleDetail.value = res.data;
   }
 });
};

const addUser = () => {
   emit("addUser",1)
}
const handleSize = (sizes: any) => {
 if (sizes && sizes.length > 0) {
   return "（" + sizes.join(" ") + "）";
 } else {
   return "";
 }
};

defineExpose({
   getStyleDetailReq,
})

</script>
<style lang="less" scoped>
 .basic-info {
   width: 1065px;
   padding: 18px 0;
   background: #ffffff;
   margin-top: 30px;
   align-items: center;
   margin-left: 24px;
   :deep(.arco-descriptions-body) {
      .arco-descriptions-row {
        height: 40px;
        border-radius: 0px 0px 0px 0px;
        opacity: 1;
        .arco-descriptions-item-label {
          padding: 0 !important;
          color: #1D2129;
          width: 65px;
        }
        .arco-descriptions-item-value {
          padding: 0 !important;
          color: #1D2129;
        }
      }
    }
   .title {
     font-size: 16px;
     font-weight: bolder;
     color: #1d2129;
     text-align: center;
   }
 }
</style>
