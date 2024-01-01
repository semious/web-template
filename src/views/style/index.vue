<template>
    <a-layout class="container">
        <a-space>
            <a-input class="search-input" placeholder="请输入款式ID进行筛选" allow-clear>
            </a-input>
            <a-button type="primary">查询</a-button>
            <a-button type="outline" style="margin-left: 26px;">查询全部</a-button>
        </a-space>
        <a-space style="margin-top:30px;">
            <div class="text">筛选</div>
            <a-radio-group v-model="tagValue" type="button">
                <a-radio value="lastWeek">最近一周更新</a-radio>
                <a-radio value="lastMonth">最近一月新增</a-radio>
                <a-radio value="all">全部</a-radio>
            </a-radio-group>
        </a-space>
        <a-space style="margin-top:20px;">
            <a-radio-group v-model="tagStatus" type="button">
                <a-radio value="done">已完成</a-radio>
                <a-radio value="making">生成中</a-radio>
                <a-radio value="all">全部</a-radio>
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
                <a-button type="text" size="small" @click="updateUser">修改</a-button>
            </template>
        </a-table>
        <a-modal v-model:visible="visible" @ok="handleOk" @cancel="handleCancel">
            <template #title>
                是否禁用该用户
            </template>
            <div>禁用该用户后则该用户无法登录</div>
        </a-modal>
        <a-modal v-model:visible="visibleDelete" @ok="handleDeleteOk" @cancel="handleDeleteCancel">
            <template #title>
                是否删除该用户
            </template>
            <div>删除该用户后需要重新添加账号才可以登录</div>
        </a-modal>
        <a-drawer :width="340" :visible="visibleAdd" @ok="handleAddOk" @cancel="handleAddCancel" unmountOnClose>
            <template #title>
                {{userTitle}}
            </template>
            <div>
                <a-form :model="form">
                    <a-form-item field="name" label="姓名">
                        <a-input v-model="form.name" placeholder="请输入姓名" />
                    </a-form-item>
                    <a-form-item field="phone" label="手机">
                        <a-input v-model="form.phone" placeholder="请输入手机号码" />
                    </a-form-item>
                    <a-form-item field="role" label="角色">
                        <a-radio-group v-model="form.role" type="button">
                            <a-radio value="designer">设计师</a-radio>
                            <a-radio value="maker">纸样师</a-radio>
                            <a-radio value="admin">管理员</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item field="password" label="密码">
                        <a-input v-model="form.password" placeholder="请输入用户密码" />
                        <a-button class="copy-btn" type="outline">复制</a-button>
                    </a-form-item>
                    <a-form-item field="remark" label="备注">
                        <a-input v-model="form.remark" placeholder="请输入备注" />
                    </a-form-item>

                </a-form>
            </div>
        </a-drawer>
    </a-layout>
</template>
<script lang="ts" setup>
    import { ref, onMounted, computed, reactive, watch, onUpdated, onUnmounted } from "vue";
    import clipboardJS from "clipboard";
    const columns = [{
        title: '款式ID',
        dataIndex: 'styleId',
        width: 125
    },
    {
        title: '名称',
        dataIndex: 'name',
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
        dataIndex: 'patternMaker',
        width: 120
    }, {
        title: '设计师',
        dataIndex: 'design',
        width: 120
    }, {
        title: '效果图',
        dataIndex: 'pic',
        width: 80
    }, {
        title: '状态',
        dataIndex: 'status',
        width: 80
    }, {
        title: '备注',
        dataIndex: 'remark',
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
    const form = reactive({
        name: '',
        phone: '',
        role: 'designer',
        password: '',
        remark: ''
    })
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
    }
    const handleDeleteCancel = () => {
        visibleDelete.value = false;
    }

    const visibleAdd = ref(false);
    const userTitle = ref("");
    const addUser = () => {
        userTitle.value = "新增用户";
        form.name = ""; 
        form.phone = "";
        form.role = "designer";
        form.password = "";
        form.remark = "";
    
        console.log("form",form)
        visibleAdd.value = true;
    }
    const updateUser = () => {
        userTitle.value = "修改用户";
        visibleAdd.value = true;
    }
    const handleAddOk = () => {
        visibleAdd.value = false;
    }
    const handleAddCancel = () => {
        visibleAdd.value = false;
    }
    const clipboard = new clipboardJS(".copy-btn", {
        text() {
            return form.password
        }
    })
    console.log("clipboard", clipboard)
    clipboard.on('success', () => {
        console.log("复制成功")
    })
    clipboard.on('error', () => {
        console.log("复制失败")
    })
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