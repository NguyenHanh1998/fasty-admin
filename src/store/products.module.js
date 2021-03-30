import * as _ from 'lodash'
import { productsActions } from './actions.type'
import { productsMutations, authMutations } from './mutations.type'
import * as JwtService from '@/services/jwt-service'
const { default: ApiService } = require('../services/api-service')

const state = {
  totalProducts: 0,
  allProducts: [],
  successMsg: null,
  errorMsg: null,
  currentPage: 1,
}

const actions = {
  [productsActions.FETCH_PRODUCTS] (context, params) {
    params.page = params.page || 1
    params.limit = params.limit || 10

    if (JwtService.getToken()) {
      ApiService.setHeader()

    return new Promise((resolve, reject) => {
      ApiService.query('/products', { params }).then((data) => {
        context.commit(productsMutations.SET_TOTAL_PRODUCTS, data.meta)
        context.commit(productsMutations.SET_PRODUCTS, {
          products: data.data,
          page: params.page,
          limit: params.limit,
        })
        resolve(data)
      }).catch(({ response }) => {
        if (response && response.status === 401) {
          context.commit(productsMutations.RESET_STATE)
          context.commit(authMutations.PURGE_AUTH)
        } else {
          context.commit(productsMutations.SET_ERROR, {
            error: response ? response.data : null,
            isServer: true,
          })
        }
        reject(response)
      })
    })
  }
  },
}

const mutations = {
  [productsMutations.SET_TOTAL_PRODUCTS] (state, meta) {
    if (!meta || !meta.pagination || !meta.totalItems) {
      return
    }
    state.totalProducts = meta.pagination.totalItems
  },
  [productsMutations.SET_PRODUCTS] (state, payload) {
    if (!payload || !payload.products || !payload.page || !payload.limit) {
      return
    }
    const products = payload.products
    state.allProducts = _.map(products, (product, index) => {
      return Object.assign({}, product, { index: (payload.page - 1) * payload.limit + index + 1 })
    })
  },
  [productsMutations.RESET_STATE] (state) {
    state.totalProducts = 0
    state.allProducts = []
    state.successMsg = null
    state.errorMsg = null
  },
  [productsMutations.SET_ERROR] (state, { error, isServer }) {
    if (!error) {
      state.errorMsg = 'Server Internal Error'
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
}
export default {
  state,
  actions,
  mutations,
}
