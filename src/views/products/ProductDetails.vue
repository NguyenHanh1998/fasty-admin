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
              <div
                class="form-group"
              >
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
              <div
                v-if="!isOffSale() && !isCancelling()"
                class="form-group"
              >
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
                  :items="Gender"
                  :disabled="!isOnSale()"
                  auto
                  attach
                />
              </div>

              <div
                v-if="!isOffSale() && !isCancelling()"
                class="form-group"
              >
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
                  :items="ProductTypes"
                  :disabled="!isOnSale()"
                  auto
                  attach
                />
              </div>

              <div
                v-if="!isOffSale() && !isCancelling()"
                class="form-group"
              >
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
                  :disabled="!isOnSale()"
                  placeholder="Description"
                />
              </div>

              <div
                v-if="!isOffSale() && !isCancelling()"
                class="form-group"
              >
                <label
                  class="cards__label"
                  for="paid-currency"
                >
                  Choose default currency you want to get paid.
                </label>
                <v-select
                  id="paid-currency-select"
                  v-model="paidCurrency.currency"
                  name="paid-currency-select"
                  :items="Coins"
                  class="cards__select"
                  :disabled="!isOnSale()"
                  auto
                  attach
                />
              </div>

              <div
                v-if="!isOffSale() && !isCancelling()"
                class="form-group"
              >
                <div class="product-detail__price-set__offer">
                  <div class="product-detail__price-set__col-1-left product-detail__price-set__w-160 pa-0">
                    Offer Price
                  </div>
                  <div class="product-detail__price-set__unit-input-box">
                    <div class="product-detail__price-set__unit-input">
                      <div class="product-detail__price-set__input-box">
                        <label>{{ paidCurrency.currency.toUpperCase() }}</label>
                        <input
                          :id="'paid-currency-' + paidCurrency.currency + '-inp'"
                          v-model="paidCurrency.value"
                          :name="'paid-currency-' + paidCurrency.currency + '-inp'"
                          type="text"
                          class="cards__input cards__input-number cards__pl-50 cards__pr-50"
                          :disabled="!isOnSale()"
                          @input="onPaidCurrencyInput"
                        >
                      </div>
                    </div>
                  </div>
                  <!-- <div class="product-detail__price-set__col-1-right">
                    {{ paidCurrency.currency.toUpperCase() }} {{ getFinalPaidAmount() }}
                  </div> -->
                </div>
              </div>
            </v-col>

            <!-- right content -->
            <v-col
              cols="12"
              lg="6"
            >
              <div
                class="product-detail__refer-currency form-group"
              >
                <div
                  v-if="!isOffSale() && !isCancelling()"
                  class="form-group"
                >
                  <label
                    class="cards__label"
                    for="image"
                  >
                    Image
                  </label>
                  <img
                    :src="VUE_APP_API_URL + image"
                    :alt="image"
                    class="product-detail__image"
                  >
                </div>
                <label
                  class="cards__label"
                  for="refer-currency"
                >
                  Offer Prices in All Currency
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
                          class="product-detail__price-set__currency"
                        >
                          <td
                            class="product-detail__refer-currency__tbl-col-left"
                          >
                            <div class="ml-3">
                              <div>
                                ETH
                              </div>
                              <div
                                class="product-detail__refer-currency__only-refer"
                              >
                                For refer only
                              </div>
                            </div>
                          </td>
                          <!-- <td
                            v-if="isReferedCurrency(currency)"
                            :class="{
                              'product-detail__refer-currency__p-vertical-8': isConfirming(),
                              'product-detail__refer-currency__p-vertical-15': !isConfirming()
                            }"
                          >
                            <div class="product-detail__refer-currency__amount mr-3">
                              <div
                                :class="{
                                  'product-detail__refer-currency__updating': isConfirming()
                                }"
                              >
                                {{ getReferAmountAsText(currency) }} {{ currency.toUpperCase() }}
                              </div>
                              <small
                                v-if="isConfirming()"
                                class="product-detail__refer-currency__updating"
                              >
                                {{ $t('product_detail.lbl_updating') }}
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
              :disabled="!isSellingChanged || actions.requesting"
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

    <provider-not-available-modal v-if="showEthereumConnectionAlert.show" />
  </div>
</template>

