<template>
  <div class="">
    <v-alert
      style="position:fixed;top:20px;right:0px;min-width:280px;z-index:100"
      :value="true"
      dismissible
      v-model="ai.state"
      :type="ai.type"
      transition="slide-y-reverse-transition"
    >
      {{ai.text}}
    </v-alert>
    <v-data-table
      :headers="headers"
      :items="list"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.user_name }}</td>
        <td class="text-xs-left">{{ roles2[props.item.role_id].name }}</td>
        <td class="text-xs-left">{{ props.item.balance }}</td>
        <td class="text-xs-left">{{ props.item.created_at }}</td>
        <td class="text-xs-left">
          <v-menu offset-y>
            <v-btn
              small
              slot="activator"
              color="error"
              dark
            >更新角色</v-btn>
            <v-list>
              <v-list-tile
                v-for="(item, index) in roles"
                :key="index"
                @click="changeRole(props.item.id,item.id)"
              >
                <v-list-tile-title>{{ item.name }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </td>
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
  </div>
</template>
<script>
  import { xhr_getRoles, xhr_putRoles, xhr_getUserlist } from '@/api/index'
  export default {
    data () {
      return {
        page: 1,
        length: 8,
        pl: 0,
        count: 0,
        ai: {
          state: false,
          type: 'success',
          text: '111'
        },
        headers: [
          {
            text: '用户名',
            sortable: false,
            value: 'user_name'
          },
          { text: '角色', value: 'role_id' },
          { text: 'WWWCion', value: 'balance' },
          { text: '创建时间', value: 'created_at' },
          { text: '操作' },
        ],
        list: [],
        roles: [],
        roles2: {}
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
      vm.length = document.documentElement.clientWidth < 500 ? 10 : Math.floor((clientHeight-260)/48)
      vm.length = vm.length < 1 ? 10 : vm.length
      xhr_getRoles().then(function (response) {
        vm.roles = response.data.data
        vm.roles.forEach((n,i)=>{
          vm.roles2[n.id] = n
        })
        vm.getList(vm.length*(vm.page-1),vm.length)
      })
    },
    watch: {
      page (n, o) {
        let vm = this
        vm.getList(vm.length*(n-1),vm.length)
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
      getList (s, l) {
        let vm = this
        xhr_getUserlist(s, l).then(function (response) {
          vm.list = response.data.data
          vm.count = response.data.count
          vm.pl = Math.ceil(response.data.count/vm.length)
        })
      },
      changeRole (uid, rid) {
        let vm = this
        xhr_putRoles({
          user_id: uid,
          role_id: rid,
        }).then(function (response) {
          if (response.data.code!=0) {
            vm.showAlert('error',response.data.message)
          } else {
            vm.page = 1
            vm.getList(vm.length*(vm.page-1),vm.length)
            vm.showAlert('success','更新用户角色成功！')
          }
        }).catch(function (error) {
          vm.showAlert('error', error.message)
        });
      }
    }
  }
</script>
