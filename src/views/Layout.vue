<template>
  <v-app id="inspire">
    <!-- 左侧sidebar -->
    <v-navigation-drawer style="background:#001529" dark v-model="drawer" fixed app mobile-break-point="900" width="230">
      <v-toolbar height="50" style="background:#002140" flat>
        <img class="logo" src="@/assets/logo.png" height="38px">
        <v-toolbar-title style="font-size:18px">积分平台</v-toolbar-title>
      </v-toolbar>
      <v-list dense>
        <v-list-group
          v-for="item in nav"
          v-if="!(item.name=='用户管理'&& role_name!='admin')"
          :prepend-icon="item.icon"
          value="false"
          no-action
        >
          <v-list-tile slot="activator">{{item.name}}</v-list-tile>
          <v-list-tile v-for="n in item.data"
          class="menuList" :to="n.src">{{n.name}}</v-list-tile>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <!-- 头部header -->
    <v-toolbar height="50" fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer">
        <v-icon v-if="drawer">format_indent_decrease</v-icon>
        <v-icon v-else>format_indent_increase</v-icon>
      </v-toolbar-side-icon>
      <!-- <v-toolbar-title class="ml-0">
        <img class="logo" src="@/assets/logo.png" height="38px">
      </v-toolbar-title> -->
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-menu offset-y right :close-on-content-click="false">
          <v-btn slot="activator" @click="getInfo" small flat>{{user_name}}</v-btn>
          <v-list>
            <v-list-tile>
              <v-list-tile-title disabled>角色：{{user_info.role_name}}</v-list-tile-title>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-title disabled>余额：{{balance}}</v-list-tile-title>
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
                v-for="item in breadcrumb"
                disabled
              >
                {{item}}
              </v-breadcrumbs-item>
            </v-breadcrumbs>
            <router-view :key="key"/>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>

    <!-- 退出弹窗 -->
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
          <v-btn color="grey darken-1" flat @click="logout = !logout">
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
  import { xhr_logout } from '@/api/index'
  export default {
    data: () => ({
      nav: [
        {
          name: '积分管理',
          icon: 'account_balance_wallet',
          data: [
            {
              name: '转账记录',
              src: '/account/transfer'
            }
          ]
        },
        {
          name: '用户管理',
          icon: 'people',
          data: [
            {
              name: '角色设置',
              src: '/admin/role'
            }
          ]
        }
      ],
      balance: 0,
      breadcrumb: ['积分管理','转账记录'],
      view: 'transfer',
      logout: false,
      drawer: true,
    }),
    computed: {
      key() {
        return this.$route.fullPath
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
      let vm = this
      if (document.documentElement.clientWidth < 900) {
        setTimeout(()=>{
          vm.drawer = false
        },0)
      }
      vm.getInfo()
      vm.breadcrumb = this.$route.meta.breadcrumb
    },
    watch:{
      $route(to,from){
        this.breadcrumb = to.meta.breadcrumb
      }
    },
    methods: {
      getInfo () {
        let vm = this
        vm.balance = localStorage.getItem('balance')
      },
      logoutBt () {
        let vm = this
        xhr_logout().then(function (response) {
          localStorage.clear()
          location.href = '/login'
        }).catch(function (error) {
          localStorage.clear()
          location.href = '/login'
        });
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
