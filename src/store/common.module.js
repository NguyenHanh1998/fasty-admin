import Vue from 'vue'
import { commonActions } from './actions.type'
import { authMutations, commonMutations } from './mutations.type'
import * as JwtService from '@/services/jwt-service'
const { default: ApiService } = require('../services/api-service')
const state = {
  showChangePasswordModal: false,
  showCreateProductModal: false,
  showNotification: false,
  showOverlayLoading: false,
  fileName: '',
  notification: {
    type: '',
    msg: '',
    timeout: null,
  },
  ethererumConnectionAlert: {
    show: false,
    msg: '',
    alertType: '',
  },
}

const getters = {

}

const actions = {
  [commonActions.SET_ETHERERUM_CONNECTION_ALERT] (context, payload) {
    if (payload && payload.msg !== undefined && payload.show !== undefined) {
      context.commit(commonMutations.SET_ETHERERUM_CONNECTION_ALERT, payload)
    }
  },
  [commonActions.SET_NOTIFICATION] (context, payload) {
    if (payload && payload.type && payload.msg) {
      context.commit(commonMutations.SET_NOTIFICATION, payload)
      context.commit(commonMutations.SET_SHOW_NOTIFICATION, true)
    } else {
      console.warn('Nofitifcation format not match')
    }
  },
  [commonActions.SET_SHOW_OVERLAY_LOADING] (context, payload) {
    context.commit(commonMutations.SET_SHOW_OVERLAY_LOADING, payload)
  },
  [commonActions.SET_SHOW_CREATE_PRODUCT_MODAL] (context, payload) {
    context.commit(commonMutations.SET_SHOW_CREATE_PRODUCT_MODAL, payload)
  },
  [commonActions.UPLOAD_FILE] (context, payload) {
    if (JwtService.getToken()) {
      ApiService.setHeader()

      return new Promise((resolve, reject) => {
        Vue.axios.post('/files', payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
          .then(({ data }) => {
            console.log('....', data.data.data)
            context.commit(commonMutations.UPLOAD_FILE, data.data.data)
            resolve(data.data)
          })
          .catch(({ response }) => {
            if (response && response.status === 401) {
              context.commit(authMutations.RESET_STATE)
              context.commit(authMutations.PURGE_AUTH)
            } else {
              context.commit(commonMutations.SET_NOTIFICATION, response.data.meta.message)
              context.commit(commonMutations.SET_SHOW_NOTIFICATION, true)
            }
            reject(response)
          })
      })
    }
  },
}

const mutations = {
  [commonMutations.SET_ETHERERUM_CONNECTION_ALERT] (state, data) {
    state.ethererumConnectionAlert = data
  },
  [commonMutations.SET_SHOW_NOTIFICATION] (state, data) {
    state.showNotification = data
  },
  [commonMutations.SET_NOTIFICATION] (state, data) {
    state.notification = data
  },
  [commonMutations.SET_SHOW_OVERLAY_LOADING] (state, data) {
    state.showOverlayLoading = data
  },
  [commonMutations.SET_SHOW_CREATE_PRODUCT_MODAL] (state, data) {
    state.showCreateProductModal = data
  },
  [commonMutations.UPLOAD_FILE] (state, data) {
    state.fileName = data.filename
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
