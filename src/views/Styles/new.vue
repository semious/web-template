<template>
  <Layout active="5">
    <template #content>
      <a-layout>
        <a-layout-header class="py-12">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/styles' }">模板配置列表</el-breadcrumb-item>
            <el-breadcrumb-item>新增样式配置</el-breadcrumb-item>
          </el-breadcrumb>
          <a-space size="large">
          </a-space>
        </a-layout-header>
        <a-layout-content>
          <a-space direction="vertical" size="large" :style="{ width: '600px' }">
            <a-form :disabled="loading" :model="form" layout="vertical" @submit="submit">
              <a-form-item field="id" label="模板 id(不能重复)" :style="{ width: '320px' }"
                :rules="[{ required: true, message: 'id is required' }]" :validate-trigger="['change', 'input']">
                <a-input-number v-model="form.id" placeholder="" />
              </a-form-item>
              <a-form-item field="app_name" label="所属应用">
                <a-select v-model="form.app_id" :defaultValue="appNameOptions[0].value" :style="{ width: '320px' }">
                  <a-option v-for="item of appNameOptions" :value="item.value" :label="item.label" :key="item.value" />
                </a-select>
              </a-form-item>
              <a-form-item field="style_name" label="样式名称" :rules="[{ required: true, message: '样式不能为空' }]"
                :validate-trigger="['change', 'input']">
                <a-input v-model="form.style_name" placeholder="" />
              </a-form-item>
              <a-form-item field="style_desc" label="样式描述">
                <a-textarea v-model="form.style_desc" placeholder="" auto-size />
              </a-form-item>
              <a-form-item field="style_img_url" label="封面地址" :rules="[{ required: true, message: 'url 不能为空' }]"
                :validate-trigger="['change', 'input']">
                <a-input v-model="form.style_img_url" placeholder="" />
              </a-form-item>
              <a-form-item v-if="form.style_img_url">
                <a-image class="mr-10" width="150" :src="form.style_img_url" placeholder="" />
              </a-form-item>
              <a-form-item field="style_tag" label="tags">
                <a-input v-model="form.style_tag" placeholder="" />
              </a-form-item>
              <a-form-item field="style_model" label="模型" :rules="[{ required: true, message: '模型不能为空' }]"
                :validate-trigger="['change', 'input']">
                <a-textarea v-model="form.style_model" placeholder="" auto-size />
              </a-form-item>
              <a-form-item field="model_hash" label="模型Hash" :rules="[{ required: true, message: '模型Hash不能为空' }]"
                :validate-trigger="['change', 'input']">
                <a-textarea v-model="form.model_hash" placeholder="" auto-size />
              </a-form-item>
              <a-form-item field="use_lora" label="是否支持Lora">
                <a-switch v-model="form.use_lora" :checked-value="1" :unchecked-value="0" />
              </a-form-item>
              <a-form-item field="img_prompt" label="图生图提示词">
                <a-textarea v-model="form.img_prompt" placeholder="" auto-size />
              </a-form-item>
              <a-form-item field="img_content" label="图生图配置">
                <a-textarea v-model="form.img_content" placeholder="" auto-size />
              </a-form-item>
              <a-form-item field="txt_prompt" label="文生图提示词">
                <a-textarea v-model="form.txt_prompt" placeholder="" auto-size />
              </a-form-item>
              <a-form-item field="img_content" label="文生图配置">
                <a-textarea v-model="form.txt_content" placeholder="" auto-size />
              </a-form-item>
              <a-form-item>
                <a-button html-type="submit" status="danger" :loading="loading" type="primary">{{ loading ? "保存中" : "保存"
                }}</a-button>
              </a-form-item>
            </a-form>
          </a-space>
        </a-layout-content>
      </a-layout>
    </template>
  </Layout>
</template>

<script lang="ts">
import { ref, onMounted, computed, reactive, watch } from "vue";
import { ElMessageBox } from 'element-plus';
import Layout from "@/components/Layout.vue";
import { useRouter } from 'vue-router';
import { addImageStyle } from "@/api/imagestyle";
export default {
  name: "App",
  components: {
    Layout,
  },
  setup() {
    const router = useRouter();
    const loading = ref(false);
    // console.log('router.params.id :>> ', router.currentRoute.value.params.id);
    // const id = Number(router.currentRoute.value.params.id);
    const layout = ref("horizontal");
    const form = ref({
      id: undefined,
      app_id: "WX001",
      style_name: "",
      style_model: "",
      model_hash: "",
      style_img_url: "",
      style_tag: "",
      use_lora: 1,
      img_prompt: "",
      img_content: "",
      txt_prompt: "",
      txt_content: "",
      style_desc: "",
    });

    onMounted(() => {
      getData();
    });

    const appNameOptions = [{
      value: 'WX001',
      label: 'AI头像',
    }, {
      value: 'WX002',
      label: 'AI写真',
    }];

    function getData() {

    }

    function submit(form: any) {
      console.log('form:>> ', form);
      if (form.errors) return;

      loading.value = true;

      for (const i of ['img_content', 'txt_content']) {
        try {
          // 验证 JSON 的格式是否正确
          if (form.values[i] !== '') { JSON.parse(form.values[i]) };
        } catch (error: any) {
          console.error(error);
          ElMessageBox({
            title: 'JSON格式错误',
            message: 'JSON格式错误，请检查！',
            type: 'error'
          })
          loading.value = false;
          return;
        }
      }

      addImageStyle(form.values).then((res: any) => {
        console.log('res :>> ', res);
        if (res.id) {
          ElMessageBox({
            title: '保存成功',
            message: '保存成功！',
            type: 'success'
          })
          setTimeout(() => {
            router.push(`/styles/${res.id}`);
          }, 1000);
        } else {
          ElMessageBox({
            title: '保存失败',
            message: '保存失败！',
            type: 'error'
          })
        }
        loading.value = false;
      }).catch((err: any) => {
        console.log('err :>> ', err);
        ElMessageBox({
          title: '保存失败',
          message: '保存失败！',
          type: 'error'
        })
        loading.value = false;
      })


    }

    return {
      layout,
      form,
      appNameOptions,
      loading,
      submit,
      console,
    };
  },
}
</script>

<style scoped>
</style>
