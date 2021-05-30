import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入字体图标
import '@/assets/fonts/iconfont.css'
// 引入elementui按需导入文件
import './plugins/element.js'

import axios from "axios"
// 配置请求路径
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config=>{
  // console.log(config); 
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须return config
  return config
},err=>{
  return Promise.reject(err)
})

Vue.prototype.$http = axios

// 全局样式
import "@/assets/style/css/global.css"
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
