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
    <v-navigation-drawer v-if="role_name=='admin'" v-model="drawer" fixed app>
      <v-list dense>
        <v-list-tile @click="view='transfer'" @click.stop="drawer = !drawer">
          <v-list-tile-action>
            <v-icon>swap_horiz</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>转账记录</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="view='user'" @click.stop="drawer = !drawer">
          <v-list-tile-action>
            <v-icon>supervisor_account</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>用户管理</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="indigo" dark fixed app>
      <v-toolbar-side-icon v-if="role_name=='admin'" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>
        <img class="logo" src="@/assets/logo.png" height="38px" width="38px">
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn small flat>{{user_name}}</v-btn>
        <v-btn small flat @click="logout=!logout"><v-icon class="ml-1" dark right>power_settings_new</v-icon></v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content style="background:#eee">
      <v-container md-10 fluid fill-height>
        <v-layout justify-center>
          <v-flex xs12 md10 lg9 xl8 text-xs-center>
            <div v-if="view=='transfer'">
              <v-layout v-bind="binding" row justify-space-around>
                <v-flex mb-3 xs12 sm5 md4 lg3 xl3>
                  <v-card dark color="primary">
                    <v-card-text class="pa-1">
                      <h3 class="headline pt-2">
                        <span class="body-1">持有</span>
                        <span class="mx-2">{{balance}}</span>
                        <span class="body-1">积分</span>
                      </h3>
                      <v-layout align-center justify-space-around>
                        <v-btn color="accent" flat  @click="dialog = true">转账</v-btn>
                        <!-- <v-btn color="accent" flat  @click="dialog = true">提现</v-btn> -->
                      </v-layout>
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex mb-3 xs12 sm5 md4 lg3 xl3>
                  <v-card dark color="secondary">
                    <v-card-text class="pa-1">
                      <h3 class="headline pt-2">
                        <span class="body-1">价值</span>
                        <span class="mx-2">{{balance}}</span>
                        <span class="body-1">$</span>
                      </h3>
                      <v-layout align-center justify-space-around>
                        <v-btn color="accent" flat></v-btn>
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

    <v-footer color="indigo" app>
      <span class="white--text">&emsp;&copy; 2018</span>
    </v-footer>

    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="title grey lighten-2" primary-title>
          转积分给商家
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
        <v-card-title class="title error lighten-2" primary-title>
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
      view: 'transfer',
      logout: false,
      ai: {
        state: false,
        type: 'success',
        text: '111'
      },
      drawer: false,
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
      }
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
</style>
