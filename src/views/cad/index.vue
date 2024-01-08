<template>
  <a-layout class="container">
    <CodeSearch @searchKeyword="searchKeyword"></CodeSearch>
    <BasicInfo :styleId="styleId" @addUser="addUser" ref="basicInfoRef" v-show="showDetail" @showDetailInfo="showDetailInfo"></BasicInfo>

    <a-space style="margin-top: 12px;" v-show="showDetail">
      <div class="psb-box">
        <div class="desc">提示：这里是放提示语句的</div>

        <a-space class="upload-info">
          <div class="desc">上传其他码CAD文件（已上传{{uploadCount}} 待上传{{unUploadCount}}）</div>
          <a-upload :custom-request="customRequest"
            name="cad" :auto-upload="true"
            @success="onUploadCadSuccess"
            @error="onUploadCadError"
            :on-before-upload="beforeUpload" :limit="1" ref="fileUploadRef" :file-list="fileList">
            <template #upload-button>
              <a-button type="primary">上传</a-button>
            </template>
          </a-upload>
          <div class="upload-desc">文件命名规则为：1_s_后半裙.jpg</div>
        </a-space>
        <a-table style="width: 1000px;margin-top: 18px;"
          :columns="psbColumns" :data="psbData"
          :pagination="false">
          <template #XSOptional="{ record }">
            <div class="opration-item"
              @click="delSizeName(record)">
              {{record.XSName}}
              <icon-delete />
            </div>

          </template>
          <template #MOptional="{ record }">
            <div class="opration-item"
              @click="delSizeName(record)">
              {{record.MName}}
              <icon-delete />
            </div>

          </template>
          <template #LOptional="{ record }">
            <div class="opration-item"
              @click="delSizeName(record)">
              {{record.LName}}
              <icon-delete />
            </div>

          </template>
          <template #XLOptional="{ record }">
            <div class="opration-item"
              @click="delSizeName(record)">
              {{record.XLName}}
              <icon-delete />
            </div>

          </template>
          <template #XXLOptional="{ record }">
            <div class="opration-item"
              @click="delSizeName(record)">
              {{record.XXLName}}
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
      :visibleAdd="visibleAdd" @closeDrawer="closeDrawer" :isModify="isModify" ref="styleAddRef">
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
import { uploadCad, modifyPartionRemark,getPartionListByStyleId } from "@/api/style";
import { Message } from "@arco-design/web-vue";
// import { StyleDetailInfo } from "@/api/typing";

const psbColumns = [
  {
    title: "纸样号",
    dataIndex: "patternNumber",
    width: 75,
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
    title: "纸样名",
    dataIndex: "patternName",
    width: 135,
    slotName: "nameOptional",
  },
];
const tagStatus = ref("");
const psbData = [
];
const tagValue = ref("");
const visible = ref(false);
const showInput = ref(false);
const showDetail = ref(false);
const styleDetail = ref();
const uploadCount = ref(0);
const unUploadCount = ref(0);
const getPartionListBySizeReq = () => {
  getPartionListByStyleId(
    styleDetail.value.id
  ).then((res:any) => {
    psbData.value = res.data || [];
    uploadCount.value = psbData.value.length;
    if (styleDetail && styleDetail.value.partNum) {
      let partNum = styleDetail.value.partNum;
      unUploadCount.value = Number(partNum) - Number(uploadCount.value);
    }
    
  }).catch(()=> {
    uploadCount.value = 0;
    if (styleDetail && styleDetail.value.partNum) {
      let partNum = styleDetail.value.partNum;
      unUploadCount.value = Number(partNum) - Number(uploadCount.value);
    }
    
  });
};

const showDetailInfo = (val:any) => {
  showDetail.value = true;
  styleDetail.value = val;
  getPartionListBySizeReq();
};
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
  let params = {
    partionId: "",
    remark: showInput.value
  }
  modifyPartionRemark(params).then((res)=> {
    console.log("modifyPartionRemark",res)
  })
};

const basicInfoRef = ref<any>();
const searchKeyword = (val: any) => {
  styleId.value = val;
  basicInfoRef.value.getStyleDetailReq(styleId.value)
};

const closeDrawer = () => {
  visibleAdd.value = false;
};


const loading = ref(false);
const fileList = ref([])

const fileUploadRef = ref();
const beforeUpload = (fileItem) => {
  console.log("file", fileItem);
  let name = fileItem.name;
  const preg =
    /^\d{0,}[_]{1}(s|m|l|xl|xxl|xxxl|xs|xxs)[_]{1}[\u4e00-\u9fa5]{0,}\.(jpg|png|jpeg)/;
  if (preg.test(name)) {
    loading.value = true;
    let item = {
      name: fileItem.name
    }
    fileList.value.push(item);
    console.log("fileList",fileList)
    return true;
  } else {
    Message.info(
      "文件命名不规则，规则为：1_" +
        styleDetail.value.standardSize.toLowerCase() +
        "_后半裙.jpg"
    );
    return false;
  }
};
const customRequest = (option: any) => {
  const { fileItem } = option;
  console.log("fileItem :>> ", fileItem);

  let params = {
    styleId: styleId.value,
    cad: fileItem.file,
  };

  console.log("params", params);
  uploadCad(params)
    .then((res: any) => {
      console.log("uploadPsb", res);
      if (res && res.retCode === 0) {
        Message.info("上传CAD文件成功");
      } else {
        
        Message.info(res.retMsg || "上传CAD文件失败，请稍后重试");
      }
      fileList.value = [];
      loading.value = false;
      getPartionListBySizeReq();
    })
    .catch(() => {
      fileList.value = [];
      loading.value = false;
      Message.info("上传CAD文件失败，请稍后重试");
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