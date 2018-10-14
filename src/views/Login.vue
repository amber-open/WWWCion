<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm6 md4 lg3 xl3>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-flex title text-xs-center>用户登录</v-flex>
              </v-toolbar>
              <v-card-text>
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
                  <v-btn style="width:50%" color="primary">登&nbsp;录</v-btn>
                </v-flex>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      valid: false,
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
