<template>
  <a-layout class="container">
    <CodeSearch @searchKeyword="searchKeyword"></CodeSearch>
    <BasicInfo :styleId="styleId" @addUser="addUser"
      ref="basicInfoRef" v-show="showDetail"
      @showDetailInfo="showDetailInfo"></BasicInfo>

    <a-space style="margin-top: 12px;" v-show="showDetail">
      <div class="psb-box">
        <div class="desc">提示：这里是放提示语句的</div>

        <a-space class="upload-info">
          <div class="desc">上传其他码CAD文件（已上传{{uploadCount}}
            待上传{{unUploadCount}}）</div>
          <a-upload :custom-request="customRequest"
            name="cad" :auto-upload="true"
            @success="onUploadCadSuccess"
            @error="onUploadCadError"
            :on-before-upload="beforeUpload"
            ref="fileUploadRef" :multiple="true">
            <template #upload-button>
              <a-button type="primary">上传</a-button>
            </template>
          </a-upload>
          <div class="upload-desc">文件命名规则为：1_s_后半裙.jpg</div>
        </a-space>
        <a-table
          style="width: auto;margin-top: 18px;display: flex;"
          :columns="psbColumns" :data="psbData"
          :pagination="false" :bordered="{cell:true}">
          <template v-for="(item, i) in slots" :key="i"
            #[item.slotName]="{ record }">
            <div class="opration-item"
              v-if="record[item.dataIndex]"
              @click="delSizeName(record[item.dataIndex])">
              {{subImgName(record[item.dataIndex] && record[item.dataIndex].cadUrl)}}<icon-delete />
            </div>
          </template>
        </a-table>
      </div>
      <div></div>
    </a-space>
    <a-modal v-model:visible="visible" @ok="handleOk"
      @cancel="handleCancel">
      <template #title>
        是否删除该纸样
      </template>
      <div>删除该纸样</div>
    </a-modal>
    <StyleAdd :userTitle="userTitle"
      :visibleAdd="visibleAdd" @closeDrawer="closeDrawer"
      :isModify="isModify" ref="styleAddRef">
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
import {
  uploadCad,
  modifyPartionRemark,
  getPartionListByStyleId,
  deletePartion,
} from "@/api/style";
import { Message } from "@arco-design/web-vue";
// import { StyleDetailInfo } from "@/api/typing";
import { subImgName } from "@/utils/common";
import { API_BASE_URL } from "@/api/constants";

const psbColumns = ref([
  {
    title: "纸样号",
    dataIndex: "partionNo",
    width: 75,
  },
  {
    title: "纸样名",
    dataIndex: "remark",
    width: 135,
    slotName: "nameOptional",
  },
]);
const slots = ref([]);
const tagStatus = ref("");
const psbData = ref([]);
const tagValue = ref("");
const visible = ref(false);
const showInput = ref(false);
const showDetail = ref(false);
const styleDetail = ref();
const uploadCount = ref(0);
const unUploadCount = ref(0);
const partionId = ref();

const getNewArr = (arr: any) => {
  let list = arr,
    flag = 0,
    data = [];
  for (let i = 0; i < list.length; i++) {
    let az = "";
    for (let j = 0; j < data.length; j++) {
      if (data[j][0].partionNo == list[i].partionNo) {
        flag = 1;
        az = j;
        break;
      }
    }
    if (flag == 1) {
      data[az].push(list[i]);
      flag = 0;
    } else if (flag == 0) {
      let wdy = new Array();
      wdy.push(list[i]);
      data.push(wdy);
    }
  }
  console.log("getNewArr", data);
  return data;
};

