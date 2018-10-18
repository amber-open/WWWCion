<template>
  <v-app id="inspire">
    <v-layout pa-4 align-center justify-center>
      <div class="m-left"></div>
      <v-card class="m-right elevation-12">
        <v-layout align-center justify-center column fill-height>
          <v-card-text class="px-5 py-2">
            <v-flex title text-xs-center>用户登录</v-flex>
            <v-form v-model="valid">
              <v-text-field
                prepend-icon="person"
                v-model="name"
                :rules="nameRules"
                :counter="10"
                label="用户名"
                required
              ></v-text-field>
              <v-text-field
                prepend-icon="lock"
                v-model="password"
                :rules="passwordRules"
                label="密码"
                required
              ></v-text-field>
            </v-form>


            <v-flex text-xs-center xs12>
              <v-btn style="width:50%" color="primary">登&nbsp;录<v-icon class="ml-2" dark right>arrow_forward</v-icon></v-btn>
            </v-flex>
            <v-layout align-center justify-space-between reverse>
              <v-btn small flat color="primary">忘记密码？</v-btn>
              <v-btn to="/list" small flat color="primary">立即注册</v-btn>
            </v-layout>
          </v-card-text>
        </v-layout>
      </v-card>
    </v-layout>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      valid: false,
      auto: false,
      name: '',
      nameRules: [
        v => !!v || '请填写用户名',
        v => v.length <= 10 || '用户名格式有误！'
      ],
      password: '',
      passwordRules: [
        v => !!v || '请填写密码',
        v => /.+@.+/.test(v) || '密码格式有误！'
      ]
    }),
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
    height: 500px;
    width: 270px;
    background-image: url('../assets/ubg2.jpg');
    background-position: 80% center;
    background-size: cover;
    box-shadow: 0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12)!important;
  }
  .m-right{
    height: 500px;
    width: 400px;
  }
  @media screen and (max-width: 600px) {

    .m-left{
      display: none;
    }
  }
</style>