<script>
  import * as _ from 'lodash'
  import store from '@/store'
  import _web3 from 'web3'
  import BigNumber from 'bignumber.js'
  import {
    splitZero,
    formatNumberAsText,
    convertUnitToReal,
    convertRealAmountToUnit,
    formatUuid,
    convertBytesToUint128Number,
  } from '@/utils/converter'
  import { v4 as uuidv4 } from 'uuid'
  import {
    Gender,
    SellingStatuses,
    SellingConfirmingTypes,
    NotificationType,
    ProductTypes,
    Coins,
    SmartContractMethod,
    OrderMethod,
  } from '../../constants'
  import { productsActions, commonActions } from '@/store/actions.type'
  import { productsGetters } from '@/store/getters.type'
  import { productsMutations } from '@/store/mutations.type'
  import Web3Service from '@/services/web3-service'
  import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
  import ErrorHandler from '@/services/error-handler'

  const numberRegex = /^[0-9]+$/
  let notifyTimeout
  const network = process.env.VUE_APP_NETWORK
  const networkConfigs = require(`@/config/eth/network/${network}.json`)
  export default {
    name: 'ProductDetails',

    components: {
      AppContainer: () => import('@/views/dashboard/components/AppContainer'),
      ProviderNotAvailableModal: () => import('@/views/modals/ProviderNotAvailableModal'),
    },

    data () {
      return {
        loaded: false,
        gender: '',
        type: '',
        sellingStatus: '',
        description: '',
        image: '',
        VUE_APP_API_URL: process.env.VUE_APP_API_URL,
        actions: {
          submitted: false,
          requesting: false,
        },
        initialSellingInfo: null,
        paidCurrency: {
          currency: Coins[0].value,
          value: '0.0',
          initialized: '0.0',
        },
        paidConverts: {
          eth: {
            id: 'paid-currency-eth-inp',
            value: '0.0',
            initialized: '0.0',
            errorMessage: '',
            isChecked: false,
            isDefault: true,
          },
        },
        Gender,
        ProductTypes,
        Coins,
      }
    },

    computed: {
      ...mapState({
        showEthereumConnectionAlert: (state) => state.common.ethererumConnectionAlert,
        successErg: (state) => state.products.successErg,
        errorMsg: (state) => state.products.errorMsg,
      }),
      ...mapGetters({
        selectedProduct: productsGetters.GET_SELECTED_PRODUCT,
      }),
      isSellingChanged: function () {
        const currentSellingInfo = this.getSellingInfo()
        return !_.isEqual(JSON.stringify(this.initialSellingInfo), JSON.stringify(currentSellingInfo))
      },
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
      ...mapMutations({
        resetMessage: 'RESET_MESSAGE',
        setSuccessMessage: productsMutations.SET_SUCCESS,
        setErrorMessage: productsMutations.SET_ERROR,
      }),
      ...mapActions({
        setAlert: commonActions.SET_ETHERERUM_CONNECTION_ALERT,
        setNotification: commonActions.SET_NOTIFICATION,
        setOverlayLoading: commonActions.SET_SHOW_OVERLAY_LOADING,
        submitOrderStatus: productsActions.SUBMIT_ORDER,
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
        this.image = this.selectedProduct.image
        if (!this.selectedProduct) {
          return
        }
        if (this.isOffSale()) {
          this.paidConverts[this.paidCurrency.currency] = {
            id: `paid-currency-${this.paidCurrency.currency}-inp`,
            value: '0.0',
            initialized: '0.0',
            errorMessage: '',
            isChecked: true,
            isDefault: true,
          }
        } else {
          // set prices
          const coin = _.find(Coins, c => c.value === this.selectedProduct.currency)
          const coinPrice = splitZero(
            convertUnitToReal(this.selectedProduct.price, coin.decimals).toFixed(coin.decimals).toString(),
          )

          this.paidCurrency = {
            currency: this.selectedProduct.currency,
            value: coinPrice,
            initialized: splitZero(
              convertUnitToReal(this.selectedProduct.price, coin.decimals).toFixed(coin.decimals).toString(),
            ),
          }
          // if (coinPrice.match(/\./)) {
          //   coinPrice = coinPrice.replace(/\.?0+$/, '').toString()
          // }
          this.paidConverts[this.selectedProduct.currency] = {
            id: `paid-currency-${this.selectedProduct.currency}-inp`,
            value: coinPrice,
            initialized: splitZero(
              convertUnitToReal(this.selectedProduct.price, coin.decimals).toFixed(coin.decimals).toString(),
            ),
            errorMessage: '',
            isChecked: true,
          }
        }
        this.initialSellingInfo = this.getSellingInfo()
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
      isOffSale () {
        const _statuses = SellingStatuses.concat(SellingConfirmingTypes)
        return this.sellingStatus === _statuses[1].value
      },
      isOnSale () {
        const _statuses = SellingStatuses.concat(SellingConfirmingTypes)
        return this.sellingStatus === _statuses[2].value
      },
      isCancelling () {
        const _statuses = SellingStatuses.concat(SellingConfirmingTypes)
        return this.sellingStatus === _statuses[8].value
      },
      getUpdatedPaymentInfo () {
        const paymentCurrencies = Object.keys(this.paidConverts).filter(
          currency => this.paidConverts[currency].isChecked)
        const offeredCurrencies = [null]
        const offeredAmounts = [null]

        const paymentMethods = _.map(paymentCurrencies, p => {
          const currency = this.getCoinBySymbol(p)
          const symbol = currency.value
          const decimals = currency.decimals

          offeredCurrencies[0] = this.getTokenAddress(symbol)
          const amount = convertRealAmountToUnit(this.paidConverts[symbol].value, decimals)
          offeredAmounts[0] = _web3.utils.toHex(_web3.utils.toBN(amount))

          return {
            currency: symbol,
            amount: amount.toFixed().toString(),
            isDefault: true,
          }
        })
        return { paymentMethods, offeredCurrencies, offeredAmounts }
      },
      getTokenAddress (currency) {
        return networkConfigs.tokenAddress[currency]
      },
      async apply () {
        this.actions.submitted = true
        this.actions.requesting = true

        const authorized = await Web3Service.checkRole()
        if (!authorized.hasRole) {
          this.actions.requesting = false
          this.setNotification({
            type: NotificationType.ERROR,
            msg: authorized.message,
          })
          return
        }

        this.setOverlayLoading(true)
        if (this.isCreateOrder()) {
          await this.handleCreateOrder()
        }
      },
      async handleCreateOrder () {
        let isWeb3Error = true
        try {
          const orderId = await this.generateOrderId(10)
          if (!orderId) {
            throw new Error('Could not create order')
          }

          const { paymentMethods, offeredCurrencies, offeredAmounts } = this.getUpdatedPaymentInfo()
          const exchangeAddress = networkConfigs.tokenContractAddress
          let methodName
          let params
          const productId = this.selectedProduct.id
          // check product is issued
          const isProductExistent = await this.productHasExisted()
          if (isProductExistent) {
            // create product order
            methodName = SmartContractMethod.CREATE_SINGLE_PRODUCT_ORDER
            params = [
              orderId,
              productId,
              offeredCurrencies,
              offeredAmounts,
            ]
          } else {
            // issue and create product order
            const productId = this.selectedProduct.id
            const productName = _web3.utils.fromAscii(this.selectedProduct.name)
            methodName = SmartContractMethod.ISSUE_AND_CREATE_SINGLE_PRODUCT_ORDER
            params = [
              orderId,
              productId,
              productName,
              offeredCurrencies,
              offeredAmounts,
            ]
          }

          // request to smart contract
          const { txid } = await Web3Service.sendTransaction(
            methodName,
            params,
          )
          isWeb3Error = false

          const productInfo = {
            name: this.selectedProduct.name,
            description: this.description,
            type: this.type,
            gender: this.gender,
            price: _.find(paymentMethods, payment => payment.isDefault).amount,
            currency: _.find(paymentMethods, payment => payment.isDefault).currency,
          }

          const apiParams = {
            orderId,
            exchangeAddress,
            txid,
            productId,
            amount: _.find(paymentMethods, payment => payment.isDefault).amount,
            currency: _.find(paymentMethods, payment => payment.isDefault).currency,
            paymentMethods,
            product: productInfo,
          }

          // request to api service
          await this.submitOrderStatus({
            method: OrderMethod.CREATE,
            params: apiParams,
          })

          this.setSuccessMessage({
            message: 'Order creating!',
            isServer: false,
          })
          this.handleSuccessNotification()
        } catch (error) {
          if (isWeb3Error) {
            this.setErrorMessage({ error, isServer: false })
          }
          this.handleErrorNotification()
        }
      },
      async productHasExisted () {
        const isExistent = await Web3Service.readContract(SmartContractMethod.HAS_EXISTENT_TOKEN, [this.selectedProduct.id])
        if (!isExistent || isExistent.toString() === 'false' || isExistent.toString() === '0') {
          return false
        }
        return true
      },
      async generateOrderId (retry) {
        const orderId = convertBytesToUint128Number(formatUuid(uuidv4()))
        if (retry === 0) {
          return null
        }
        try {
          // check order id existed?
          const isExistent = await this.hasExistedOrder(orderId)
          if (!isExistent || isExistent.toString() === 'false' || isExistent.toString() === '0') {
            return orderId
          }
          return this.generateOrderId(retry - 1)
        } catch (err) {
          return this.generateOrderId(retry - 1)
        }
      },
      async hasExistedOrder (orderId) {
        const result = await Web3Service.readContract(SmartContractMethod.HAS_EXISTENT_ORDER, [orderId])
        return result
      },
      isCreateOrder () {
        const statuses = SellingStatuses.concat(SellingConfirmingTypes)
        return this.isSellingChanged && this.selectedProduct.status === statuses[1].value &&
          this.sellingStatus === statuses[2].value
      },
      onPaidCurrencyInput () {
        this.actions.submitted = false
        if (new BigNumber(this.paidCurrency.initialized).gt(0)) {
          this.paidCurrency.initialized = '0.0'
        }

        const defaultCoin = this.getCoinBySymbol(this.paidCurrency.currency)
        this.paidConverts[this.paidCurrency.currency].isChecked = true
        this.paidConverts[this.paidCurrency.currency].value = splitZero(
          this.getReferAmount(this.paidCurrency.currency, true).toFixed(defaultCoin.decimals).toString(),
        )
      },
      getFinalPaidAmount () {
        let finalPaidAmount
        if (new BigNumber(this.paidCurrency.initialized).gt(0)) {
          finalPaidAmount = new BigNumber(this.paidCurrency.initialized)
        } else if (!this.paidCurrency.value || this.paidCurrency.value.length === 0) {
          finalPaidAmount = new BigNumber(0)
        } else {
          finalPaidAmount = new BigNumber(this.paidCurrency.value)
        }
        if (finalPaidAmount.gt(1)) {
          return splitZero(formatNumberAsText(finalPaidAmount.decimalPlaces(2).toString()))
        }
        return splitZero(formatNumberAsText(finalPaidAmount.decimalPlaces(8).toString()))
      },
      getReferAmount (currency, ignore) {
        if (!currency || currency.length === 0 || !this.paidCurrency.value || this.paidCurrency.value.length === 0) {
          return new BigNumber(0)
        }
        if (!ignore && this.paidConverts[currency] && new BigNumber(this.paidConverts[currency].value).gt(0)) {
          return new BigNumber(this.paidConverts[currency].value)
        }
        return new BigNumber(this.paidCurrency.value)
      },
      getCoinBySymbol (currency) {
        if (!currency) {
          return 0
        }
        const coin = _.find(Coins, c => c.value === currency)
        return coin
      },

      getSellingInfo () {
        const sellingInfo = {}
        sellingInfo.sellingStatus = this.sellingStatus
        sellingInfo.gender = this.gender
        sellingInfo.type = this.type
        sellingInfo.payment = _.cloneDeep(this.paidConverts)
        Object.keys(sellingInfo.payment).forEach(currency => {
          delete sellingInfo.payment[currency].initialized
        })

        return sellingInfo
      },
      handleSuccessNotification () {
        this.setNotification({
          type: NotificationType.SUCCESS,
          msg: ErrorHandler.getMessage(this.successMsg, null),
        })
        this._resetForm(true)
      },
      handleErrorNotification () {
        this.setNotification({
          type: NotificationType.ERROR,
          msg: ErrorHandler.getMessage(null, this.errorMsg),
        })
        this._resetForm()
      },
      _resetForm (shouldReload) {
        if (notifyTimeout) {
          clearTimeout(notifyTimeout)
        }
        if (shouldReload) {
          notifyTimeout = setTimeout(() => {
            this.resetMessage('tokens')
            window.location.reload()
          }, 2000)
        } else {
          this.actions.submitted = false
          this.actions.requesting = false
          this.setOverlayLoading(false)

          notifyTimeout = setTimeout(() => {
            this.resetMessage('tokens')
          }, 5000)
        }
      },
      exit () {

      },
    },
  }
</script>
