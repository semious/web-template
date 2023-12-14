<template>
  <Layout active="1">
    <template #content>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>客服后台</el-breadcrumb-item>
        <el-breadcrumb-item>提现审核</el-breadcrumb-item>
      </el-breadcrumb>
      <a-layout class="flex-center mt-3">
        <h3>提现申请记录</h3>
        <a-layout-content>
          <div class="flex justify-between mb-6 align-center ">
            <div class="text-danger">在微信商户后台支付成功后，再逐个点击“通过”按钮确认</div>
            <div>
              <a-button size="small" @click="() => { createPaymentChart(); }">生成付款信息</a-button>
              <a-button size="small" type="text"
                href="https://tg.yuanzixx.cn/public/scene_transfer_default_template.xls">付款模板下载</a-button>
            </div>
          </div>
          <a-table row-key="id" :row-selection="rowSelection" v-model:selectedKeys="selectedKeys" :loading="isLoading"
            size="small" class="mb-12" :pagination="false" :columns="columns" :data="data" stripe>
            <template #action="{ record }">
              <div v-if="record.withdraw_status === 1">
                <a-popconfirm type="warning"
                  @ok="() => { updateData(record.id, 3, record.user_id, record.withdraw_amount) }" content="请再次确认?">
                  <a-button size="small" type="primary" status="danger" class="mr-6">拒绝</a-button>
                </a-popconfirm>
                <a-popconfirm type="warning"
                  @ok="() => { updateData(record.id, 2, record.user_id, record.withdraw_amount) }" content="请再次确认?">
                  <a-button size="small" status="success">通过</a-button>
                </a-popconfirm>
              </div>
            </template>
          </a-table>
          <a-pagination :pageSize="10" @change="() => { curPage++; getData() }" :current="curPage"
            :style='{ "justify-content": "flex-end" }' :total="total" />
          <div v-if="showChart">
            <h3>付款信息</h3>
            <table class="payment_container">
              <tr v-for="(item, index) in paymentChart" :key="index">
                <td class="bg-normal font-weight-bold">
                  <div>{{ item.title }}</div>
                </td>
                <td>{{ item.value }}</td>
              </tr>
            </table>
            <table class="mt-1 payment_container">
              <thead>
                <th class="bg-normal">商家明细单号（必填）</th>
                <th class="bg-normal">用户openid（必填）</th>
                <th class="bg-normal">收款用户姓名（选填）</th>
                <th class="bg-normal">收款用户身份证（选填）</th>
                <th class="bg-normal">收款金额（必填，单位：元）</th>
                <th class="bg-normal">收款备注（选填）</th>
              </thead>
              <tr v-for="(list, index) in paymentDetail" :key="index">
                <td v-for="(item) in list">{{ item }}</td>
              </tr>
            </table>
          </div>
        </a-layout-content>
      </a-layout>
    </template>
  </Layout>
</template>

<script lang="ts">
import { ref, onMounted, computed, reactive, watch } from "vue";
import { Message } from '@arco-design/web-vue';
import { useRouter } from 'vue-router';

import Layout from "@/components/Layout.vue";
import { getWithdrawQuery, updateWithdraw } from "@/api/withdraw";
import moment from "moment";

