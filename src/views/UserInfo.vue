<template>
  <Layout>
    <template #content>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户状态</el-breadcrumb-item>
      </el-breadcrumb>
      <a-layout>
        <a-layout-header class="py-12">
          <a-input-search class="mr-6" :style="{ width: '250px' }" @change="onSearch" v-model="searchInput"
            placeholder="输入手机号码或用户昵称搜索" search-button />
          <a-button type="primary" @click="goToUsers">查询所有用户</a-button>
        </a-layout-header>
        <a-layout-content>
          <div v-if="currentUser.id" class="my-3">
            <div class="my-3">
              <p>用户昵称：{{ currentUser.nick_name }}</p>
              <p>用户手机号：{{ currentUser.user_phone }}</p>
              <p>激活时间：{{ currentUser.create_time }}</p>
              <p>最近访问时间：{{ currentUser.update_time }}</p>
              <p>分成余额：{{ currentUser.user_amount }}</p>
            </div>
            <a-space class="mb-20">
              <a-button :type="currentUserRelate === 'up' ? 'primary' : 'secondary'" size="small"
                @click="() => { goToPage('up', currentUser) }">上级</a-button>
              <a-tooltip content="包含一级和二级所有用户">
                <a-button :type="currentUserRelate === 'down' ? 'primary' : 'secondary'" size="small" @click="() => { goToPage('down', currentUser) }">下级</a-button>
              </a-tooltip>
              <a-button :type="currentUserRelate === 'first' ? 'primary' : 'secondary'" size="small" @click="() => { goToPage('first', currentUser) }">一级</a-button>
              <a-button :type="currentUserRelate === 'second' ? 'primary' : 'secondary'" size="small" @click="() => { goToPage('second', currentUser) }">二级</a-button>
            </a-space>
          </div>
          <a-table size="mini" class="mb-12" :pagination="false" :columns="columns" :data="data" :stripe="true">
            <template #avatar="{ record }">
              <a-avatar :imageUrl="record.avatar_url" :size="40" />
            </template>
            <template #optional="{ record }">
              <a-space>
                <a-button size="small" @click="() => { goToPage('up', record) }">上级</a-button>
                <a-tooltip content="包含一级和二级所有用户">
                  <a-button size="small" @click="() => { goToPage('down', record) }">下级</a-button>
                </a-tooltip>
                <a-button size="small" @click="() => { goToPage('first', record) }">一级</a-button>
                <a-button size="small" @click="() => { goToPage('second', record) }">二级</a-button>
              </a-space>
            </template>
          </a-table>
          <a-pagination :pageSize="50" @change="getDataByPage" :current="curPage"
            :style='{ "justify-content": "flex-end" }' :total="total" />
        </a-layout-content>
      </a-layout>
    </template>
  </Layout>
</template>
    
<script lang="ts">
import { ref, onMounted, computed, reactive, watch, onUpdated } from "vue";
import { Message } from '@arco-design/web-vue';
import { useRouter } from 'vue-router';
import { getUserInfo as getUserInfoService, searchUser, getUpRelateUser, getDownRelateUser, getDownRelateLevelUser } from "@/api/user";

import Layout from "@/components/Layout.vue";
import { formatLocalDate } from "@/utils/datetime";

