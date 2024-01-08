<template>
  <a-layout class="container">
    <CodeSearch @searchKeyword="searchKeyword"></CodeSearch>
    <BasicInfo :styleId="styleId" @addUser="addUser"
      ref="basicInfoRef" @showDetailInfo="showDetailInfo"
      v-show="showDetail"></BasicInfo>
    <a-space style="margin-top: 12px;margin-left: 24px;"
      v-show="showDetail">
      <div class="psb-box">
        <div class="desc">上传标准码psb文件（已上传{{uploadCount}}
          待上传{{unUploadCount}}）</div>
        <a-space class="upload-info">
          <a-upload :custom-request="customRequest"
            name="psd" :auto-upload="true"
            @success="onUploadCadSuccess"
            @error="onUploadCadError"
            :on-before-upload="beforeUpload" :limit="1" ref="fileUploadRef">
            <template #upload-button>
              <a-button type="primary">上传</a-button>
            </template>
          </a-upload>
          <div class="upload-desc">文件命名规则为：1_s_后半裙.psb</div>
        </a-space>
        <a-table style="width: 392px;margin-top: 18px;"
          :columns="psbColumns" :data="psbData"
          :pagination="false">
          <template #sizeOptional="{ record }">
            <div class="opration-item"
              @click="delSizeName(record)">
              {{record.sizeName}}
              <icon-delete />
            </div>

          </template>
          <template #nameOptional="{ record }">
            <div v-if="!showInput" class="opration-item"
              @click="modifyName(record)">
              {{record.patternName}}
              <icon-edit />
            </div>
            <a-input v-else ref="editInputRef"
              :style="{width:'100px'}" placeholder="输入纸样名称"
              allow-clear @blur="inputBlur"
              @press-enter="inputBlur" />
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
    <a-modal v-model:visible="visibleDelete"
      @ok="handleDeleteOk" @cancel="handleDeleteCancel">
      <template #title>
        是否删除该用户
      </template>
      <div>删除该用户后需要重新添加账号才可以登录</div>
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
import { uploadPsb, getPartionListBySize,deletePartion, modifyPartionRemark } from "@/api/style";
import CodeSearch from "@/components/codeSearch/index.vue";
import StyleAdd from "@/components/styleAdd/index.vue";
import BasicInfo from "@/components/basicInfo/index.vue";
import { Message } from "@arco-design/web-vue";
const showDetail = ref(false);
const styleDetail = ref();
const uploadCount = ref(0);
const unUploadCount = ref(0);
const psbColumns = ref([]);
psbColumns.value = [
  {
    title: "纸样号",
    dataIndex: "partionNo",
    width: 75,
  },
  {
    title: "",
    dataIndex: "remark",
    width: 180,
    slotName: "sizeOptional",
  },
  {
    title: "纸样名",
    dataIndex: "remark",
    width: 135,
    slotName: "nameOptional",
  },
];

const fileList = ref([]);
const defaultFileList = ref();
const fileUploadRef = ref()
const psbData = ref([]);
const getPartionListBySizeReq = () => {
  getPartionListBySize(
    styleDetail.value.id,
    styleDetail.value.standardSize
  ).then((res:any) => {
    psbData.value = res.data || [];
    if (styleDetail && styleDetail.value.partNum) {
      unUploadCount.value = styleDetail.value.partNum;
    }
  });
};

const showDetailInfo = (val: any) => {
  showDetail.value = true;
  styleDetail.value = val;
  psbColumns.value[1].title = styleDetail.value.standardSize;
  getPartionListBySizeReq();
};

const tagStatus = ref("");

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

const updateUser = () => {
  userTitle.value = "修改款式";
  visibleAdd.value = true;
};
const partionId = ref();
const handleAddOk = () => {
  visibleAdd.value = false;
  deletePartion(partionId).then((res) => {
      if (res && res.retCode === 0) {
        Message.info("删除分片成功");
      } else {
        Message.info(res.retMsg || "删除分片失败，请稍后重试");
      }
      getPartionListBySizeReq();
  }).catch(()=> {
    Message.info("删除分片失败，请稍后重试");
    getPartionListBySizeReq();
  })
};
const handleAddCancel = () => {
  visibleAdd.value = false;
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
};

const basicInfoRef = ref<any>();

const searchKeyword = (val: any) => {
  styleId.value = val;
  basicInfoRef.value.getStyleDetailReq(styleId.value);
};

const closeDrawer = () => {
  visibleAdd.value = false;
};

const preg =
  /^\d{0,}[_]{1}[s|m|l|xl|xxl|xxxl|xs|xxs]{1}[_]{1}[\u4e00-\u9fa5]{0,}\.psb/;
let str = "1_s1_测试.psb";
console.log("preg.test(str)", preg.test(str));
const loading = ref(false);
const beforeUpload = (fileItem) => {
  console.log("file", fileItem);
  let name = fileItem.name;
  const preg =
    /^\d{0,}[_]{1}[s|m|l|xl|xxl|xxxl|xs|xxs]{1}[_]{1}[\u4e00-\u9fa5]{0,}\.psb/;
  if (preg.test(name)) {
    loading.value = true;
    fileList.value.push(fileItem);
    console.log("fileUploadRef",fileUploadRef)
    return true;
  } else {
    Message.info(
      "文件命名不规则，规则为：1_" +
        styleDetail.value.standardSize.toLowerCase() +
        "_后半裙"
    );
    return false;
  }
};
const customRequest = (option: any) => {
  const { fileItem } = option;
  console.log("fileItem :>> ", fileItem);

  let params = {
    styleId: styleId.value,
    psd: fileItem.file,
  };

  console.log("params", params);
  uploadPsb(params)
    .then((res: any) => {
      console.log("uploadPsb", res);
      if (res && res.retCode === 0) {
        fileList.value = "";
        Message.info("上传标准码psb文件成功");
      } else {
        Message.info(res.retMsg || "上传标准码psb文件失败，请稍后重试");
      }
      loading.value = false;
      getPartionListBySizeReq();
    })
    .catch(() => {
      Message.info("上传标准码psb文件失败，请稍后重试");
      loading.value = false;
      getPartionListBySizeReq();
    });
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
  //   padding: 24px 0 0 46px;

  .psb-box {
    width: 524px;
    height: 335px;
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