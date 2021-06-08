import Vue from 'vue'
import Vuex from 'vuex'

import auth from './store/auth.module'
import products from './store/products.module'
import common from './store/common.module'
import transactions from './store/transactions.module'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    barColor: 'rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)',
    barImage: 'https://demos.creative-tim.com/material-dashboard/assets/img/sidebar-1.jpg',
    drawer: null,
  },
  mutations: {
    SET_BAR_IMAGE (state, payload) {
      state.barImage = payload
    },
    SET_DRAWER (state, payload) {
      state.drawer = payload
    },
    RESET_MESSAGE (state, _module) {
      if (!state || !state[_module]) {
        return
      }
      state[_module].errorMsg = null
      state[_module].successMsg = null
    },
  },
  actions: {

  },
  modules: {
    auth,
    products,
    common,
    transactions,
  },
})