const getPartionListBySizeReq = () => {
  getPartionListByStyleId(styleDetail.value.id)
    .then((res: any) => {
      let tempList = res.data || [];
      let classifyData = getNewArr(tempList);
      console.log("classifyData", classifyData);
      psbData.value = [];
      for (let m = 0, n = classifyData.length; m < n; m++) {
        let classifyTemp = classifyData[m];

        if (classifyTemp && classifyTemp.length > 0) {
          console.log("classifyTemp", classifyTemp);
          let psbDataTemp = {};
          console.log("psbDataTemp")
          for (let o = 0, p = classifyTemp.length; o < p; o++) {
            let tempItem = classifyTemp[o];
            console.log("tempItem", tempItem);
            let indexOf = styleDetail.value.sizes.indexOf(tempItem.size)
            console.log("isExist",indexOf)
            
            if (styleDetail.value.sizes.indexOf(tempItem.size) >= 0) {
              if (o == 0) {
                psbDataTemp["partionNo"] = tempItem.partionNo;
                psbDataTemp["remark"] = tempItem.remark;
              }
              psbDataTemp[tempItem.size + "Index"] = tempItem;
              console.log("psbDataTemp", psbDataTemp);
              
            }
          }
          
          if(JSON.stringify(psbDataTemp) !== "{}") {
            psbData.value.push(psbDataTemp);
          }
          
        }
      }
      console.log("psbData", psbData);
      uploadCount.value = psbData.value.length;
      if (styleDetail && styleDetail.value.partNum) {
        let partNum =
          styleDetail.value.partNum * styleDetail.value.sizes.length;
        unUploadCount.value = Number(partNum) - Number(uploadCount.value);
      }
    })
    .catch(() => {
      uploadCount.value = 0;
      if (styleDetail && styleDetail.value.partNum) {
        let partNum =
          styleDetail.value.partNum * styleDetail.value.sizes.length;
        unUploadCount.value = Number(partNum) - Number(uploadCount.value);
      }
    });
};

const showDetailInfo = (val: any) => {
  showDetail.value = true;
  styleDetail.value = val;
  // let tempItem = {
  //   title: styleDetail.value.standardSize,
  //   dataIndex: styleDetail.value.standardSize + "Index",
  //   width: 170,
  //   slotName: styleDetail.value.standardSize + "Optional",
  // };
  // slots.value.push({
  //   dataIndex: styleDetail.value.standardSize + "Index",
  //   slotName: styleDetail.value.standardSize + "Optional",
  // });
  // psbColumns.value.push(tempItem);
  if (styleDetail.value.sizes) {
    for (let i = 0, j = styleDetail.value.sizes.length; i < j; i++) {
      let item = {
        title: styleDetail.value.sizes[i],
        dataIndex: styleDetail.value.sizes[i] + "Index",
        width: 170,
        slotName: styleDetail.value.sizes[i] + "Optional",
      };
      slots.value.push({
        dataIndex: styleDetail.value.sizes[i] + "Index",
        slotName: styleDetail.value.sizes[i] + "Optional",
      });
      psbColumns.value.push(item);
    }
  }
  getPartionListBySizeReq();
};

const handleOk = () => {
  visible.value = false;
  deletePartion(partionId.value)
    .then((res) => {
      if (res && res.retCode === 0) {
        Message.info("删除纸样成功");
      } else {
        Message.info(res.retMsg || "删除纸样失败，请稍后重试");
      }
      getPartionListBySizeReq();
    })
    .catch(() => {
      Message.info("删除纸样失败，请稍后重试");
      getPartionListBySizeReq();
    });
};

const handleCancel = () => {
  visible.value = false;
};

const visibleAdd = ref(false);
const userTitle = ref("");
const isModify = ref(0);
const styleId = ref();
const styleAddRef = ref(null);
const addUser = (val: number) => {
  userTitle.value = "修改基本信息";
  visibleAdd.value = true;
  isModify.value = 1;
  styleId.value = val;
  styleAddRef.value.getStyleDetailReq(styleId.value);
};

const delSizeName = (record) => {
  console.log("record", record);
  visible.value = true;
  partionId.value = record.id;
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
  let params = {
    partionId: "",
    remark: showInput.value,
  };
  modifyPartionRemark(params).then((res) => {
    console.log("modifyPartionRemark", res);
  });
};

const basicInfoRef = ref<any>();
const searchKeyword = (val: any) => {
  styleId.value = val;
  basicInfoRef.value.getStyleDetailReq(styleId.value);
};

const closeDrawer = () => {
  visibleAdd.value = false;
};

