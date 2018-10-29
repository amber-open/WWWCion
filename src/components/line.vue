<template>
  <div>
    <v-alert
      style="position:fixed;top:50px;right:0px;min-width:280px;z-index:100000"
      :value="true"
      dismissible
      v-model="ai.state"
      :type="ai.type"
      transition="slide-y-reverse-transition"
    >
      {{ai.text}}
    </v-alert>
    <p style="text-align:left;color:#FF5252;background:#fff;padding: 5px 10px">
      单价 US$ {{prices.price*1|money}}/WWWCoin&emsp;
      <v-btn v-if="role_name=='admin'" small style="margin:0" color="error" @click="dialog2 = true">修改单价</v-btn>
    </p>
    <v-layout text-xs-center v-bind="binding" row justify-space-around>
      <v-flex mb-3 xs12 sm5 md4 lg3 xl3>
        <v-card>
          <v-card-text class="pa-1">
            <h3 class="headline pt-2">
              <span class="body-1">持有</span>
              <span class="mx-2">{{user_info.balance|money}}</span>
              <span class="body-1">WWWCoin</span>
            </h3>
            <v-layout align-center justify-space-around>
              <v-btn small class="px-3 mx-0 btmw" color="error" flat @click="showForm('转币','local')">转账</v-btn>
              <v-btn small class="px-3 mx-0 btmw" color="info" flat @click="showForm('提现到ETH地址','eth')">提现</v-btn>
              <v-btn small class="px-3 mx-0 btmw" color="error" v-if="role_name=='admin'" flat @click="balanceTK = true">修改</v-btn>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex mb-3 xs12 sm5 md4 lg3 xl3>
        <v-card>
          <v-card-text class="pa-1">
            <h3 class="headline pt-2">
              <span class="body-1">价值US$</span>
              <span class="mx-2">{{user_info.balance*prices.price|money}}</span>
              <!-- <span class="body-1">$</span> -->
            </h3>
            <v-layout align-center justify-space-around>
              <v-btn small class="px-3 mx-0 btmw" color="error" v-if="role_name=='admin'" disabled flat @click="showForm('转币','local')"></v-btn>
              <v-btn small class="px-3 mx-0 btmw" color="error" disabled flat @click="showForm('转币','local')"></v-btn>
              <v-btn small class="px-3 mx-0 btmw" color="info" flat @click="showForm('提现到ETH地址','eth')">提现</v-btn>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <div id="chartBox">
      <ve-line v-if="show" height="100%" :data="chartData" style="height:100%" :extend="extend"></ve-line>
    </div>

    <!-- 修改单价 -->
    <v-dialog v-model="dialog2" width="500">
      <v-card>
        <v-card-title class="error title white--text" primary-title>
          修改汇率
        </v-card-title>
        <v-card-text class="px-5">
          <v-text-field v-model="price" type="number" label="单价" required></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="grey darken-1" flat @click="dialog2 = false">
            取消
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="changePrice">
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 转账框 -->
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="title grey lighten-2" primary-title>
          {{fTitle}}
        </v-card-title>
        <v-card-text class="px-5">
          <v-text-field v-model="address" label="地址" required></v-text-field>
          <v-text-field v-model="number" type="number" label="数量" required></v-text-field>
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
    <!-- 设置balance -->
    <v-dialog v-model="balanceTK" width="500">
      <v-card>
        <v-card-title class="error title white--text" primary-title>
          设置Balance
        </v-card-title>
        <v-card-text class="px-5">
          <v-form ref="form" v-model="balanceValid">
            <v-select
              v-model="balanceInfo.direction"
              :items="types"
              item-text="name"
              item-value="direction"
              label="方式"
            ></v-select>
            <v-text-field
              type="number"
              v-model="balanceInfo.balance"
              :rules="balanceRules"
              label="Balance"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="grey darken-1" flat @click="balanceTK = false">取消</v-btn>
          <v-spacer></v-spacer>
          <v-btn :disabled="!balanceValid" color="primary" flat @click="setBalance">
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  import { xhr_getPriceHistory, xhr_postTransfer, xhr_getPrice, xhr_getUserInfo, xhr_putPrice, xhr_putBalance } from '@/api/index'

  import VeLine from 'v-charts/lib/line.common'
  export default {
    components: { VeLine },
    data () {
      return {
        balanceValid: false,
        balanceTK: false,
        balanceInfo: {
          direction: 'plus',
          balance: ''
        },
        types: [
          {name:'增加',direction:'plus'},
          {name:'减少',direction:'minus'}
        ],
        balanceRules: [
          v => !!v || '请填写Balance'
        ],
        show: false,
        dialog: false,
        dialog2: false,
        address: '',
        fTitle: '',
        zTo: '',
        number: null,
        user_info: {},
        extend:{
          series: {
            label: {
              normal: {
                show: true
              }
            }
          }
        },
        ai: {
          state: false,
          type: 'success',
          text: '111'
        },
        price: '',
        prices: '',
        balance: 0,
        chartData: {
          columns: ['日期', 'WWWCoin单价'],
          rows: [
          ]
        }
      }
    },
    computed: {
      role_name () {
        return localStorage.getItem('role_name')
      },
      binding () {
        const binding = {}
        if (this.$vuetify.breakpoint.xs) binding.column = true
        return binding
      }
    },
    mounted () {
      let vm = this
      setTimeout(function(){
        vm.show = true
      },200)
      vm.balance = localStorage.getItem('balance')
      xhr_getPriceHistory().then(function (response) {
        response.data.data.forEach( (n, i) => {
          vm.chartData.rows.push({
            '日期': n.created_at,
            'WWWCoin单价': n.price
          })
        })
      })
      vm.getPrice()
      vm.getInfo()
    },
    methods: {
      getInfo () {
        let vm = this
        xhr_getUserInfo().then(function (response) {
          vm.user_info = response.data.data
        })
      },
      setBalance () {
        let vm = this
        xhr_putBalance(vm.balanceInfo).then(function (response) {
          if (response.data.code!=0) {
            vm.showAlert('error',response.data.message)
          } else {
            vm.showAlert('success','修改Balance成功!')
            vm.getInfo()
            vm.balanceTK = false
          }
        }).catch(function (error) {
          vm.showAlert('error', error.message)
        });
      },
      getPrice () {
        let vm = this
        xhr_getPrice().then(function (response) {
          vm.prices = response.data.data[0]
        })
      },
      changePrice () {
        let vm = this
        xhr_putPrice({
          price_id: vm.prices.id,
          price: vm.price
        }).then(function (response) {
          if (response.data.code!=0) {
            vm.showAlert('error',response.data.message)
          } else {
            vm.showAlert('success','修改汇率成功！')
            vm.getPrice()
            vm.dialog2 = false
          }
        }).catch(function (error) {
          vm.showAlert('error', error.message)
        });
      },
      showAlert (t,m) {
        let vm = this
        vm.ai = {
          state: true,
          type: t,
          text: m
        }
        setTimeout(() => {vm.ai.state = false}, 3000)
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
        })
      }
    }
  }
</script>
<style scoped>
  .btmw{
    min-width: 0px
  }
  #chartBox{
    padding: 20px 20px 0 20px;
    background: #fff;
    box-sizing: border-box;
    height: calc(100vh - 300px);
  }
</style>
