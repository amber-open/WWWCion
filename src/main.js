import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from "./router";
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.config.productionTip = false

Vue.prototype.api_url = 'http://122.115.54.25:9001'

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
