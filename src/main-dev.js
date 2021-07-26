import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入vue-table-with-tree-grid插件
import TreeTable from 'vue-table-with-tree-grid'

// 导入字体图标
import '@/assets/fonts/iconfont.css'
// 引入elementui按需导入文件
import './plugins/element.js'
// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css'

// 导入包对应的js和css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import axios from 'axios'

// 全局样式
import '@/assets/style/css/global.css' // for bubble theme

Vue.use(VueQuillEditor /* { default global options } */)
// 配置请求路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 在request拦截器中，显示进度条NProgress.start()
axios.interceptors.request.use(config => {
  // console.log(config);
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须return config
  return config
}, err => {
  return Promise.reject(err)
})

// 在response拦截器中，隐藏进度条，NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
// 全局注册table插件
Vue.component('tree-table', TreeTable)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
