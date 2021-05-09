import * as JwtService from '@/services/jwt-service'
import ApiService from '@/services/api-service'
import router from '@/router'
import * as UserService from '@/services/user-service'
import { authGetters } from './getters.type'
import { authActions } from './actions.type'
import { authMutations } from './mutations.type'
const state = {
  user: {},
  isAuthenticated: !!JwtService.getToken(),
  successMsg: null,
  errorMsg: null,
}

const getters = {
  [authGetters.GET_CURRENT_USER] (state) {
    return state.user
  },

  [authGetters.IS_AUTHENTICATED] (state) {
    return state.isAuthenticated
  },

  [authGetters.GET_ERROR_MSG] (state) {
    return state.errorMsg
  },
}

const actions = {
  [authActions.LOGIN] (context, payload) {
    return new Promise((resolve, reject) => {
      ApiService.post('/login', payload)
      .then(({ data }) => {
        const user = { email: data.data && data.data.user.email ? data.data.user.email : null }
        const token = data.data && data.data.token ? data.data.token : null

        context.commit(authMutations.SET_USER, { user })
        context.commit(authMutations.SET_AUTH, { token })
        resolve(data)
      }).catch(({ response }) => {
        context.commit(authMutations.SET_ERROR, {
          error: response ? response.data : null,
          isServer: true,
        })
        reject(response)
      })
    })
  },

  [authActions.LOGOUT] (context) {
    if (JwtService.getToken()) {
      ApiService.setHeader()
      return new Promise((resolve) => {
        ApiService.post('/logout')
          .then(({ data }) => {
            context.commit(authMutations.PURGE_AUTH)
            resolve(data)
          })
          .catch(({ _ }) => {
            // should force logout
            context.commit(authMutations.PURGE_AUTH)
            resolve('force')
          })
      })
    } else {
      context.commit(authMutations.PURGE_AUTH)
    }
  },
}

const mutations = {
  [authMutations.SET_AUTH] (state, data) {
    state.isAuthenticated = true
    JwtService.saveToken(data.token)
  },

  [authMutations.SET_USER] (state, data) {
    state.user = data.user
    UserService.saveUser(data.user)
  },

  [authMutations.SET_ERROR] (state, { error, isServer }) {
    if (!error) {
      state.errorMsg = 'smsg_server_internal_error'
      return
    }
    let message
    if (error.meta) {
      message = error.meta.message && error.meta.message.length !== 0 ? error.meta.message : null
    } else if (error.message) {
      message = error.message
    } else {
      message = error.toString()
    }
    state.errorMsg = isServer ? 's' + message : message
  },

  [authMutations.PURGE_AUTH] (state) {
    state.user = {}
    state.isAuthenticated = false
    state.successMsg = null
    state.errorMsg = null

    const forcePushLogin = !!JwtService.getToken()
    JwtService.destroyToken()
    // force push to login page here
    if (forcePushLogin) {
      router.push('/login')
    }
  },
}

export default {
  state,
  actions,
  mutations,
  getters,
}
