<template>
  <div class="">
    <v-alert
      style="position:fixed;top:50px;right:0px;min-width:280px;z-index:1000"
      :value="true"
      dismissible
      v-model="ai.state"
      :type="ai.type"
      transition="slide-y-reverse-transition"
    >
      {{ai.text}}
    </v-alert>
    <div>
      <v-btn small style="margin:0 0 15px 0" color="success" @click="addUserTK = true">创建用户</v-btn>
    </div>
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
          <v-btn small color="error" @click="czmmBt(props.item.user_name)">重置密码</v-btn>
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

    <!-- 重置密碼 -->
    <v-dialog v-model="czmmTK" width="500">
      <v-card>
        <v-card-title class="error title white--text" primary-title>
          重置密码
        </v-card-title>
        <v-card-text class="px-5">
          <v-form ref="form" v-model="czmmValid">
            <v-text-field
              prepend-icon="person"
              v-model="czmmInfo.user_name"
              label="用户名"
              disabled
              required
            ></v-text-field>
            <v-text-field
              prepend-icon="lock"
              type="password"
              v-model="czmmInfo.new_pwd"
              :rules="passwordRules"
              label="密码"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="grey darken-1" flat @click="czmmTK = false">取消</v-btn>
          <v-spacer></v-spacer>
          <v-btn :disabled="!czmmValid" color="primary" flat @click="czmm">
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 创建用户 -->
    <v-dialog v-model="addUserTK" width="500">
      <v-card>
        <v-card-title class="success title white--text" primary-title>
          创建用户
        </v-card-title>
        <v-card-text class="px-5">
          <v-form ref="form2" v-model="addUserValid">
            <v-select
              prepend-icon="face"
              v-model="addUserInfo.role_name"
              :items="roles3"
              item-text="name"
              item-value="id"
              label="用户角色"
            ></v-select>
            <v-text-field
              prepend-icon="person"
              v-model="addUserInfo.user_name"
              :rules="nameRules"
              label="用户名"
              required
            ></v-text-field>
            <v-text-field
              prepend-icon="lock"
              v-model="addUserInfo.password"
              :rules="passwordRules"
              label="密码"
              type="password"
              required
            ></v-text-field>
            <v-text-field
              prepend-icon="lock"
              v-model="password"
              :rules="passwordRules"
              :error-messages="passwordErrors"
              label="确定密码"
              type="password"
              required
            ></v-text-field>
            <v-select
              prepend-icon="security"
              v-model="addUserInfo.sq_id"
              :items="questions"
              item-text="name"
              item-value="id"
              label="密保问题"
            ></v-select>
            <v-text-field
              prepend-icon="question_answer"
              v-model="addUserInfo.answer"
              :rules="answerRules"
              label="密保答案"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="grey darken-1" flat @click="addUserTK = false">取消</v-btn>
          <v-spacer></v-spacer>
          <v-btn :disabled="!addUserValid" color="primary" flat @click="adduser">
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  import { xhr_getRoles, xhr_putRoles, xhr_getQuestions, xhr_getUserlist, xhr_adminResetPassword, xhr_adminAddUser } from '@/api/index'
  export default {
    data () {
      return {
        czmmValid: false,
        czmmTK: false,
        czmmInfo: {
          user_name: '',
          new_pwd: ''
        },
        addUserValid: false,
        addUserTK: false,
        addUserInfo: {
          user_name: '',
          password: '',
          sq_id: '',
          answer: '',
          role_name: ''
        },
        password: '',
        questions: [],
        nameRules: [
          v => !!v || '请填写用户名',
          v => /.+@.+/.test(v) || '用户名必须是一个邮箱！'
        ],
        passwordRules: [
          v => !!v || '请填写密码',
          v => /(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{8,}/.test(v) || '字母数字符号任意两种组合，且不得少于8位！'
        ],
        answerRules: [
          v => !!v || '密保答案'
        ],
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
        roles2: {},
        roles3: []
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
          vm.roles3.push({
            name: n.name,
            id: n.name
          })
        })
        vm.addUserInfo.role_name = response.data.data[0].name
        vm.getList(vm.length*(vm.page-1),vm.length)
      })

      xhr_getQuestions().then(function (response) {
        vm.addUserInfo.sq_id = response.data.data[0].id
        for (var i in response.data.data) {
          vm.questions.push({
            name: response.data.data[i].question,
            id: response.data.data[i].id
          })
        }
      })
    },
    computed: {
      passwordErrors () {
        if (this.password!=this.addUserInfo.password) {
          return '密码不一致！'
        }
      }
    },
    watch: {
      page (n, o) {
        let vm = this
        vm.getList(vm.length*(n-1),vm.length)
      }
    },
    methods: {
      czmmBt (n) {
        let vm = this
        vm.czmmTK = true
        vm.czmmInfo.user_name = n
        vm.czmmInfo.new_pwd = ''
      },
      adduser () {
        let vm = this
        xhr_adminAddUser(vm.addUserInfo).then(function (response) {
          if (response.data.code!=0) {
            vm.showAlert('error',response.data.message)
          } else {
            vm.showAlert('success',vm.czmmInfo.user_name+'创建用户成功！')
            vm.addUserTK = false
            vm.page = 1
            vm.getList(vm.length*(vm.page-1),vm.length)
          }
        }).catch(function (error) {
          vm.showAlert('error', error.message)
        });
      },
      czmm () {
        let vm = this
        xhr_adminResetPassword(vm.czmmInfo).then(function (response) {
          if (response.data.code!=0) {
            vm.showAlert('error',response.data.message)
          } else {
            vm.czmmTK = false
            vm.showAlert('success',vm.czmmInfo.user_name+'重置密码成功！')
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
