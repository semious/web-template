<template>
  <Layout>
    <template #content>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>客服后台</el-breadcrumb-item>
        <el-breadcrumb-item>咨询老师</el-breadcrumb-item>
      </el-breadcrumb>
      <a-layout>
        <a-layout-header class="py-12">
          <a-space direction="horizontal" size="small">
            <!-- <a-input-search class="mr-6" :style="{ width: '250px' }" @change="onSearch" v-model="searchInput"
              placeholder="输入老师名搜索" search-button /> -->
            状态筛选: <a-radio-group @change="onChangeStatus" v-model="currentStatus" :options="statusOptions" />
          </a-space>
        </a-layout-header>
        <a-layout-content>
          <a-table size="small" :loading="isLoading" class="mb-12" :pagination="false" :columns="columns" :data="data"
            :stripe="true">
            <template #teacher_sort="{ record }">
              <a-input-number size="small" :disabled="!record.editable" :min="0" :max="9999"
                v-model="record.teacher_sort" />
            </template>
            <template #teacher_name="{ record }">
              <a-input size="small" :disabled="!record.editable" v-model="record.teacher_name" placeholder="老师名字" />
            </template>
            <template #avatar="{ record }">
              <a-upload :headers="{ token: token }" :disabled="!record.editable" :action="uploadApi"
                :fileList="[record.avatarFile]" :show-file-list="false"
                @success="(file) => { record.avatar_url = file.response[0].url }">
                <template #upload-button>
                  <div class="arco-upload-list-picture custom-upload-avatar">
                    <a-avatar :imageUrl="record.avatar_url" :size="80" />
                    <div class="arco-upload-list-picture-mask">
                      <IconEdit />
                    </div>
                  </div>
                </template>
              </a-upload>
            </template>
            <template #wx_url="{ record }">
              <a-upload :headers="{ token }" :disabled="!record.editable" :action="uploadApi" :fileList="[record.wxFile]"
                :show-file-list="false" @success="(file) => { record.wx_url = file.response[0].url }">
                <template #upload-button>
                  <div class="arco-upload-list-picture custom-upload-avatar">
                    <a-image :src="record.wx_url" width="100" />
                    <div class="arco-upload-list-picture-mask">
                      <IconEdit />
                    </div>
                  </div>
                </template>
              </a-upload>
            </template>
            <template #teacher_status="{ record }">
              <a-tag size="small" v-if="record.teacher_status === 1" color="green">在线</a-tag>
              <a-tag size="small" v-else color="red">已下线</a-tag>
            </template>
            <template #optional="{ record }">
              <a-space direction="horizontal" size="small" v-if="record.id">
                <a-button size="small" v-if="record.editable" type="secondary" status="warning"
                  @click="() => { updateTeacherInfo(record) }">更新</a-button>
                <a-popconfirm type="warning" @ok="() => { toggleStatus(record) }" content="请再次确认?">
                  <a-button size="small" type="primary" status="danger">{{ record.teacher_status === 1 ? '下线' : '上线'
                  }}</a-button>
                </a-popconfirm>
              </a-space>
              <a-button size="small" type="primary" @click="() => { addTeacherInfo(record) }" v-else>新增</a-button>
            </template>
            <template #teacher_tag="{ record }">
              <a-input-tag placeholder="老师标签" :disabled="!record.editable" v-model="record.teacher_tag" />
            </template>
            <template #teacher_introduce="{ record }">
              <a-textarea placeholder="老师描述" :disabled="!record.editable" v-model="record.teacher_introduce" auto-size />
            </template>
          </a-table>
          <a-pagination :pageSize="10" @change="getDataByPage" :current="curPage"
            :style='{ "justify-content": "flex-end" }' :total="total" />
        </a-layout-content>
      </a-layout>
    </template>
  </Layout>
</template>
    
<script lang="ts">
import { ref, onMounted, computed, reactive, watch } from "vue";
import { Message } from '@arco-design/web-vue';
import { useRouter } from 'vue-router';
import { getTeacherInfo, searchTeacher, updateTeacher, updateTeachers, addTeacher } from "@/api/teacher";
import { API_BASE_URL } from '@/api/constants';

import Layout from "@/components/Layout.vue";