export default {
  name: "App",
  components: {
    Layout,
  },
  setup() {
    const router = useRouter();
    const route = router.currentRoute;
    const searchInput = ref<string>("");
    const total = ref<number>(1);
    const curPage = ref<number>(1);
    const currentUser = ref<any>({});
    const currentUserRelate = ref<any>('');
    const currentUserId = ref<string>('');

    watch(() => router.currentRoute.value, () => {
      // console.log('router.currentRoute.value.query', router.currentRoute.value.query);
      currentUserId.value = router.currentRoute.value.query?.userId as string || "";
      currentUserRelate.value = router.currentRoute.value.query?.relate as string || "";
      currentUser.value = window.sessionStorage.getItem('currentUser') ? JSON.parse(window.sessionStorage.getItem('currentUser') as string) : {};
      searchInput.value = router.currentRoute.value.query?.search as string || "";
    }, { immediate: true });

    const columns = [
      {
        title: '用户头像',
        dataIndex: 'avatar_url',
        width: 80,
        slotName: 'avatar',
      },
      {
        title: "用户昵称",
        dataIndex: "nick_name",
        width: 130,
      },
      {
        title: "用户手机号",
        dataIndex: "user_phone",
        width: 130,
        slotName: "member_status",
      },
      {
        title: "激活时间",
        dataIndex: "create_time",
        width: 160,
      },
      {
        title: "最近访问时间",
        dataIndex: "update_time",
        width: 160,
      },
      {
        title: '分成余额',
        dataIndex: 'user_amount',
        width: 100,
      },
      {
        title: "操作",
        slotName: "optional",
        width: 200,
      },
    ];
    const data = ref([]);

    function getUserInfo(ignoreSearch?: boolean) {
      if (searchInput.value.length > 0 && !ignoreSearch) {
        onSearch();
        return;
      }
      currentUser.value = {};
      currentUserRelate.value = '';
      curPage.value = 1;
      getDataByPage(curPage.value);
    }

    onMounted(() => {
      if (currentUserId.value) {
        getRelateUser(currentUserRelate.value, currentUserId.value);
      } else {
        getUserInfo();
      }
    });

    onUpdated(() => {
      if (currentUserId.value) {
        getRelateUser(currentUserRelate.value, currentUserId.value);
      } else {
        getUserInfo();
      }
    });

    function onSearch() {
      currentUser.value = {};
      currentUserRelate.value = '';
      curPage.value = 1;
      
      if (searchInput.value.length < 1) {
        getUserInfo();
        return;
      }
      // console.log(searchInput.value);
      searchUser(searchInput.value)
        .then((res: any) => {
          data.value = res.map((item: any) => {
            return item;
          })
          total.value = res.length;
          curPage.value = 1;
        }).catch((error) => {
          console.error(error);
        });
    }

    function goToPage(relation: string, user: any) {
      window.sessionStorage.setItem('currentUser', JSON.stringify(user));
      router.push({
        path: '/users',
        query: {
          userId: user.id,
          relate: relation,
        }
      });
    }

    function goToUsers() {
      window.sessionStorage.removeItem('currentUser');
      router.push({
        path: '/users',
      });
    }

    function getRelateUser(relation: string, userId: string) {
      searchInput.value = '';
      if (relation === 'up') {
        // 获取上级用户
        // currentUserRelate.value = '上级用户';
        getUpRelateUser(userId).then((res: any) => {
          data.value = res.map((item: any) => {
            return item;
          })
          total.value = res.length;
          curPage.value = 1;
        })
      } else if (relation === 'down') {
        // 获取下级用户
        // currentUserRelate.value = '下级用户';
        getDownRelateUser(userId).then((res: any) => {
          data.value = res.map((item: any) => {
            return item;
          })
          total.value = res.length;
          curPage.value = 1;
        });
      } else if (relation === 'first') {
        // 获取一级用户
        // currentUserRelate.value = '一级用户';
        getDownRelateLevelUser(userId, 1).then((res: any) => {
          data.value = res.map((item: any) => {
            return item;
          })
          total.value = res.length;
          curPage.value = 1;
        });
      } else if (relation === 'second') {
        // 获取二级用户
        // currentUserRelate.value = '二级用户';
        getDownRelateLevelUser(userId, 2).then((res: any) => {
          data.value = res.map((item: any) => {
            return item;
          })
          total.value = res.length;
          curPage.value = 1;
        });
      }
    }

    function getDataByPage(page: number) {
      curPage.value = page;
      getUserInfoService(page).then((res: any) => {
        data.value = res.list.map((item: any) => {
          return item;
        })
        total.value = res.total;
      });
    }

    return {
      columns,
      data,
      searchInput,
      onSearch,
      getUserInfo,
      total,
      curPage,
      getDataByPage,
      formatLocalDate,
      getRelateUser,
      currentUserRelate,
      currentUser,
      goToPage,
      goToUsers,
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
