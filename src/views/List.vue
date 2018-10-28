<template>
  <v-app id="inspire">
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
    <!-- 左侧sidebar -->
    <v-navigation-drawer style="background:#001529" dark v-model="drawer" fixed app mobile-break-point="960" width="230">
      <v-toolbar height="50" style="background:#002140" flat>
        <v-icon medium>account_balance_wallet</v-icon>
        <v-toolbar-title style="font-size:18px">WWWCion平台</v-toolbar-title>
      </v-toolbar>
      <v-list style="background:#001529" dense>
        <v-list-group
          prepend-icon="monetization_on"
          value="false"
          no-action
          v-for="item in nav"
        >
          <v-list-tile slot="activator">{{item.name}}</v-list-tile>
          <v-list-tile v-for="n in item.data"
          class="menuList" @click="changeMenu(item.name,n)">{{n.name}}</v-list-tile>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <!-- 头部header -->
    <v-toolbar height="50" fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer">
        <v-icon v-if="drawer">format_indent_decrease</v-icon>
        <v-icon v-else>format_indent_increase</v-icon>
      </v-toolbar-side-icon>
      <!-- <v-toolbar-title>
        <img class="logo" src="@/assets/logo.png" height="38px" width="38px">
      </v-toolbar-title> -->
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-menu offset-y right>
          <v-btn slot="activator" small flat>{{user_name}}</v-btn>
          <v-list>
            <v-list-tile>
              <v-list-tile-title disabled>角色：{{user_info.role_name}}</v-list-tile-title>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-title disabled>余额：{{user_info.balance}}</v-list-tile-title>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-title disabled>eth地址：{{user_info.eth_addr}}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-btn icon @click="logout=!logout">
          <v-icon>power_settings_new</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <!-- 主体content -->
    <v-content style="background:#eee">
      <v-container md-10 fluid fill-height>
        <v-layout justify-center>
          <!-- <v-flex xs12 md10 lg9 xl8 text-xs-center> -->
          <v-flex xs12 text-xs-center>
            <v-breadcrumbs class="px-4 py-2 white"
            style="margin:-15px -15px 20px -15px">
              <v-icon color="grey lighten-1" slot="divider">chevron_right</v-icon>
              <v-breadcrumbs-item
                v-for="item in items"
                disabled
                :key="item.text"
              >
                {{ item.text }}
              </v-breadcrumbs-item>
            </v-breadcrumbs>
            <div v-if="view=='transfer'">
              <v-layout v-bind="binding" row justify-space-around>
                <v-flex mb-3 xs12 sm5 md4 lg3 xl3>
                  <v-card>
                    <v-card-text class="pa-1">
                      <h3 class="headline pt-2">
                        <span class="body-1">持有</span>
                        <span class="mx-2">{{balance}}</span>
                        <span class="body-1">WWWCion</span>
                      </h3>
                      <v-layout align-center justify-space-around>
                        <v-btn small color="error" flat  @click="dialog = true">转账</v-btn>
                        <v-btn small color="info" flat>提现</v-btn>
                      </v-layout>
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex mb-3 xs12 sm5 md4 lg3 xl3>
                  <v-card>
                    <v-card-text class="pa-1">
                      <h3 class="headline pt-2">
                        <span class="body-1">价值</span>
                        <span class="mx-2">{{balance}}</span>
                        <span class="body-1">$</span>
                      </h3>
                      <v-layout align-center justify-space-around>
                        <v-btn small color="info" disabled flat></v-btn>
                        <v-btn small color="info" flat>提现</v-btn>
                      </v-layout>
                    </v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
              <transfer-table/>
            </div>
            <user-table v-if="view=='user'"/>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>

    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="title grey lighten-2" primary-title>
          转WWWCion给商家
        </v-card-title>

        <v-card-text class="px-5">
          <v-text-field v-model="address" label="地址" required></v-text-field>
          <v-text-field v-model="number" label="数量" required></v-text-field>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="primary" flat @click="dialog = false">
            取消
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="zhuanzhang">
            转账
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="logout" width="300">
      <v-card>
        <v-card-title class="title error white--text lighten-2" primary-title>
          退出
        </v-card-title>
        <v-card-text class="px-5">
          您将要退出此账号
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" flat @click="logout = !logout">
            取消
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="error" flat @click="logoutBt">
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
  import transferTable from '../components/transferTable.vue'
  import userTable from '../components/userTable.vue'
  export default {
    components: {
      transferTable,
      userTable
    },
    data: () => ({
      nav: [
        {
          name: 'WWWCion管理',
          data: [
            {
              name: '转账记录',
              src: 'transfer'
            }
          ]
        },
        {
          name: '用户管理',
          data: [
            {
              name: '角色设置',
              src: 'user'
            }
          ]
        }
      ],
      items: [
        {
          text: 'WWWCion管理'
        },
        {
          text: '转账记录'
        }
      ],
      view: 'transfer',
      logout: false,
      ai: {
        state: false,
        type: 'success',
        text: '111'
      },
      drawer: true,
      dialog: false,
      address: '',
      number: null
    }),
    computed: {
      binding () {
        const binding = {}
        if (this.$vuetify.breakpoint.xs) binding.column = true
        return binding
      },
      balance () {
        return localStorage.getItem('balance')
      },
      user_name () {
        return localStorage.getItem('user_name')
      },
      role_name () {
        return localStorage.getItem('role_name')
      },
      user_info () {
        return JSON.parse(localStorage.getItem('user_info'))
      }
    },
    mounted () {
      console.log(this.user_info);
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
      changeMenu (m,n) {
        this.items = [
          {
            text: m
          },
          {
            text: n.name
          }
        ]
        this.view = n.src
      },
      logoutBt () {
        let vm = this
        fetch(vm.api_url+'/user?action=logout',{
          method: 'POST',
          headers:{
            'X-Auth-Token': localStorage.getItem('token')
          }
        }).then(res=>res.json()).then(data => {
          localStorage.clear()
          location.href = '/login'
        }).catch(data => {
          localStorage.clear()
          location.href = '/login'
        })
      },
      zhuanzhang () {
        let vm = this
        fetch(vm.api_url+'/transfer',{
          method: 'POST',
          headers:{
            'Content-Type': 'application/json',
            'X-Auth-Token': localStorage.getItem('token')
          },
          body: JSON.stringify({
            t_eth_addr: vm.address,
            amount: vm.number,
            to: 'local'
          })
        }).then(res=>res.json()).then(data => {
          if (data==401) {
            localStorage.clear()
            location.href = '/login'
          } else if (data.code!=0) {
            vm.showAlert('error',data.message)
          } else {
            vm.dialog = false
            vm.showAlert('success','转账成功！')
          }
        }).catch(data => {
          vm.showAlert('error','转账失败！')
        })
      }
    },
    props: {
      source: String
    }
  }
</script>

<style scoped>
  body{
    padding-top: 20px;
  }
  .logo{
    display: block;
  }
  .menuList{
    background:#000C17;
    color: #969BA0;
  }
  .v-list__group--active::before,.v-list__group--active::after{
    background: none !important;
  }
</style>
