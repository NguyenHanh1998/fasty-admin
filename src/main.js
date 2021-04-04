// =========================================================
// * Vuetify Material Dashboard - v2.1.0
// =========================================================
//
// * Product Page: https://www.creative-tim.com/product/vuetify-material-dashboard
// * Copyright 2019 Creative Tim (https://www.creative-tim.com)
//
// * Coded by Creative Tim
//
// =========================================================
//
// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/base'
import './plugins/chartist'
import './plugins/vee-validate'
import vuetify from './plugins/vuetify'
import i18n from './i18n'
import ApiService from './services/api-service'
import Vuelidate from 'vuelidate'
import Web3Service from '@/services/web3-service'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// check env before start app
if (!process.env.VUE_APP_NETWORK) {
  throw new Error(`Some configs are missing. VUE_APP_NETWORK=${
    process.env.VUE_APP_NETWORK
  }`)
}

Vue.use(Vuelidate)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false

Web3Service.init()
ApiService.init()

router.beforeEach((to, _, next) => {
  const isAuthenticated = store.getters.IS_AUTHENTICATED
  if (to.matched.some(record => record.meta.auth === true) && !isAuthenticated) {
    return next({ path: '/login' })
  }
  if (to.matched.some(record => record.meta.guest === true) && isAuthenticated) {
    return next({ path: '/' })
  }
  return next()
})

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App),
}).$mount('#app')
