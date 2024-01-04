<template>
    <a-layout class="container">
        <CodeSearch @searchKeyword="searchKeyword"></CodeSearch>
        <a-space style="margin-top:30px;">
            <div class="text">筛选</div>
            <a-radio-group v-model="tagValue" type="button">
                <a-radio value="1" @click="timeFilter(1)">最近一周更新</a-radio>
                <a-radio value="2"  @click="timeFilter(2)">最近一月更新</a-radio>
                <a-radio value="3" @click="timeFilter(3)">最近一周新增</a-radio>
                <a-radio value="4"  @click="timeFilter(4)">最近一月新增</a-radio>
                <a-radio value="all" @click="timeFilter()">全部</a-radio>
            </a-radio-group>
        </a-space>
        <a-space style="margin-top:20px;">
            <a-radio-group v-model="tagStatus" type="button">
                <a-radio value="1" @click="filterStatus(1)">初始</a-radio>
                <a-radio value="2" @click="filterStatus(2)">已上传</a-radio>
                <a-radio value="3"  @click="filterStatus(3)">生成中</a-radio>
                <a-radio value="4"  @click="filterStatus(4)">已完成</a-radio>
                <a-radio value="all"  @click="filterStatus()">全部</a-radio>
            </a-radio-group>
        </a-space>
        <a-space style="margin-top: 27px;">
            <a-button type="primary" @click="addUser">
                <template #icon>
                    <icon-plus />
                </template>
                新增款式
            </a-button>
        </a-space>
        <a-table style="margin-top: 24px;width: 1200px;" filter-icon-align-left :columns="columns" :data="data">
            <template #optional="{ record }">
                <a-button type="text" size="small" @click="deleteUser">删除</a-button>
                <a-button type="text" size="small" @click="updateUser(1)">修改</a-button>
            </template>
        </a-table>
        <a-modal v-model:visible="visible" @ok="handleOk" @cancel="handleCancel">
            <template #title>
                是否禁用该用户
            </template>
            <div>禁用该用户后则该用户无法登录</div>
        </a-modal>
        <a-modal v-model:visible="visibleDelete"  @ok="handleDeleteOk" @cancel="handleDeleteCancel">
            <template #title>
                是否删除该款式  
            </template>
            <div>是否删除该款式</div>
        </a-modal>
        <StyleAdd :userTitle="userTitle" :visibleAdd="visibleAdd" @closeDrawer="closeDrawer" :isModify="isModify"></StyleAdd>
    </a-layout>
</template>
<script lang="ts" setup>

    import { ref, onMounted, computed, reactive, watch, onUpdated, onUnmounted } from "vue";
    import { getStyleList,deleteStyle } from "@/api/style";
    import CodeSearch from "@/components/codeSearch/styleSearch.vue";
    import StyleAdd from "@/components/styleAdd/index.vue";
    
    const columns = [{
        title: '款式ID',
        dataIndex: 'styleCode',
        width: 125
    },
    {
        title: '名称',
        dataIndex: 'styleName',
        width: 130
    },
    {
        title: '客户',
        dataIndex: 'custom',
        width: 100
    },
    {
        title: '新增时间',
        dataIndex: 'createTime',
        width: 170,
    }, {
        title: '纸样师',
        dataIndex: 'paperUserName',
        width: 120
    }, {
        title: '设计师',
        dataIndex: 'designerName',
        width: 120
    }, {
        title: '效果图',
        dataIndex: 'effectImg',
        width: 80
    }, {
        title: '状态',
        dataIndex: 'styleStatus',
        width: 80
    }, {
        title: '备注',
        dataIndex: 'styleRemark',
        width: 100
    }, {
        title: '操作',
        slotName: 'optional',
        width: 160,
        align: 'center'
    }]
    const tagStatus = ref("");
    const data = [{
       
    }]
    const tagValue = ref("");

    const visible = ref(false);

    const disabledEnabled = () => {
        visible.value = true;
    }

    const handleOk = () => {
        visible.value = false;
    }

    const handleCancel = () => {
        visible.value = false;
    }

    const visibleDelete = ref(false);
    const deleteUser = () => {
        visibleDelete.value = true;
    }
    const handleDeleteOk = () => {
        visibleDelete.value = false;
        let deleteId = "1";
        deleteStyle(deleteId).then((res)=> {

        })
    }
    const handleDeleteCancel = () => {
        visibleDelete.value = false;
    }

    const visibleAdd = ref(false);
    const userTitle = ref("");
    const addUser = () => {
        userTitle.value = "新增款式";
        visibleAdd.value = true;
    }
    const isModify = ref(0);
    const updateUser = (val:number) => {
        userTitle.value = "修改款式";
        visibleAdd.value = true;
        isModify.value = val;
    }

    const closeDrawer = () => {
        visibleAdd.value = false;
    }
   
    const queryParams = ref({
        styleCode: "",
        timeFilter: "",
        status: "",
        page: 1
    });

    const getStyleListReq = () => {
        getStyleList(queryParams.value).then((res) => {
            console.log("getStyleList",res)
        })
    }
    getStyleListReq();

    const searchKeyword = (val:any) => {
        queryParams.value.styleCode = val;
        getStyleListReq();
    }

    const timeFilter = (val:any) => {
        queryParams.value.timeFilter = val;
        getStyleListReq();
    }

    const filterStatus = (val:any) => {
        queryParams.value.status = val;
        getStyleListReq()
    }
</script>
<style lang="less" scoped>
    .container {
        padding: 24px 0 0 46px;

        :deep(.arco-space) {
            display: flex;
            font-size: 32px;

            .search-input {
                width: 388px;
                height: 32px;
                background: #FFFFFF;
                border-radius: 2px 2px 2px 2px;
                opacity: 1;
            }

            .arco-space-item {
                margin-right: 0 !important;
            }

            .text {
                font-size: 14px;
                font-weight: 400;
                color: #1D2129;
                padding-right: 20px;
                line-height: 32px;
            }

            .tag-content {
                height: 32px;
                background: #F2F3F5;
                border-radius: 2px 2px 2px 2px;
                opacity: 1;
                display: flex;
            }

            .arco-tag-size-large {
                line-height: 32px !important;
            }

            .tag-checked {
                background: #FFFFFF !important;
                border-radius: 2px 2px 2px 2px;
                opacity: 1;
            }
        }

    }
</style>