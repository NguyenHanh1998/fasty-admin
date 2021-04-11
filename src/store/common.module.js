import { commonActions } from './actions.type'
import { commonMutations } from './mutations.type'

const state = {
  showChangePasswordModal: false,
  showNotification: false,
  showOverlayLoading: false,
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
}

export default {
  state,
  getters,
  actions,
  mutations,
}
