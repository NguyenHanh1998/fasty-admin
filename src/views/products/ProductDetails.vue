<template>
  <div>
    <app-container
      :header-title="selectedProduct.name"
      :auto-height="true"
      container-class="cards__no-padding"
      class="mb-2"
    />
    <app-container
      id="product-details"
      :auto-height="true"
    >
      <template v-slot:content>
        <div
          class="product-detail__info ft__form cards__no-margin"
        >
          <v-row>
            <v-col
              cols="12"
              lg="6"
            >
              <div class="form-group">
                <label
                  class="cards__label"
                  for="selling-status"
                >
                  Selling Status
                </label>
                <v-select
                  id="selling-status"
                  v-model="sellingStatus"
                  name="selling-status"
                  class="cards__select"
                  :class="getSellingStatusColor()"
                  :items="computedSellingStatuses()"
                  :disabled="!canEditable()"
                  auto
                  attach
                />
              </div>
              <div class="form-group">
                <label
                  class="cards__label"
                  for="gender"
                >
                  Gender
                </label>
                <v-select
                  id="gender"
                  v-model="gender"
                  name="gender"
                  class="cards__select"
                  :items="computedGender()"
                  :disabled="!canEditable()"
                  auto
                  attach
                />
              </div>

              <div class="form-group">
                <label
                  class="cards__label"
                  for="type"
                >
                  Type
                </label>
                <v-select
                  id="type"
                  v-model="type"
                  name="type"
                  class="cards__select"
                  :items="computedProductTypes()"
                  auto
                  attach
                />
              </div>

              <div class="form-group">
                <label
                  class="cards__label"
                  for="descripiton"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  v-model="description"
                  name="description"
                  type="text"
                  class="cards__textarea"
                  placeholder="Description"
                />
              </div>
            </v-col>
            <v-col
              cols="12"
              lg="6"
            >
              <div
                class="product-detail__refer-currency form-group"
              >
                <label
                  class="cards__label"
                  for="refer-currency"
                >
                  Offer Prices
                </label>
                <div class="product-detail__refer-currency__wrapper">
                  <v-row>
                    <v-simple-table class="cards__tbl-wrapper cards__tbl-hover-none cards__tbl-hover-no-bg">
                      <thead>
                        <tr>
                          <th
                            id="refer-price-currency"
                          >
                            <div class="text-left ml-3">
                              Currency
                            </div>
                          </th>
                          <th>
                            <div class="text-right mr-3">
                              Offer Price
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          class="token-detail__price-set__currency"
                        >
                          <td
                            class="token-detail__refer-currency__tbl-col-left"
                          >
                            <div class="ml-3">
                              <div>
                                ETH
                              </div>
                              <div
                                class="token-detail__refer-currency__only-refer"
                              >
                                For refer only
                              </div>
                            </div>
                          </td>
                          <!-- <td
                            v-if="isReferedCurrency(currency)"
                            :class="{
                              'token-detail__refer-currency__p-vertical-8': isConfirming(),
                              'token-detail__refer-currency__p-vertical-15': !isConfirming()
                            }"
                          >
                            <div class="token-detail__refer-currency__amount mr-3">
                              <div
                                :class="{
                                  'token-detail__refer-currency__updating': isConfirming()
                                }"
                              >
                                {{ getReferAmountAsText(currency) }} {{ currency.toUpperCase() }}
                              </div>
                              <small
                                v-if="isConfirming()"
                                class="token-detail__refer-currency__updating"
                              >
                                {{ $t('token_detail.lbl_updating') }}
                              </small>
                            </div>
                          </td> -->
                          <!-- <td
                            v-else
                          > -->
                          <div class="text-right mr-3">
                            ---
                          </div>
                          <!-- </td> -->
                        </tr>
                      </tbody>
                    </v-simple-table>
                  </v-row>
                </div>
              </div>
            </v-col>
          </v-row>

          <!-- button -->
          <div
            class="product-detail__group-actions"
          >
            <button
              type="button"
              class="ft__btn-submit ft__btn-small ml-1 mr-1"
              @click="apply"
            >
              <div
                v-if="actions.requesting"
                class="ft__auth-loading"
              >
                <font-awesome-icon
                  icon="spinner"
                  class="fa-spin"
                />
              </div>
              Apply
            </button>
            <button
              type="button"
              class="ft__btn-submit ft__btn-small ft__btn-white"
              @click="exit"
            >
              Exit
            </button>
          </div>
        </div>
      </template>
    </app-container>
  </div>
