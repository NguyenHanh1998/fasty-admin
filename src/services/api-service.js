import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import * as JwtService from './jwt-service'

if (!process.env.VUE_APP_API_URL) {
  throw new Error('API url was not set. Please check your configure again.')
}

const ApiService = {
  init () {
    Vue.use(VueAxios, axios)
    Vue.axios.defaults.baseURL = process.env.VUE_APP_API_URL
  },

  setHeader () {
    Vue.axios.defaults.headers.common.Authorization = `Bearer ${JwtService.getToken()}`
  },

  async query (resource, params) {
    try {
      return Vue.axios.get(resource, params)
    } catch (err) {
      throw new Error(`[TWA] ApiService ${err}`)
    }
  },

  async get (resource) {
    try {
      return Vue.axios.get(`${resource}`)
    } catch (err) {
      throw new Error(`[TWA] ApiService ${err}`)
    }
  },

  async post (resource, params) {
    try {
      return Vue.axios.post(`${resource}`, params)
    } catch (err) {
      throw new Error(`[TWA] ApiService ${err}`)
    }
  },

  async update (resource, slug, params) {
    try {
      return Vue.axios.put(`${resource}/${slug}`, params)
    } catch (err) {
      throw new Error(`[TWA] ApiService ${err}`)
    }
  },

  async put (resource, params) {
    try {
      return Vue.axios.put(`${resource}`, params)
    } catch (err) {
      throw new Error(`[TWA] ApiService ${err}`)
    }
  },

  async delete (resource) {
    try {
      return Vue.axios.delete(resource)
    } catch (err) {
      throw new Error(`[TWA] ApiService ${err}`)
    }
  },

  async upload (resource, formData) {
    try {
      return Vue.axios.post(`${resource}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    } catch (err) {
      throw new Error(`[TWA] ApiService ${err}`)
    }
  },
}

export default ApiService
