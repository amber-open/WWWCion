<template>
  <v-app id="inspire">
    <v-alert
      style="position:fixed;top:50px;right:0px;min-width:280px;z-index:100"
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
            <v-flex title text-xs-center mb-3><img class="logo" src="@/assets/logo.png" height="38px">用户登录</v-flex>
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
                type="password"
                v-model="info.password"
                :rules="passwordRules"
                label="密码"
                required
              ></v-text-field>
            </v-form>
            <v-flex text-xs-center xs12>
              <v-btn :disabled="!valid" @click="submit" style="width:50%" color="primary">登&nbsp;录<v-icon class="ml-2" dark right>arrow_forward</v-icon></v-btn>
            </v-flex>
            <v-layout align-center justify-space-between reverse>
              <v-btn to="/resetpassword" small flat color="primary">忘记密码？</v-btn>
              <v-btn to="/register" small flat color="primary">立即注册</v-btn>
            </v-layout>
            <v-btn style="float:right;margin-bottom:-40px;" to="/changepassword" small flat color="primary">修改密码</v-btn>
          </v-card-text>
        </v-layout>
      </v-card>
    </v-layout>
  </v-app>
</template>

<script>
  import { xhr_login } from '@/api/index'
  export default {
    data: () => ({
      ai: {
        state: false,
        type: 'success',
        text: '111'
      },
      valid: false,
      auto: false,
      info: {
        user_name: '',
        password: ''
      },
      name: '',
      nameRules: [
        v => !!v || '请填写用户名',
      ],
      password: '',
      passwordRules: [
        v => !!v || '请填写密码',
      ]
    }),
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
          xhr_login(vm.info).then(function (response) {
            if (response.data.code!=0) {
              vm.showAlert('error',response.data.message)
            } else {
              localStorage.setItem('balance',response.data.data.balance)
              localStorage.setItem('role_name',response.data.data.role_name)
              localStorage.setItem('user_name',response.data.data.user_name)
              localStorage.setItem('token',response.data.data.token)
              localStorage.setItem('user_info',JSON.stringify(response.data.data))
              location.href = '/account/transfer'
              vm.showAlert('success','登录成功！')
            }
          }).catch(function (error) {
            vm.showAlert('error', error.message)
          });
        }
      }
    },
    props: {
      source: String
    }
  }
</script>

<style scoped>
  .logo{
    margin: 0 10px;
    position: relative;
    top: 10px;
  }
  #inspire{
    /* background-image: url('../assets/ubg2.jpg'); */
    background-image: url('../../assets/authBg.jpg');
    background-position: center;
    background-size: cover;
  }
  .m-left{
    height: 400px;
    width: 270px;
    background-image: url('../../assets/ubg2.jpg');
    background-position: 80% center;
    background-size: cover;
    box-shadow: 0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12)!important;
  }
  .m-right{
    height: 400px;
    width: 400px;
  }
  @media screen and (max-width: 600px) {
    .m-left{
      display: none;
    }
  }
</style>
