<template>

  <a-drawer :width="340" :visible="visibleAdd"
    @ok="handleAddOk" @cancel="handleAddCancel"
    unmountOnClose class="add-drawer" :footer="false">
    <template #title>
      {{userTitle}}
    </template>
    <a-form class="form-content" ref="formRef" :model="form"
      auto-label-width :rules="rules"
      @submit="handleSubmit">
      <div class="form-info">
        <a-form-item field="styleCode" label="款式编号" required
          validate-trigger="blur">
          <a-input type="number" v-model="form.styleCode"
            placeholder="请输入款式编号"
            :disabled="isModify == 1" />
        </a-form-item>
        <a-form-item field="styleName" label="名称">
          <a-input v-model="form.styleName"
            placeholder="请输入名称" />
        </a-form-item>
        <a-form-item field="paperUserId" label="纸样师">
          <a-select v-model="form.paperUserId"
            placeholder="请选择制样师" allow-clear>
            <a-option value="张三">张三</a-option>
            <a-option value="李四">李四</a-option>
            <a-option value="王五">王五</a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="designerId" label="设计师">
          <a-select v-model="form.designerId"
            placeholder="请选择设计师" allow-clear>
            <a-option value="张三">张三</a-option>
            <a-option value="李四">李四</a-option>
            <a-option value="王五">王五</a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="effectImg" label="效果图" required>
          <a-upload @change="onChange" name="effectImg"
            :auto-upload="false"
            @success="onUploadCadSuccess"
            @error="onUploadCadError"
            :on-before-upload="(file) => { loading = true; return true; }"
            :limit="1">
            <template #upload-button>
              <a-button type="primary">上传</a-button>
            </template>
          </a-upload>
        </a-form-item>
        <a-form-item field="sizes" label="尺码" required>
          <a-checkbox-group v-model="form.sizes"
            :disabled="isModify == 1">
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
        <a-form-item field="standardSize" label="标准码"
          required>
          <a-select v-model="form.standardSize"
            placeholder="请选择标准码" allow-clear
            :disabled="isModify == 1">
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
        <a-form-item field="partNum" label="纸样数" required
          validate-trigger="blur">
          <a-input type="number" v-model="form.partNum"
            placeholder="请输入纸样数"
            :disabled="isModify == 1" />
        </a-form-item>
        <a-form-item field="styleRemark" label="备注">
          <a-input v-model="form.styleRemark"
            placeholder="请输入备注" />
        </a-form-item>
        <a-form-item field="customer" label="客户">
          <a-input v-model="form.customer"
            placeholder="请输入客户" />
        </a-form-item>
      </div>

      <a-form-item class="form-footer">
        <a-space>
          <a-button
            @click="$refs.formRef.resetFields();handleAddCancel();">取消</a-button>
          <a-button  type="primary"  html-type="submit">确定</a-button>
          
        </a-space>
      </a-form-item>
    </a-form>
  </a-drawer>
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
} from "vue";
import { postStyleSave } from "@/api/style";
import { Message } from '@arco-design/web-vue';
const props = defineProps(["userTitle", "visibleAdd", "isModify"]);
console.log("props", props);
const emit = defineEmits(["closeDrawer"]);
const id = ref();
const isModify = ref(0);
isModify.value = props.isModify;
console.log("isModify", isModify);
watch(props, () => {
  isModify.value = props.isModify;
});
const form = reactive({
  styleCode: "",
  styleName: "",
  paperUserId: "",
  designerId: "",
  sizes: [],
  standardSize: "",
  partNum: "",
  styleRemark: "",
  customer: "",
  effectImg: null,
});

const rules = {
  styleCode: [
    {
      required: true,
      message: "款式ID必须填写",
    },
  ],
  partNum: [
    {
      required: true,
      message: "纸样数必须填写",
    },
  ],
  effectImg: [
    {
      required: true,
      message: "效果图必须上传",
    },
  ],
  sizes: [
    {
      required: true,
      message: "尺码必须选择",
    },
  ],
  standardSize: [
    {
      required: true,
      message: "标准码必须选择",
    },
  ],
};

const handleSubmit = ({ values, errors }) => {
  console.log("values:", values, "\nerrors:", errors);
  if(!errors) {
    postStyleSaveReq()
  }
};

const postStyleSaveReq = () => {
  console.log("form", form);
  let params = {
    styleCode: Number(form.styleCode),
    styleName: form.styleName,
    paperUserId: form.paperUserId,
    designerId: form.designerId,
    sizes: form.sizes,
    standardSize: form.standardSize,
    partNum: Number(form.partNum),
    styleRemark: form.styleRemark,
    customer: form.customer,
    effectImg: form.effectImg,
  };
  postStyleSave(params).then((res:any) => {
    console.log("postStyleSave", res);
    if(res && res.retCode === 0) {
      Message.info('添加款式成功');
      handleAddCancel();
    } else {
      Message.info('添加款式失败，请稍后重试');
    }
  }).catch(()=> {
    Message.info('添加款式失败，请稍后重试');
  });
};
const handleAddOk = () => {
  postStyleSaveReq();
  emit("closeDrawer");
};
const handleAddCancel = () => {
  emit("closeDrawer");
};

const loading = ref(false);
const customRequestUpload = (option: any) => {
  const { fileItem } = option;
  console.log("fileItem :>> ", fileItem);
  form.effectImg = fileItem.file;
  console.log("form", form);
};
const onUploadCadSuccess = (fileItem: any) => {
  loading.value = false;
};
const onUploadCadError = (fileItem: any) => {
  loading.value = false;
};
const onChange = (fileList: any) => {
  console.log("fileList", fileList);
  form.effectImg = fileList[0].file;
};
</script>
<style lang="less">
.add-drawer {
  display: flex;
  .arco-drawer-body {
    padding: 0;
  }
  .form-info {
    padding: 12px 16px;
    display: flex;
    flex: 1;
    flex-direction: column;
  }
  .arco-input-wrapper {
    background: #fff;

    border: 1px solid #165dff;
  }
  .arco-select-view-single {
    background: #fff;
    border: 1px solid #165dff;
  }
  .arco-select-view-disabled {
    border: 1px solid #f2f3f5;
    background: #f2f3f5;
  }
  .arco-input-disabled {
    border: 1px solid #f2f3f5;
    background: #f2f3f5;
  }
  .form-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    overflow-y: auto;
    position: relative;
  }
  .form-footer {
    height: 64px;
    border-radius: 0px 0px 0px 0px;
    opacity: 1;
    border-top: 1px solid #E5E6EB;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    
    &.arco-form-item {
      margin-bottom: 0;
    }
    .arco-form-item-content-wrapper {
      justify-content: flex-end;
      padding-right: 16px;
      .arco-form-item-content-flex {
        justify-content: flex-end;
      }
    }
  }
}
</style>