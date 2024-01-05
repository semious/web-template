<template>
  <a-layout class="container">
    <CodeSearch @searchKeyword="searchKeyword"></CodeSearch>
    <BasicInfo :styleCode="styleCode" @addUser="addUser" ref="basicInfoRef"></BasicInfo>
    <a-space style="margin-top: 12px;margin-left: 24px;">
      <div class="psb-box">
        <div class="desc">上传标准码psb文件（已上传3 待上传1）</div>
        <a-space class="upload-info">
          <a-upload :custom-request="customRequest"
            name="psd" :auto-upload="true"
            @success="onUploadCadSuccess"
            @error="onUploadCadError"
            :on-before-upload="(file) => { loading = true; return true; }">
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
      :visibleAdd="visibleAdd" @closeDrawer="closeDrawer" :isModify="isModify">
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
import { uploadPsb } from "@/api/style";
import CodeSearch from "@/components/codeSearch/index.vue";
import StyleAdd from "@/components/styleAdd/index.vue";
import BasicInfo from "@/components/basicInfo/index.vue";

const psbColumns = [
  {
    title: "纸样号",
    dataIndex: "patternNumber",
    width: 75,
  },
  {
    title: "S",
    dataIndex: "sizeName",
    width: 180,
    slotName: "sizeOptional",
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
  {
    patternNumber: 1,
    sizeName: "1_s_后半裙.psb",
    patternName: "后半裙",
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
const isModify = ref(0);
const addUser = (val:number) => {
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


const basicInfoRef = ref<any>();
const styleCode = ref();
const searchKeyword = (val: any) => {
  styleCode.value = val;
  basicInfoRef.value.getStyleDetailReq(styleCode.value)
};

const closeDrawer = () => {
  visibleAdd.value = false;
};


const loading = ref(false);
const customRequest = (option: any) => {
  const { fileItem } = option;
  console.log("fileItem :>> ", fileItem);

  let params = {
    styleId: "",
    psd: fileItem.file,
  };

  console.log("params", params);
  uploadPsb(params)
    .then((res: any) => {
      console.log("uploadPsb", res);
      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
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