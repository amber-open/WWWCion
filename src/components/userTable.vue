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
        <td class="text-xs-left">{{ roles[props.item.role_id-1].name }}</td>
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
    <p class="mt-2 pl-1 caption" style="text-align:left;color:#666">
      共{{list.length}}条记录，第1/1页
    </p>
  </div>
</template>
<script>
  import { xhr_getRoles, xhr_putRoles, xhr_getUserlist } from '@/api/index'
  export default {
    data () {
      return {
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
          { text: '积分', value: 'balance' },
          { text: '创建时间', value: 'created_at' },
          { text: '操作' },
        ],
        list: [],
        roles: []
      }
    },
    mounted () {
      let vm = this
      xhr_getRoles().then(function (response) {
        vm.roles = response.data.data
        vm.getList()
      })
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
      getList () {
        let vm = this
        xhr_getUserlist().then(function (response) {
          vm.list = response.data.data
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
            vm.getList()
            vm.showAlert('success','更新用户角色成功！')
          }
        }).catch(function (error) {
          vm.showAlert('error', error.message)
        });
      }
    }
  }
</script>
