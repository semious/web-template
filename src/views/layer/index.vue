<template>
  <a-layout class="container">
    <a-space>
      <a-input class="search-input" placeholder="请输入ID进行筛选"
        allow-clear>
      </a-input>
      <a-button type="primary">查询</a-button>
      <a-button type="outline"
        style="margin-left: 26px;">查询全部</a-button>
    </a-space>
    <a-row class="basic-info" justify="space-between">
      <a-col :span="3">
        <div class="title">基本信息</div>
      </a-col>
      <a-col :span="18">
        <a-descriptions :column="6">
          <a-descriptions-item label="款式ID:">
            49510
          </a-descriptions-item>
          <a-descriptions-item label="设计师:">
            李明智
          </a-descriptions-item>
          <a-descriptions-item label="纸样师:">
            李明智
          </a-descriptions-item>
          <a-descriptions-item label="创建时间:">
            2023/01/09
          </a-descriptions-item>
          <a-descriptions-item label="更新时间:">
            2023/01/09
          </a-descriptions-item>

        </a-descriptions>
        <a-descriptions :column="3">
          <a-descriptions-item label="尺码数:">
            6 （XS S M L XL XXL)
          </a-descriptions-item>
          <a-descriptions-item label="标准码:">
            XS
          </a-descriptions-item>
          <a-descriptions-item label="纸样数:">
            10
          </a-descriptions-item>
        </a-descriptions>
      </a-col>
      <a-col :span="3">
        <a-button type="primary" @click="addUser">
          修改基本信息
        </a-button>
      </a-col>
    </a-row>

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
                size="small">查看图层</a-button>
              <a-button type="text"
                size="small">解析图层</a-button>
            </a-space>

          </template>
        </a-table>
      </div>
    </a-space>
    <a-space style="margin-top: 20px;">
      <a-space>
        <a-button type="text" size="small">全选</a-button>
        <a-button type="text" size="small">反选</a-button>
        <a-button type="text" size="small">清空选择</a-button>
      </a-space>
    </a-space>
    <a-space class="img-box">
        <div class="img-item" v-for="i in 10" :key="i">
          <a-image width="118" height="70"
            src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp" />
          <div class="img-desc">A user’s avatar</div>
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
    <a-drawer :width="340" :visible="visibleAdd"
      @ok="handleAddOk" @cancel="handleAddCancel"
      unmountOnClose>
      <template #title>
        {{userTitle}}
      </template>
      <div>
        <a-form :model="form">
          <a-form-item field="styleId" label="款式ID">
            <a-input v-model="form.styleId"
              placeholder="请输入款式ID" />
          </a-form-item>
          <a-form-item field="name" label="名称">
            <a-input v-model="form.name"
              placeholder="请输入名称" />
          </a-form-item>
          <a-form-item field="patternMaker" label="纸样师">
            <a-select v-model="form.patternMaker"
              placeholder="请选择制样师" allow-clear>
              <a-option value="张三">张三</a-option>
              <a-option value="李四">李四</a-option>
              <a-option value="王五">王五</a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="designer" label="设计师">
            <a-select v-model="form.designer"
              placeholder="请选择设计师" allow-clear>
              <a-option value="张三">张三</a-option>
              <a-option value="李四">李四</a-option>
              <a-option value="王五">王五</a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="stylePic" label="效果图">
            <a-upload action="/" />
          </a-form-item>
          <a-form-item field="size" label="尺码">
            <a-checkbox-group>
              <a-checkbox value="XXS">XXS</a-checkbox>
              <a-checkbox value="XS">XS</a-checkbox>
              <a-checkbox value="S">S</a-checkbox>
              <a-checkbox value="M">M</a-checkbox>
              <a-checkbox value="L">L</a-checkbox>
              <a-checkbox value="XL">XL</a-checkbox>
              <a-checkbox value="XXL">XXL</a-checkbox>
              <a-checkbox value="XXXL">XXXL</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
          <a-form-item field="standardCode" label="标准码">
            <a-select v-model="form.standardCode"
              placeholder="请选择标准码" allow-clear>
              <a-option value="S">S</a-option>
              <a-option value="M">M</a-option>
              <a-option value="L">L</a-option>
              <a-option value="XL">XL</a-option>
              <a-option value="XXL">XXL</a-option>
              <a-option value="XXXL">XXXL</a-option>
              <a-option value="XS">XS</a-option>
              <a-option value="XXS">XXS</a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="sampleNumbers" label="纸样数">
            <a-input v-model="form.sampleNumbers"
              placeholder="请输入纸样数" />
          </a-form-item>
          <a-form-item field="remark" label="备注">
            <a-input v-model="form.remark"
              placeholder="请输入备注" />
          </a-form-item>
          <a-form-item field="custom" label="客户">
            <a-input v-model="form.custom"
              placeholder="请输入客户" />
          </a-form-item>
        </a-form>
      </div>
    </a-drawer>
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
const form = reactive({
  patternNumber: "",
  name: "",
  patternMaker: "",
  designer: "",
  stylePic: "",
  size: "",
  standardCode: "",
  sampleNumbers: "",
  remark: "",
  custom: "",
});
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
  //   form.styleId = "";
  //   form.name = "";
  //   form.patternMaker = "";
  //   form.designer = "";
  //   form.stylePic = "";
  //   form.size = "";
  //   form.standardCode = "";
  //   form.sampleNumbers = "";
  //   form.remark = "";
  //   form.custom = "";

  console.log("form", form);
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
</script>
    <style lang="less" scoped>
.container {
  padding: 24px 0 0 46px;
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
    width: 1065px;
    height: 270px;
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
            color: #1D2129;
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