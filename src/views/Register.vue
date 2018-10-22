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
            <v-flex title text-xs-center>用户注册</v-flex>
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
                v-model="info.password"
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
                v-model="info.sq_id"
                :items="questions"
                item-text="name"
                item-value="id"
                label="密保问题"
              ></v-select>
              <v-text-field
                prepend-icon="question_answer"
                v-model="info.answer"
                :rules="answerRules"
                label="密保答案"
                required
              ></v-text-field>
            </v-form>
            <v-flex text-xs-center xs12>
              <v-btn :disabled="!valid" @click="submit" style="width:50%" color="primary">注&nbsp;册<v-icon class="ml-1" dark right>touch_app</v-icon></v-btn>
            </v-flex>
            <v-layout align-center justify-space-between reverse>
              <v-btn to="/resetpassword" flat color="primary">忘记密码？</v-btn>
              <v-btn to="/login" small flat color="primary">现在登录</v-btn>
            </v-layout>
          </v-card-text>
        </v-layout>
      </v-card>
    </v-layout>

    <v-dialog v-model="logout" width="300">
      <v-card>
        <v-card-title class="title white--text success lighten-2" primary-title>
          注册成功
        </v-card-title>
        <v-card-text class="px-5">
          恭喜您注册成功，是否跳转登录页面？
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
        password: '',
        sq_id: 0,
        answer: ''
      },
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
      questions: []
    }),
    mounted () {
      let vm = this
      fetch(vm.api_url+'/questions').then(res=>res.json()).then(data => {
        vm.info.sq_id = data.data[0].id
        for (var i in data.data) {
          vm.questions.push({
            name:data.data[i].question,
            id:data.data[i].id
          })
        }
      })
    },
    computed: {
      passwordErrors () {
        if (this.password!=this.info.password) {
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
          fetch(vm.api_url+'/user?action=register',{
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
            vm.showAlert('error','注册失败！')
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
