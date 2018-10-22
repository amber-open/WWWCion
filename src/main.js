import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from "./router";
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

// 使用多文件管理不同的语言是一个好习惯：
const i18n = new VueI18n({
  // locale: LangStorage.getLang('zh'),  // 语言标识，后面会用做切换和将用户习惯存储到本地浏览器
  locale: 'zh', // 语言标识
  messages: {
    'zh': require('./common/lang/zh'),
    'en': require('./common/lang/en')
  }
})
Vue.config.productionTip = false

Vue.prototype.api_url = 'http://122.115.54.25:9001'

new Vue({
  i18n,
  router,
  render: h => h(App)
}).$mount('#app')
