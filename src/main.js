import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import Settings from './settings/index'
import configFirebase from './plugins/configFirebase'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.use(Settings)
Vue.use(configFirebase)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