export default {
  name: "App",
  components: {
    Layout,
  },
  setup() {
    const router = useRouter();
    const route = router.currentRoute;
    const total = ref(0);
    const curPage = ref(1);
    const isLoading = ref(false);
    const selectedKeys = ref<any>([]);
    const showChart = ref(false);

    const rowSelection = {
      type: 'checkbox',
      showCheckedAll: false,
    };

    const columns = [
      {
        title: '申请时间',
        dataIndex: 'apply_time',
      },
      {
        title: "用户微信",
        dataIndex: "withdraw_wx",
        width: 100,
      },
      {
        title: "用户手机",
        dataIndex: "user_phone",
        width: 140,
      },
      {
        title: "操作客服",
        dataIndex: "audit_admin_name",
        width: 100,
      },
      {
        title: "申请金额",
        dataIndex: "withdraw_amount",
        width: 100,
      },
      {
        title: "当前状态",
        dataIndex: "withdraw_status",
        width: 150,
        // 1:申请中,
        // 2:审核通过,
        // 3:审核不通过,
        // 4:支付成功,
        // 5:支付失败
        render: (item: any) => {
          switch (item.record.withdraw_status) {
            case 1:
              return "申请中";
            case 2:
              return "审核通过";
            case 3:
              return "审核不通过"
            case 4:
              return "支付成功";
            case 5:
              return "支付失败";
            default:
              return "未知";
          }
        },
      },
      {
        title: "审批操作",
        slotName: "action",
      },
    ];

    const paymentChart = ref([
      {
        title: '商家批次单号（必填）',
        value: '',
      },
      {
        title: '批次名称（必填）',
        value: '',
      },
      {
        title: '转账appid（必填）',
        value: 'wxef8f68edace82cbf',
      },
      {
        title: '转账总金额（必填，单位：元）',
        value: 0,
      },
      {
        title: '转账总笔数（必填）',
        value: 0,
      },
      {
        title: '批次备注（必填）',
        value: '',
      },
      {
        title: '场景ID（必填）',
        value: '1000',
      },
    ]);

    const paymentDetail = ref<any[]>([])

    const data = ref<any[]>([]);

    onMounted(() => {
      getData();
    });

    function getData() {
      isLoading.value = true;
      // console.log(searchInput.value);
      getWithdrawQuery(curPage.value).then((res: any) => {
        isLoading.value = false;
        const output: any[] = []
        res.list.forEach((item: any) => {
          if (item.withdraw_status === 1) {
            item.disabled = false;
            output.unshift(item)
          } else {
            item.disabled = true;
            output.push(item)
          }
        })
        total.value = Number(res.total);
        data.value = output;
      }).catch((error) => {
        console.error(error);
      });
    }

    function updateData(id: string, status: number, userId: string, amount: string) {
      isLoading.value = true;
      updateWithdraw(id, status, userId, amount).then(res => {
        getData();
      }).catch(error => {
        Message.error('操作失败, 请稍后重试');
        console.error(error);
      }).finally(() => {
        isLoading.value = false;
      })
    }

    function createPaymentChart() {
      console.log('selectedKeys :>> ', selectedKeys.value);
      if (selectedKeys.value.length === 0) {
        Message.error('请先选择要付款的记录');
        return;
      }

      const selectItems = data.value.filter((item: any) => {
        return selectedKeys.value.includes(item.id);
      });

      const totalAmount = selectItems.reduce((total: number, item: any) => {
        return total + Number(item.withdraw_amount);
      }, 0);

      paymentChart.value[0].value = moment().format('YYYYMMDDHHmmss');
      paymentChart.value[1].value = moment().format('YYYYMMDDHHmmss');
      paymentChart.value[3].value = totalAmount;
      paymentChart.value[4].value = selectItems.length;
      paymentChart.value[5].value = `${moment().format('YYYYMMDDHHmmss')}_${sessionStorage.getItem('usernames')}`;

      console.log('selectItems :>> ', selectItems);
      const list: any[] = [];
      selectItems.forEach((item: any) => {
        list.push([item.user_id, item.wx_open_id, '', '', item.withdraw_amount, '巴比伦数列》提现'])
      })
      paymentDetail.value = list;
      console.log('paymentDetail :>> ', paymentDetail.value);
      showChart.value = true;
    }

    return {
      columns,
      data,
      getData,
      total,
      curPage,
      isLoading,
      updateData,
      rowSelection,
      selectedKeys,
      createPaymentChart,
      paymentChart,
      paymentDetail,
      showChart,
    };
  },
};
</script>
    
<style scoped lang="less">
.payment_container {
  border: 1px solid #ccc;
  border-collapse: collapse;

  th,
  td {
    border: 1px solid #ccc;
    border-collapse: collapse;
  }

  th,
  td {
    padding: 5px 10px;
  }
}
</style>
