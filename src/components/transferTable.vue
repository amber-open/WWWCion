<template>
  <div class="">
    <v-alert
      style="position:fixed;top:20px;right:0px;min-width:280px;z-index:100000"
      :value="true"
      dismissible
      v-model="ai.state"
      :type="ai.type"
      transition="slide-y-reverse-transition"
    >
      {{ai.text}}
    </v-alert>
    <v-layout v-bind="binding" row justify-space-around>
      <v-flex mb-3 xs12 sm5 md4 lg3 xl3>
        <v-card>
          <v-card-text class="pa-1">
            <h3 class="headline pt-2">
              <span class="body-1">持有</span>
              <span class="mx-2">{{balance|money}}</span>
              <span class="body-1">积分</span>
            </h3>
            <v-layout align-center justify-space-around>
              <v-btn small color="error" flat @click="showForm('转积分给商家','local')">转账</v-btn>
              <v-btn small color="info" flat @click="showForm('提现到ETH地址','eth')">提现</v-btn>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex mb-3 xs12 sm5 md4 lg3 xl3>
        <v-card>
          <v-card-text class="pa-1">
            <h3 class="headline pt-2">
              <span class="body-1">价值</span>
              <span class="mx-2">{{balance*20|money}}</span>
              <span class="body-1">$</span>
            </h3>
            <v-layout align-center justify-space-around>
              <v-btn small color="error" disabled flat @click="showForm('转积分给商家','local')"></v-btn>
              <v-btn small color="info" flat @click="showForm('提现到ETH地址','eth')">提现</v-btn>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-data-table
      :headers="headers"
      :items="list"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.from_addr }}</td>
        <td class="text-xs-left">{{ $t(props.item.type) }}</td>
        <td class="text-xs-left">{{ props.item.balance }}</td>
        <td class="text-xs-left">{{ props.item.created_at }}</td>
        <td class="text-xs-left">{{ props.item.amount }}</td>
      </template>
    </v-data-table>
    <div style="max-width:666px;margin:10px auto 0 auto" class="text-xs-center">
      <v-pagination
        v-model="page"
        :length="pl"
      ></v-pagination>
    </div>
    <p class="mt-2 mb-0 pl-1 caption" style="text-align:left;color:#666">
      共{{count}}条记录，第{{page}}/{{pl}}页
    </p>

    <!-- 转账框 -->
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="title grey lighten-2" primary-title>
          {{fTitle}}
        </v-card-title>
        <v-card-text class="px-5">
          <v-text-field v-model="address" label="地址" required></v-text-field>
          <v-text-field v-model="number" label="数量" required></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="grey darken-1" flat @click="dialog = false">
            取消
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="zhuanzhang">
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  import { xhr_getTransfers, xhr_postTransfer } from '@/api/index'
  export default {
    data () {
      return {
        page: 1,
        length: 8,
        pl: 0,
        count: 0,
        dialog: false,
        address: '',
        number: null,
        headers: [
          {
            text: '来源',
            sortable: false,
            value: 'from_addr'
          },
          { text: '类型', value: 'type' },
          { text: '数量', value: 'balance' },
          { text: '时间', value: 'created_at' },
          { text: '金额', value: 'amount' },
        ],
        ai: {
          state: false,
          type: 'success',
          text: '111'
        },
        fTitle: '',
        zTo: '',
        balance: 0,
        list: []
      }
    },
    watch: {
      page (n, o) {
        let vm = this
        vm.getList(vm.length*(n-1),vm.length)
      }
    },
    computed: {
      binding () {
        const binding = {}
        if (this.$vuetify.breakpoint.xs) binding.column = true
        return binding
      }
    },
    mounted () {
      let vm = this
      let clientHeight=0;
      if (document.body.clientHeight&&document.documentElement.clientHeight) {
        clientHeight = (document.body.clientHeight<document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
      } else {
        clientHeight = (document.body.clientHeight>document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
      }
      vm.length = document.documentElement.clientWidth < 500 ? 10 : Math.floor((clientHeight-360)/48)
      vm.getList(vm.length*(vm.page-1),vm.length)
      vm.balance = localStorage.getItem('balance')
    },
    methods: {
      showAlert (t,m) {
        let vm = this
        vm.ai = {
          state: true,
          type: t,
          text: m
        }
        setTimeout(() => {vm.ai.state = false}, 3000)
      },
      getList (s,l) {
        let vm = this
        xhr_getTransfers(s,l).then(function (response) {
          vm.list = response.data.data
          vm.count = response.data.count
          vm.pl = Math.ceil(response.data.count/vm.length)
        })
      },
      showForm (title, to) {
        let vm = this
        vm.dialog = true
        vm.fTitle = title
        vm.zTo = to
      },
      zhuanzhang () {
        let vm = this
        xhr_postTransfer({
          t_eth_addr: vm.address,
          amount: vm.number,
          to: vm.zTo
        }).then(function (response) {
          if (response.data.code!=0) {
            vm.showAlert('error',response.data.message)
          } else {
            vm.dialog = false
            localStorage.setItem('balance',response.data.data.balance)
            vm.balance = localStorage.getItem('balance')
            vm.page = 1
            vm.getList(vm.length*(vm.page-1),vm.length)
            vm.showAlert('success','转账成功！')
          }
        }).catch(function (error) {
          vm.showAlert('error', error.message)
        });
      }
    }
  }
</script>