const loading = ref(false);
const fileList = ref([]);
// let sizestest = "xxs|xxxl";
// let preg1 = new RegExp( "^\\d{0,}[_]{1}("+sizestest+ ")[_]{1}[\\u4e00-\\u9fa5]{0,}\\.(jpg|png|jpeg)");
// console.log("preg1--test---",preg1.test("1_xxxll_测试.jpg"))
const fileUploadRef = ref();
const beforeUpload = (fileItem) => {
  console.log("file", fileItem);
  let name = fileItem.name;
  const sizes = styleDetail.value.sizes.join("|");
  // const preg =/^\d{0,}[_]{1}(xxs|xxxl)[_]{1}[\u4e00-\u9fa5]{0,}\.(jpg|png|jpeg)/;
  let preg = new RegExp( "^\\d{0,}[_]{1}("+sizes.toLowerCase()+ ")[_]{1}[\\u4e00-\\u9fa5]{0,}\\.(jpg|png|jpeg)");
  console.log("preg",preg)
  if (preg.test(name)) {
    loading.value = true;
    let item = {
      name: fileItem.name,
    };
    fileList.value.push(item);
    console.log("fileList", fileList);
    return true;
  } else {
    Message.info(
      "文件命名不规则，规则为：1_" +
        styleDetail.value.sizes[0].toLowerCase() +
        "_后半裙.jpg"
    );
    return false;
  }
};
const customRequest = (option: any) => {
  const {onProgress, onError, onSuccess, fileItem, name} = option;
  console.log("fileItem :>> ", fileItem,"name",name);

  let params = {
    styleId: styleId.value,
    cad: fileItem.file,
  };

  console.log("params", params);

  // uploadCad(params)
  //   .then((res: any) => {
  //     console.log("uploadPsb", res);
  //     if (res && res.retCode === 0) {
  //       Message.info("上传CAD文件成功");
  //     } else {
  //       Message.info(res.retMsg || "上传CAD文件失败，请稍后重试");
  //     }
  //     fileList.value = [];
  //     loading.value = false;
  //     getPartionListBySizeReq();
  //   })
  //   .catch(() => {
  //     fileList.value = [];
  //     loading.value = false;
  //     Message.info("上传CAD文件失败，请稍后重试");
  //     getPartionListBySizeReq();
  //   });

    const xhr = new XMLHttpRequest();
      if (xhr.upload) {
        xhr.upload.onprogress = function (event) {
          let percent;
          if (event.total > 0) {
            // 0 ~ 1
            percent = event.loaded / event.total;
          }
          onProgress(percent, event);
        };
      }
      xhr.onerror = function error(e) {
        onError("上传失败");
        getPartionListBySizeReq();
      };
      xhr.onload = function onload() {
        if (xhr.status < 200 || xhr.status >= 300) {
          getPartionListBySizeReq();
          return onError("上传失败");
        }
        if (xhr.readyState == 4 && xhr.status == 200) {
          console.log("xhr",xhr,xhr.responseText);
          let responseText = JSON.parse(xhr.responseText);
          if(responseText && responseText.retCode === 0) {
            Message.info("上传CAD文件成功");
            onSuccess("上传成功");
          } else {
            Message.info(responseText.retMsg || "上传CAD文件失败，请稍后重试");
            onError("上传失败")
          }
          getPartionListBySizeReq();
        } else {
          getPartionListBySizeReq();
        }
        
      };

      const formData = new FormData();
      formData.append("styleId",styleId.value)
      formData.append(name || "cad", fileItem.file);
      xhr.open('post', API_BASE_URL + '/clothes/upload/cad', true);
      xhr.send(formData);

      return {
        abort() {
          xhr.abort()
        }
      }
};
const onUploadCadSuccess = (fileItem: any) => {
  loading.value = false;
};
const onUploadCadError = (fileItem: any) => {
  loading.value = false;
};
</script>
<style lang="less" scoped>
.container {
  .psb-box {
    width: 1065px;
    height: 384px;
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
      :deep(.arco-upload-list-item-uploading) {
        display: none;
      }
    }
    :deep(.arco-input-wrapper) {
      padding-top: 0;
      padding-bottom: 0;
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
}
</style>