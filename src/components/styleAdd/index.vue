<template>
  <!-- <div>
    
  </div> -->
  <a-drawer :width="340" :visible="visibleAdd"
    @ok="handleAddOk" @cancel="handleAddCancel"
    unmountOnClose>
    <template #title>
      {{userTitle}}
    </template>
    <div>
      <a-form :model="form">
        <a-form-item field="styleCode" label="款式ID">
          <a-input type="number" v-model="form.styleCode"
            placeholder="请输入款式ID" />
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
        <a-form-item field="effectImg" label="效果图">
          <a-upload action="/" />
        </a-form-item>
        <a-form-item field="sizes" label="尺码">
          <a-checkbox-group v-model="form.sizes">
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
        <a-form-item field="standardSize" label="标准码">
          <a-select v-model="form.standardSize"
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
        <a-form-item field="partNum" label="纸样数">
          <a-input type="number" v-model="form.partNum"
            placeholder="请输入纸样数" />
        </a-form-item>
        <a-form-item field="styleRemark" label="备注">
          <a-input  v-model="form.styleRemark"
            placeholder="请输入备注" />
        </a-form-item>
        <a-form-item field="custom" label="客户">
          <a-input v-model="form.custom"
            placeholder="请输入客户" />
        </a-form-item>
      </a-form>
    </div>
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
const props = defineProps(["userTitle","visibleAdd"]);
console.log("props", props);
const emit = defineEmits(["closeDrawer"])
const id = ref();
const form = reactive({
  styleCode: "",
  styleName: "",
  paperUserId: "",
  designerId: "",
  sizes: [],
  standardSize: "",
  partNum: "",
  styleRemark: "",
  custom: "",
  effectImg: null,
});
const postStyleSaveReq = () => {
  console.log("form",form)
  let params = {
    styleEditVO: {
      styleCode: form.styleCode,
      styleName: form.styleName,
      paperUserId: form.paperUserId,
      designerId: form.designerId,
      sizes: form.sizes,
      standardSize: form.standardSize,
      partNum: form.partNum,
      styleRemark: form.styleRemark,
      custom: form.custom,
    },
    effectImg: form.effectImg
  }
  postStyleSave(params).then((res)=> {
    console.log("postStyleSave",res)
  })
};
const handleAddOk = () => {
  postStyleSaveReq()
  emit("closeDrawer")
};
const handleAddCancel = () => {
  emit("closeDrawer")
};
</script>