export default {
  name: "App",
  components: {
    Layout,
  },
  setup() {
    const uploadApi = `${API_BASE_URL}/api/upload`;
    const router = useRouter();
    const route = router.currentRoute;
    const searchInput: any = ref("");
    const total = ref(1);
    const curPage = ref(1);
    const isLoading = ref(false);
    const token = window.sessionStorage.getItem('token') || '';

    watch(() => router.currentRoute.value, () => {
      searchInput.value = router.currentRoute.value.query?.user_id || "";
    }, { immediate: true });

    const currentStatus = ref("1");
    const statusOptions = [
      { label: '全部', value: '1,2' },
      { label: '在线', value: "1" },
      { label: '已下线', value: "2" },
    ]

    const teacherStatusOptions = ref([
      { text: '在线', value: 1 },
      { text: '下线', value: 2 },
    ]);

    const columns = [
      {
        title: '排序',
        dataIndex: 'teacher_sort',
        width: 110,
        slotName: 'teacher_sort',
      },
      {
        title: "老师姓名",
        dataIndex: "teacher_name",
        width: 120,
        slotName: 'teacher_name',
      },
      {
        title: '老师头像',
        dataIndex: 'avatar_url',
        width: 60,
        slotName: 'avatar',
      },
      {
        title: "介绍",
        dataIndex: "teacher_introduce",
        width: 300,
        slotName: "teacher_introduce",
      },
      {
        title: "标签",
        dataIndex: "teacher_tag",
        width: 200,
        slotName: "teacher_tag",
      },
      {
        title: "联系方式",
        dataIndex: "wx_url",
        width: 150,
        slotName: "wx_url",
      },
      {
        title: "状态",
        dataIndex: "teacher_status",
        width: 60,
        slotName: "teacher_status",
      },
      {
        title: "操作",
        slotName: "optional",
      },
    ];
    const data = ref([]);

    function initTeacherInfo(ignoreSearch?: boolean) {
      if (searchInput.value.length > 0 && !ignoreSearch) {
        onSearch();
        return;
      }
      curPage.value = 1;
      getDataByPage(curPage.value);
    }

    onMounted(() => {
      getDataByPage(curPage.value);
    });

    function onSearch() {
      if (searchInput.value.length < 1) {
        initTeacherInfo();
        return;
      }
      // console.log(searchInput.value);
      currentStatus.value = "1,2";
      searchTeacher(searchInput.value).then((res: any) => {
        data.value = res.map((item: any) => {
          return item;
        })
        total.value = res.length;
        curPage.value = 1;
      }).catch((error) => {
        console.error(error);
      });
    }

    function onChangeStatus() {
      curPage.value = 1;
      getDataByPage(1);
    }

    function toggleStatus(record: any) {
      console.log('record :>> ', record);
      const { teacher_status, id } = record;
      const newStatus = teacher_status === 1 ? 2 : 1;
      updateTeachers({
        id,
        teacher_status: newStatus,
      }).then(() => {
        Message.success('更新成功');
        getDataByPage(curPage.value);
      });
    }

    function getDataByPage(page: number) {
      isLoading.value = true;
      curPage.value = page;
      getTeacherInfo(page, currentStatus.value).then((res: any) => {
        const outputData = res.list.map((item: any) => ({
          ...item,
          editable: item.teacher_status === 1,
          avatarFile: {
            url: item.avatar_url,
          },
          wxFile: {
            url: item.wx_url,
          },
        }))
        outputData.push({
          editable: true,
          teacher_name: '',
          teacher_sort: 9999,
          teacher_tag: [],
          teacher_introduce: '',
          avatar_url: '',
          wx_url: '',
          teacher_status: 1,
          avatarFile: {
            url: '',
          },
          wxFile: {
            url: '',
          },
        });
        data.value = outputData;
        total.value = res.total;
        setTimeout(() => {
          isLoading.value = false;
        }, 500);
      });
    }

    function validateInfo(record: any) {
      const { teacher_name, teacher_sort, teacher_tag, teacher_introduce, avatar_url, wx_url } = record;
      if (!teacher_name || !teacher_introduce) {
        Message.error('请填写完整的老师信息');
        return false;
      }
      if (teacher_sort < 0 || teacher_sort > 9999) {
        Message.error('排序必须在0-9999之间');
        return false;
      }
      if (teacher_name.length > 10) {
        Message.error('老师姓名不能超过10个字符');
        return false;
      }
      if (teacher_tag.length > 20) {
        Message.error('老师标签不能超过20个');
        return false;
      }
      if (teacher_introduce.length > 200) {
        Message.error('老师介绍不能超过200个字符');
        return false;
      }

      if (!avatar_url) {
        Message.error('请上传老师头像');
        return false;
      }

      if (!wx_url) {
        Message.error('请上传老师微信二维码');
        return false;
      }

      return true;
    }

    function updateTeacherInfo(record: any) {
      // console.log('record :>> ', record);
      if (!validateInfo(record)) {
        return;
      }

      isLoading.value = true;
      updateTeacher(record).then(res => {
        Message.success('更新成功');
        getDataByPage(curPage.value);
      });
    }

    function addTeacherInfo(record: any) {
      // console.log('record :>> ', record);
      if (!validateInfo(record)) {
        return;
      }

      isLoading.value = true;
      addTeacher(record).then(res => {
        Message.success('更新成功');
        getDataByPage(curPage.value);
      });
    }

    return {
      columns,
      data,
      searchInput,
      onSearch,
      total,
      curPage,
      getDataByPage,
      statusOptions,
      currentStatus,
      onChangeStatus,
      isLoading,
      teacher_status_options: teacherStatusOptions,
      getTeacherInfo,
      addTeacherInfo,
      updateTeacherInfo,
      toggleStatus,
      uploadApi,
      token,
    };
  },
};
</script>
    
<style scoped>
.green {
  color: black;
  font-size: 15px;
}

.user-info {
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;
}

.transparent-modal {
  background-color: transparent;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
