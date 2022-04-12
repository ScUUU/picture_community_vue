import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Element from "element-ui"
import "element-ui/lib/theme-chalk/index.css"


import HighchartsVue from 'highcharts-vue'

import axios from './axios'
import global from './globalFun'

Vue.prototype.$axios = axios //
Vue.config.productionTip = false
Vue.use(HighchartsVue)
//require("./mock.js")

Vue.use(Element)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