</template>

<script>
  import * as _ from 'lodash'
  import store from '@/store'
  import { Gender, SellingStatuses, SellingConfirmingTypes, NotificationType, ProductTypes } from '../../constants'
  import { productsActions, commonActions } from '@/store/actions.type'
  import { productsGetters } from '@/store/getters.type'
  // import { productsMutations } from '@/store/mutations.type'
  import Web3Service from '@/services/web3-service'
  import { mapActions, mapGetters, mapState } from 'vuex'
  const numberRegex = /^[0-9]+$/
  export default {
    name: 'ProductDetails',

    components: {
      AppContainer: () => import('@/views/dashboard/components/AppContainer'),
    },

    data () {
      return {
        loaded: false,
        gender: '',
        Gender,
        type: '',
        sellingStatus: '',
        description: '',
        actions: {
          submitted: false,
          requesting: false,
        },
      }
    },

    computed: {
      ...mapState({
        successErg: (state) => state.products.successErg,
        errorMsg: (state) => state.products.errorMsg,
      }),
      ...mapGetters({
        selectedProduct: productsGetters.GET_SELECTED_PRODUCT,
      }),

    },

    beforeRouteEnter (to, from, next) {
      if (!to.params || !to.params.id || !numberRegex.test(to.params.id)) {
        return next(false)
      }
      Promise.all([
        store.dispatch(productsActions.FETCH_PRODUCT_DETAILS, to.params.id),
      ]).then(() => {
        return next()
      }).catch(() => {
        return next({ name: 'Products Listing' })
      })
    },

    mounted () {
      this.connect()
        .then((account) => {
          this.account = account
          return Web3Service.checkRole()
        })
        .then(response => {
          this.binding()
          this.loaded = true

          if (response.hasRole) {
            return
          }
          this.setNotification({
            type: NotificationType.ERROR,
            msg: response.message,
            timeout: 5000,
          })
        })
    },

    methods: {
      ...mapActions({
        setAlert: commonActions.SET_ETHERERUM_CONNECTION_ALERT,
        setNotification: commonActions.SET_NOTIFICATION,
      }),

      connect () {
        // check connect to metaMask
        return Web3Service.connectToMetaMask()
          .catch(err => {
            Web3Service.handleError(err, this.setAlert)
            throw err
          })
      },

      binding () {
        // set data
        // status
        const _statuses = SellingStatuses.concat(SellingConfirmingTypes)
        const status = _.find(_statuses, s => s.value === this.selectedProduct.status)
        this.sellingStatus = status.value
        // gender
        const gender = _.find(Gender, g => g.value === this.selectedProduct.gender)
        this.gender = gender.value
        // type
        const type = _.find(ProductTypes, p => p.value === this.selectedProduct.type)
        this.type = type.value
        this.description = this.selectedProduct.description
        if (!this.selectedBundle) {

        }
      },

      computedSellingStatuses () {
        const _statuses = SellingStatuses.concat(SellingConfirmingTypes)
        const allStatuses = _.map(_statuses, s => {
          if (s.value === '') {
            return null
          }
          if (this.canEditable()) {
            return s.canEditable ? Object.assign({}, s, { text: s.text }) : null
          }
          return Object.assign({}, s, { text: s.text })
        })
        return _.compact(allStatuses)
      },

      canEditable () {
        const _statuses = SellingStatuses.concat(SellingConfirmingTypes)

        if (!this.selectedProduct) {
          return false
        }
        const sellingStatus = _.find(_statuses, s => s.value === this.selectedProduct.status)
        return sellingStatus ? sellingStatus.canEditable : false
      },

      getSellingStatusColor () {
        if (!this.selectedProduct) {
          return false
        }
        const _statuses = SellingStatuses.concat(SellingConfirmingTypes)
        const _sellingStatus = _.find(_statuses, s => s.value === this.sellingStatus)
        return _sellingStatus.textColor
      },

      computedGender () {
        const genders = _.map(Gender, g => {
          if (g.value === '') {
            return null
          }
          return Object.assign({}, g, { text: g.text })
        })
        return _.compact(genders)
      },

      computedProductTypes () {
        const productTypes = _.map(ProductTypes, p => {
          if (p.value === '') {
            return null
          }
          return Object.assign({}, p, { text: p.text })
        })
        return _.compact(productTypes)
      },

      apply () {

      },

      exit () {

      },
    },
  }
</script>
