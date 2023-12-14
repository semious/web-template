<template>
  <Layout active="5">
    <template #content>
      <a-layout>
        <a-layout-header class="py-12">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/styles' }">模板配置列表</el-breadcrumb-item>
            <el-breadcrumb-item>样式配置</el-breadcrumb-item>
          </el-breadcrumb>
          <a-space size="large">
          </a-space>
        </a-layout-header>
        <a-layout-content>
          <!-- <div>User {{ $route.params.id }}</div> -->
          <a-space direction="vertical" size="large" :style="{ width: '600px' }">
            <a-form :disabled="loading" :model="form" layout="vertical">
              <a-form-item field="app_name" label="所属应用">
                {{ appName }}
              </a-form-item>
              <a-form-item>
                <a-space size="large">
                  <span>启用状态
                    <a-tooltip content="应用中是否可选此模板">
                      <icon-question-circle />
                    </a-tooltip> </span>
                  <a-switch @change="changeSwitch" :model-value="form.style_status" :checked-value="1"
                    :unchecked-value="2" />
                </a-space>
              </a-form-item>
              <a-form-item field="style_name" label="样式名称">
                <a-input v-model="form.style_name" placeholder="" />
              </a-form-item>
              <a-form-item field="style_desc" label="样式描述">
                <a-textarea v-model="form.style_desc" placeholder="" auto-size />
              </a-form-item>
              <a-form-item field="style_img_url" label="封面地址">
                <a-input v-model="form.style_img_url" placeholder="" />
              </a-form-item>
              <a-form-item>
                <a-image class="mr-10" width="150" :src="form.style_img_url" placeholder="" />
              </a-form-item>
              <a-form-item field="style_model" label="模型">
                <a-textarea v-model="form.style_model" placeholder="" auto-size />
              </a-form-item>
              <a-form-item field="model_hash" label="模型Hash" :rules="[{ required: true, message: '模型Hash不能为空' }]"
                :validate-trigger="['change', 'input']">
                <a-textarea v-model="form.model_hash" placeholder="" auto-size />
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
                <a-button status="danger" :loading="loading" @click="submit" type="primary">{{ loading ? "保存中" : "保存"
                }}</a-button>
              </a-form-item>
            </a-form>
            <div>
              <!-- {{ form }} -->
            </div>
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
import { queryImageStyle, updateImageStyle } from "@/api/imagestyle";
export default {
  name: "App",
  components: {
    Layout,
  },
  setup() {
    const router = useRouter();
    const loading = ref(false);
    console.log('router.params.id :>> ', router.currentRoute.value.params.id);
    const id = Number(router.currentRoute.value.params.id);
    const layout = ref("horizontal");
    let data: any = ref({});
    const form = ref({
      style_status: 1,
      app_id: "",
      style_desc: "",
      style_img_url: "",
      style_model: "",
      style_name: "",
      model_hash: "",
      img_prompt: "",
      img_content: "",
      txt_prompt: "",
      txt_content: "",
    });

    onMounted(() => {
      getData();
    });
    const appName = computed(() => {
      return data.app_id === 'WX001' ? 'AI头像' : 'AI写真';
    });
    function getData() {
      queryImageStyle().then((res: any) => {
        // console.log('res :>> ', res);
        // console.log('id :>> ', id);
        const item = res.find((item: any) => item.id == id);
        // console.log('item :>> ', item);
        data = {
          ...item,
          img_content: item.img_content ? JSON.stringify(item.img_content, null, 2) : '',
          txt_content: item.txt_content ? JSON.stringify(item.txt_content, null, 2) : '',
        }
        console.log('data :>> ', data);
        form.value = {
          style_status: item.style_status,
          app_id: item.app_id,
          style_desc: item.style_desc,
          style_img_url: item.style_img_url,
          style_model: item.style_model,
          style_name: item.style_name,
          model_hash: item.model_hash,
          img_prompt: item.img_prompt,
          img_content: item.img_content ? JSON.stringify(item.img_content, null, 2) : '',
          txt_prompt: item.txt_prompt,
          txt_content: item.txt_content ? JSON.stringify(item.txt_content, null, 2) : '',
        }
      });
    }

    function submit() {
      loading.value = true;
      const changeKeys = [];
      const keys = Object.keys(form.value);
      for (const key of keys) {
        console.log('key :>> ', key);
        // data[key] = form.value[key];
        if (key === 'img_content' || key === 'txt_content') {
          try {
            // 验证 JSON 的格式是否正确
            if (form.value[key] !== '') { JSON.parse(form.value[key]) };

            console.log('data[' + key + '] :>> ', data[key]);
            console.log('form.value[' + key + '] :>> ', form.value[key]);
            if (data[key] !== form.value[key]) {
              changeKeys.push(key);
            }
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
        } else {
          // @ts-ignore
          if (data[key] !== form.value[key]) {
            changeKeys.push(key);
          }
        }
      }

      console.log('changeKeys :>> ', changeKeys);
      if (changeKeys.length < 1) {
        ElMessageBox({
          title: '提示',
          message: '没有修改任何数据！',
          type: 'info'
        })
        loading.value = false;
        return;
      } else {
        Promise.all(changeKeys.map((key: any) => {
          // if (key === 'img_content' || key === 'txt_content') {
          //   return updateImageStyle({
          //     id,
          //     key,
          //     value: form.value[key] === '' ? null : JSON.parse(form.value[key]),
          //   });
          // } else {
            return updateImageStyle({
              id,
              key,
              // @ts-ignore
              value: form.value[key],
            });
          // }
        })).then((res: any) => {
          // console.log('res :>> ', res);
          ElMessageBox({
            title: '提示',
            message: '数据更新成功！',
            type: 'info'
          })
          loading.value = false;
          getData();
        }).catch((error) => {
          console.error(error);
          ElMessageBox({
            title: '接口异常',
            message: error,
            type: 'error'
          })
          loading.value = false;
          getData();
        });
      }
    }

    function changeSwitch(val: any) {
      console.log('val :>> ', val);
      form.value.style_status = val;
    }
    return {
      layout,
      form,
      appName,
      loading,
      submit,
      console,
      changeSwitch,
    };
  },
}
</script>

<style scoped>
</style>
