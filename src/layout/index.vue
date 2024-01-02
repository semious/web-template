<template>
    <a-layout class="layout">
        <div class="layout-navbar">
            <NavBar />
          </div>
        <a-layout>
            <a-layout>
                <a-layout>
                    <a-layout-sider class="layout-sider" :width="menuWidth">
                        <div class="app-info"><img
                            width="28" src="@/assets/images/logo.png"
                          /><span v-if="!collapsed">成衣制作</span></div>
                        <a-menu :default-open-keys="['0']" :default-selected-keys="['0_2']" show-collapse-button
                            breakpoint="xl" @collapse="onCollapse" :collapsed="collapsed">
                            <a-menu-item :class="[idx == currentIdx ? 'menu-selected' : '']"  :key="item.key" v-for="(item,idx) in menuList" @click="goPath(item)">
                                <template #icon>
                                    <img v-if="idx == currentIdx" :src="item.pathIconSelect">
                                    <img v-else :src="item.pathIcon">
                                </template>
                                {{item.name}}
                            </a-menu-item>
                        </a-menu>
                    </a-layout-sider>
                </a-layout>

                <a-layout class="layout-content"  :style="paddingStyle">
                    <a-layout-content>
                        <PageLayout />
                    </a-layout-content>
                </a-layout>
            </a-layout>

        </a-layout>

    </a-layout>
</template>
<script lang="ts" setup>
    import { ref,computed,watch  } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import { Message } from '@arco-design/web-vue';
    import PageLayout from './page-layout.vue';
    import NavBar from '@/components/navbar/index.vue';

    const router = useRouter();
    const route = useRoute();
    const menuList = ref([]);
    menuList.value = [{
        key: 0,
        name: "用户管理",
        pathName: "User",
        pathIcon: new URL("@/assets/images/pathIcon/icon_user.png",import.meta.url).href,
        pathIconSelect: new URL("@/assets/images/pathIcon/icon_user_select.png",import.meta.url).href,
    },{
        key: 0,
        name: "款式管理",
        pathName: "Style",
        pathIcon: new URL("@/assets/images/pathIcon/icon_style.png",import.meta.url).href,
        pathIconSelect: new URL("@/assets/images/pathIcon/icon_tuceng_select.png",import.meta.url).href,
    },{
        key: 0,
        name: "标准码上传",
        pathName: "Standard",
        pathIcon: new URL("@/assets/images/pathIcon/general_book.png",import.meta.url).href,
        pathIconSelect: new URL("@/assets/images/pathIcon/general_book_select.png",import.meta.url).href,
    },{
        key: 0,
        name: "CAD图上传",
        pathName: "Cad",
        pathIcon: new URL("@/assets/images/pathIcon/icon_cad.png",import.meta.url).href,
        pathIconSelect: new URL("@/assets/images/pathIcon/icon_cad_select.png",import.meta.url).href,
    },{
        key: 0,
        name: "图层解析",
        pathName: "Layer",
        pathIcon: new URL("@/assets/images/pathIcon/icon_tuceng.png",import.meta.url).href,
        pathIconSelect: new URL("@/assets/images/pathIcon/icon_tuceng_select.png",import.meta.url).href,
    },{
        key: 0,
        name: "智能生成",
        pathName: "Create",
        pathIcon: new URL("@/assets/images/pathIcon/ai_create.png",import.meta.url).href,
        pathIconSelect: new URL("@/assets/images/pathIcon/ai_create_select.png",import.meta.url).href,
    },{
        key: 0,
        name: "示例",
        pathName: "Clothing",
        pathIcon: new URL("@/assets/images/pathIcon/ai_create.png",import.meta.url).href,
        pathIconSelect: new URL("@/assets/images/pathIcon/ai_create_select.png",import.meta.url).href,
    }]
    const navbarHeight = `75px`;
    const collapsed = ref(false);
    const currentIdx = ref(0);
    
    currentIdx.value = menuList.value.findIndex((item)=>{
        return item.pathName == route.name;
    })
    watch(
      () => route.name,
      (val, oval) => {
        currentIdx.value = menuList.value.findIndex((item)=>{
            return item.pathName == route.name;
        })
      }
    );

    console.log("route",route,"currentIdx",currentIdx.value)
    const menuWidth = computed(() => {
        console.log("collapsed",collapsed)
        return collapsed.value ? 48 : 144;
    });
    const paddingStyle = computed(() => {
        const paddingLeft = { paddingLeft: `${menuWidth.value}px` };
        const paddingTop ={ paddingTop: navbarHeight }
        return { ...paddingLeft, ...paddingTop };
    });
    const onCollapse = (val, type) => {
        console.log("val", val)
        collapsed.value = val;
    }

    const goPath = (item) => {
        router.push({ name: item.pathName });
    }

</script>
<style lang="less" scoped>
    @nav-size-height: 70px;
    @layout-max-width: 1100px;

    .layout {
        width: 100%;
        height: 100%;
    }

    .layout-navbar {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 100;
        width: 100%;
        height: @nav-size-height;
    }

    .layout-sider {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 999;
        height: 100%;
        transition: all 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
        box-shadow: none;
        .app-info {
            padding: 24px 0;
            display: flex;
            justify-content: center;
            align-items: center;
            
            span {
                font-size: 16px;
                font-weight: 500;
                color: #1D2129;
                margin-left: 2px;
            }
        }
        :deep(.arco-menu) {
            height:100%;
            .arco-menu-inner {
                padding-top: 45px;
                .arco-menu-icon {
                    img {
                        width: 14px;
                    }
                }
            }
        }
        /* &::after {
            position: absolute;
            top: 0;
            right: -1px;
            display: block;
            width: 1px;
            height: 100%;
            background-color: var(--color-border);
            content: '';
        } */

        > :deep(.arco-layout-sider-children) {
            overflow-y: hidden;
            display: flex;
            flex-direction: column;
        }

        .menu-selected {
            background: transparent;
            
            :deep(.arco-menu-title) {
                font-size: 14px;
                font-weight: bolder;
                color: #165DFF;
            }
        }
    }

    .layout-content {
        min-height: 100vh;
        overflow-y: hidden;
        background-color: #F7F8FA;
        transition: padding 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
        
    }
</style>