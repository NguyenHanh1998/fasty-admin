import * as _ from 'lodash'
import { productsActions } from './actions.type'
import { productsMutations, authMutations } from './mutations.type'
import { productsGetters } from './getters.type'
import * as JwtService from '@/services/jwt-service'
const { default: ApiService } = require('../services/api-service')

const state = {
  totalProducts: 0,
  allProducts: [],
  successMsg: null,
  selectedProduct: {},
  errorMsg: null,
  currentPage: 1,
}

const getters = {
  [productsGetters.GET_TOTAL_PRODUCTS] (state) {
    return state.totalProducts
  },
  [productsGetters.GET_ALL_PRODUCTS] (state) {
    return state.allProducts
  },
  [productsGetters.GET_SELECTED_PRODUCT] (state) {
    return state.selectedProduct
  },
  [productsGetters.GET_LATEST_PAGE] (state) {
    return state.currentPage
  },
}

const actions = {
  [productsActions.FETCH_PRODUCTS] (context, params) {
    params.page = params.page || 1
    params.limit = params.limit || 10

    if (JwtService.getToken()) {
      ApiService.setHeader()

    return new Promise((resolve, reject) => {
      ApiService.query('/products', { params }).then((data) => {
        context.commit(productsMutations.SET_TOTAL_PRODUCTS, data.data.meta)
        context.commit(productsMutations.SET_PRODUCTS, {
          products: data.data.data,
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
  [productsActions.FETCH_PRODUCT_DETAILS] (context, id) {
    if (JwtService.getToken()) {
      ApiService.setHeader()

      return new Promise((resolve, reject) => {
        ApiService.get(`/products/${id}`)
          .then(({ data }) => {
            context.commit(productsMutations.SET_SELECTED_PRODUCT, data.data)
            resolve(data.data)
          })
          .catch(({ response }) => {
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
  [productsActions.SUBMIT_ORDER] (context, payload) {
    if (JwtService.getToken()) {
      ApiService.setHeader()

      return new Promise((resolve, reject) => {
        ApiService.post(`/orders/${payload.method}`, payload.params)
        .then(({ data }) => {
          resolve(data)
        })
        .catch(({ response }) => {
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
    } else {
      context.commit(productsMutations.RESET_STATE)
      context.commit(authMutations.PURGE_AUTH)
    }
  },
  [productsActions.CREATE_NEW_PRODUCT] (context, payload) {
    if (JwtService.getToken()) {
      ApiService.setHeader()

      return new Promise((resolve, reject) => {
        ApiService.post('/admin/product', payload)
        .then(({ data }) => {
          context.commit(productsMutations.SET_SUCCESS, data)
          resolve(data.data)
        })
        .catch(({ response }) => {
          if (response && response.status === 401) {
            context.commit(productsMutations.RESET_STATE)
            context.commit(authMutations.PURGE_AUTH)
          } else {
            context.commit(productsMutations.SET_ERROR, {
              error: response ? response.data : null,
              isServer: true,
            })
            reject(response)
          }
        })
      })
    } else {
      context.commit(productsMutations.RESET_STATE)
      context.commit(authMutations.PURGE_AUTH)
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
  [productsMutations.SET_SELECTED_PRODUCT] (state, product) {
    state.selectedProduct = product
  },
  [productsMutations.SET_SUCCESS] (state, { message, isServer }) {
    state.successMsg = isServer ? 's' + message : message
  },
  [productsMutations.SET_LATEST_PAGE] (state, page) {
    state.currentPage = page
  },
}
export default {
  state,
  getters,
  actions,
  mutations,
}
