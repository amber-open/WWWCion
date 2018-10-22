<template>
  <v-app id="inspire">
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
    <v-layout pa-4 align-center justify-center>
      <div class="m-left"></div>
      <v-card class="m-right elevation-12">
        <v-layout align-center justify-center column fill-height>
          <v-card-text class="px-5 py-2">
            <v-flex title text-xs-center>修改密码</v-flex>
            <v-form ref="form" v-model="valid">
              <v-text-field
                prepend-icon="person"
                v-model="info.user_name"
                :rules="nameRules"
                label="用户名"
                required
              ></v-text-field>
              <v-text-field
                prepend-icon="lock"
                v-model="info.old_pwd"
                :rules="oldPasswordRules"
                label="旧密码"
                type="password"
                required
              ></v-text-field>
              <v-text-field
                prepend-icon="lock"
                v-model="info.new_pwd"
                :rules="passwordRules"
                label="新密码"
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
            </v-form>
            <v-flex text-xs-center xs12>
              <v-btn :disabled="!valid" @click="submit" style="width:50%" color="primary">修&nbsp;改<v-icon class="ml-1" dark right>touch_app</v-icon></v-btn>
            </v-flex>
            <v-layout align-center justify-space-between reverse>
              <v-btn to="/login" small flat color="primary">现在登录</v-btn>
              <v-btn to="/register" small flat color="primary">立即注册</v-btn>
            </v-layout>
          </v-card-text>
        </v-layout>
      </v-card>
    </v-layout>
    <v-dialog v-model="logout" width="300">
      <v-card>
        <v-card-title class="title success white--text lighten-2" primary-title>
          修改成功
        </v-card-title>
        <v-card-text class="px-5">
          恭喜您修改密码成功，是否跳转登录页面？
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" flat @click="logout = !logout">
            取消
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn to="/login" color="primary" flat @click="logoutBt">
            登录
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      logout: false,
      ai: {
        state: false,
        type: 'success',
        text: '111'
      },
      valid: false,
      auto: false,
      password: '',
      info: {
        user_name: '',
        old_pwd: '',
        new_pwd: ''
      },
      nameRules: [
        v => !!v || '请填写用户名'
      ],
      oldPasswordRules: [
        v => !!v || '请填写旧密码'
      ],
      passwordRules: [
        v => !!v || '请填写密码',
        v => /(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{8,}/.test(v) || '字母数字符号任意两种组合，且不得少于8位！'
      ],
      questions: []
    }),
    computed: {
      passwordErrors () {
        if (this.password!=this.info.new_pwd) {
          return '密码不一致！'
        }
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
      submit () {
        let vm = this
        if (vm.$refs.form.validate()) {
          fetch(vm.api_url+'/user?action=change_password',{
            method: 'POST',
            headers:{
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(vm.info)
          }).then(res=>res.json()).then(data => {
            if (data.code!=0) {
              vm.showAlert('error',data.message)
            } else {
              vm.logout = true
            }
          }).catch(data => {
            vm.showAlert('error','修改密码失败！')
          })
        }
      }
    },
    props: {
      source: String
    }
  }
</script>

<style scoped>
  #inspire{
    /* background-image: url('../assets/ubg2.jpg'); */
    background-image: url('../assets/authBg.jpg');
    background-position: center;
    background-size: cover;
  }
  .m-left{
    height: 550px;
    width: 270px;
    background-image: url('../assets/ubg2.jpg');
    background-position: 80% center;
    background-size: cover;
    box-shadow: 0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12)!important;
  }
  .m-right{
    height: 550px;
    width: 400px;
  }
  @media screen and (max-width: 600px) {

    .m-left{
      display: none;
    }
  }
</style>
