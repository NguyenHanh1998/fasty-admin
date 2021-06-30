import * as _ from 'lodash'
import { txsActions } from './actions.type'
import * as JwtService from '@/services/jwt-service'
import ApiService from '../services/api-service'
import { authMutations, txsMutations } from './mutations.type'
import { txsGetters } from './getters.type'

const state = {
  totalRevenues: [],
  totalTransactions: 0,
  transactions: [],
  selectedTransactions: {},
  errorMsg: null,
}

const getters = {
  [txsGetters.GET_TOTAL_REVENUES] (state) {
    return state.totalRevenues
  },
  [txsGetters.GET_TOTAL_TRANSACTIONS] (state) {
    return state.totalTransactions
  },
  [txsGetters.GET_ALL_TRANSACTIONS] (state) {
    return state.transactions
  },
  [txsGetters.GET_SELECTED_TRANSACTION] (state) {
    return state.selectedTransaction
  },
}

const actions = {
  [txsActions.GET_TOTAL_REVENUES] (context) {
    if (JwtService.getToken()) {
      ApiService.setHeader()

      return new Promise((resolve, reject) => {
        ApiService.get('/admin/transactions/total-revenue')
          .then(({ data }) => {
            context.commit(txsMutations.SET_TOTAL_REVENUES, data.data)
            resolve(data)
          })
          .catch(({ response }) => {
            if (response && response.status === 401) {
              context.commit(txsMutations.RESET_STATE)
              context.commit(authMutations.PURGE_AUTH)
            } else {
              context.commit(txsMutations.SET_ERROR, {
                error: response ? response.data : null,
                isServer: true,
              })
            }
            reject(response)
          })
      })
    } else {
      context.commit(txsMutations.RESET_STATE)
      context.commit(authMutations.PURGE_AUTH)
    }
  },
  [txsActions.FETCH_TRANSACTIONS] (context, params) {
    params.page = params.page || 1
    params.limit = params.limit || 10

    console.log(':::::', params)
    if (JwtService.getToken()) {
      ApiService.setHeader()

      return new Promise((resolve, reject) => {
        ApiService.query('/admin/transactions', {
          params,
        })
          .then(({ data }) => {
            console.log('---data', data)
            context.commit(txsMutations.SET_TOTAL_TRANSACTIONS, data.meta)
            context.commit(txsMutations.SET_TRANSACTIONS, {
              transactions: data.data,
              page: params.page,
              limit: params.limit,
            })
            resolve(data)
          })
          .catch(({ response }) => {
            if (response && response.status === 401) {
              context.commit(txsMutations.RESET_STATE)
              context.commit(authMutations.PURGE_AUTH)
            } else {
              context.commit(txsMutations.SET_ERROR, {
                error: response ? response.data : null,
                isServer: true,
              })
            }
            reject(response)
          })
      })
    } else {
      context.commit(txsMutations.RESET_STATE)
      context.commit(authMutations.PURGE_AUTH)
    }
  },
  [txsActions.GET_SELECTED_TRANSACTION] (context, id) {
    if (JwtService.getToken()) {
      ApiService.setHeader()

      return new Promise((resolve, reject) => {
        ApiService.get(`/admin/transactions/${id}`)
          .then(({ data }) => {
            context.commit(txsMutations.SET_SELECTED_TRANSACTION, data.data)
            resolve(data)
          })
          .catch(({ response }) => {
            if (response && response.status === 401) {
              context.commit(txsMutations.RESET_STATE)
              context.commit(authMutations.PURGE_AUTH)
            } else {
              context.commit(txsMutations.SET_ERROR, {
                error: response ? response.data : null,
                isServer: true,
              })
            }
            reject(response)
          })
      })
    } else {
      context.commit(txsMutations.RESET_STATE)
      context.commit(authMutations.PURGE_AUTH)
    }
  },
}

const mutations = {
  [txsMutations.SET_TOTAL_REVENUES] (state, revenues) {
    state.totalRevenues = revenues
  },
  [txsMutations.SET_TOTAL_TRANSACTIONS] (state, meta) {
    if (!meta || !meta.pagination) {
      return
    }
    state.totalTransactions = meta.pagination.totalItems || 0
  },
  [txsMutations.SET_TRANSACTIONS] (state, payload) {
    console.log('====', payload)
    if (!payload || !payload.transactions || !payload.page || !payload.limit) {
      return
    }

    const transactions = payload.transactions
    state.transactions = _.map(transactions, (tx, index) => {
      return Object.assign({}, tx, { index: (payload.page - 1) * payload.limit + index + 1 })
    })
  },
  [txsMutations.SET_SELECTED_TRANSACTION] (state, transaction) {
    state.selectedTransaction = transaction
  },
  [txsMutations.SET_ERROR] (state, { error, isServer }) {
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
  [txsMutations.RESET_STATE] (state) {
    state.totalRevenues = []
    state.totalTransactions = 0
    state.transactions = []
    state.errorMsg = null
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
