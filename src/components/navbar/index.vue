<template>
    <div class="navbar">
      <ul class="right-side">
        <li>
          <a-dropdown trigger="click">
            <a-space class="user-name"><a-avatar
              :size="40"
              :style="{ marginRight: '8px', cursor: 'pointer' }"
            >
              <img alt="avatar" :src="avatar" />
              
            </a-avatar>张三峰</a-space>
            <template #content>
              <a-doption>
                <a-space @click="handleLogout">
                  <icon-export />
                  <span>
                    登出登录
                  </span>
                </a-space>
              </a-doption>
            </template>
          </a-dropdown>
        </li>
      </ul>
    </div>
  </template>
  
  <script lang="ts" setup>
    import { computed, ref, inject } from 'vue';
    import { Message } from '@arco-design/web-vue';
    import { useRouter } from 'vue-router';

    const router = useRouter();
    // import { useDark, useToggle, useFullscreen } from '@vueuse/core';
    // import useUser from '@/hooks/user';
    // const { logout } = useUser();
    // const { changeLocale, currentLocale } = useLocale();
    // const { isFullscreen, toggle: toggleFullScreen } = useFullscreen();
    // const locales = [...LOCALE_OPTIONS];
    const avatar = new URL("@/assets/images/avatar.png",import.meta.url).href;
    // const theme = computed(() => {
    //   return appStore.theme;
    // });
    // const topMenu = computed(() => appStore.topMenu && appStore.menu);
    // const isDark = useDark({
    //   selector: 'body',
    //   attribute: 'arco-theme',
    //   valueDark: 'dark',
    //   valueLight: 'light',
    //   storageKey: 'arco-theme',
    //   onChanged(dark: boolean) {
    //     // overridden default behavior
    //     appStore.toggleTheme(dark);
    //   },
    // });
    // const toggleTheme = useToggle(isDark);
    // const handleToggleTheme = () => {
    //   toggleTheme();
    // };
    // const setVisible = () => {
    //   appStore.updateSettings({ globalSettings: true });
    // };
    // const refBtn = ref();
    // const triggerBtn = ref();
    // const setPopoverVisible = () => {
    //   const event = new MouseEvent('click', {
    //     view: window,
    //     bubbles: true,
    //     cancelable: true,
    //   });
    //   refBtn.value.dispatchEvent(event);
    // };
    const handleLogout = () => {
      // logout();
      window.localStorage.setItem("userInfo","");
      router.push("Login")
    };
    // const setDropDownVisible = () => {
    //   const event = new MouseEvent('click', {
    //     view: window,
    //     bubbles: true,
    //     cancelable: true,
    //   });
    //   triggerBtn.value.dispatchEvent(event);
    // };
    // const switchRoles = async () => {
    //   const res = await userStore.switchRoles();
    //   Message.success(res as string);
    // };
    // const toggleDrawerMenu = inject('toggleDrawerMenu') as () => void;
  </script>
  
  <style scoped lang="less">
    .navbar {
      display: flex;
      justify-content: space-between;
      height: 100%;
      background-color: #3860F4;

      /* border-bottom: 1px solid var(--color-border); */
    }
  
    .left-side {
      display: flex;
      align-items: center;
      padding-left: 20px;
    }
  
    .center-side {
      flex: 1;
    }
  
    .right-side {
      display: flex;
      padding-right: 55px;
      list-style: none;
      flex:1;
      justify-content: flex-end;
      :deep(.locale-select) {
        border-radius: 20px;
      }

      .user-name {
        font-size: 14px;
        font-weight: 400;
        color: #fff;
        cursor: pointer;
      }

      li {
        display: flex;
        align-items: center;
        padding: 0 10px;
      }
  
      a {
        color: var(--color-text-1);
        text-decoration: none;
      }
      .nav-btn {
        border-color: rgb(var(--gray-2));
        color: rgb(var(--gray-8));
        font-size: 16px;
      }
      .trigger-btn,
      .ref-btn {
        position: absolute;
        bottom: 14px;
      }
      .trigger-btn {
        margin-left: 14px;
      }
    }
  </style>
  
  <style lang="less">
    .message-popover {
      .arco-popover-content {
        margin-top: 0;
      }
    }
  </style>
  