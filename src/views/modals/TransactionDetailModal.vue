<template>
  <v-dialog
    v-model="show"
    max-width="820"
  >
    <v-card
      class="tdm__wrap-content"
      rounded
    >
      <v-row
        v-if="!loaded"
      >
        <v-col
          cols="12"
          lg="12"
        >
          <div
            class="ft__container-loading"
          >
            <font-awesome-icon
              icon="spinner"
              class="fa-spin ft__loading"
            />
          </div>
        </v-col>
      </v-row>

      <div>
        <div>
          <v-row
            v-if="loaded"
            class="tdm__container tdm__container__header"
          >
            <v-col
              cols="11"
              class="tdm__header"
            >
              <img
                src="/images/icons/group-17.png"
                alt="App"
                class="tdm__header-logo"
              >
              <div class="tdm__header-name">
                {{ getDisplayName() }}
              </div>
            </v-col>
            <v-col
              v-if="loaded"
            >
              <v-btn
                icon
                @click="show = false"
              >
                <v-icon
                  size="20"
                  class="tdm__btn-close"
                >
                  mdi-close
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </div>

        <v-row
          v-if="loaded"
          class="tdm__container"
        >
          <v-col
            cols="3"
          >
            <div class="tdm__box-left">
              <div class="tdm__box-title">
                Transaction Date
              </div>
              <div class="tdm__box-info">
                <div class="tdm__box-datetime">
                  {{ timeFormatterAsText(currentTx.updatedAt, 'DD/MM/YYYY') }}
                  {{ timeFormatterAsText(currentTx.updatedAt, 'HH:mm:ss') }}
                </div>
              </div>
            </div>

            <div class="tdm__box-left">
              <div class="tdm__box-title">
                Image
              </div>
              <div class="tdm__box-info">
                <div class="tdm__box-image">
                  <img
                    :src="VUE_APP_API_URL + currentTx.image"
                    class="tdm__box-product-image"
                  >
                </div>
              </div>
            </div>

            <div class="tdm__box-left">
              <div class="tdm__box-title">
                Gender
              </div>
              <div class="tdm__box-info">
                <div class="tdm__box-gender">
                  {{ getGenderAsText(currentTx.gender) }}
                </div>
              </div>
            </div>

            <div class="tdm__box-left">
              <div class="tdm__box-title">
                Type
              </div>
              <div class="tdm__box-info">
                <div class="tdm__box-type">
                  {{ getTypeAsText(currentTx.type) }}
                </div>
              </div>
            </div>
          </v-col>

          <v-col
            cols="9"
            class="tdm__container__right"
          >
            <div class="tdm__box-right">
              <div class="tdm__box-title">
                <div>
                  Transaction Information
                </div>
                <div v-if="!!getTransactionUrl()">
                  <a
                    :href="getTransactionUrl()"
                    target="_blank"
                  >
                    View on Etherscan
                  </a>
                </div>
              </div>
              <div class="tdm__address">
                <div class="tdm__address__title">
                  Buyer Address
                </div>
                <div class="tdm__address__info">
                  {{ currentTx.buyerAddress ? currentTx.buyerAddress.toLowerCase() : '' }}
                </div>
                <div class="tdm__address__title">
                  Seller Address
                </div>
                <div class="tdm__address__info">
                  {{ currentTx.sellerAddress ? currentTx.sellerAddress.toLowerCase() : '' }}
                </div>
              </div>
            </div>

            <div class="tdm__box-right">
              <div class="tdm__box-title">
                Fasty Revenue
              </div>
              <div class="tdm__box-info">
                <v-simple-table class="cards__tbl_wrapper cards__tbl-hover-none cards__tbl-hover-no-bg">
                  <tbody>
                    <tr>
                      <td class="tdm__tbl-col-no">
                        (1)
                      </td>
                      <td class="tdm__tbl-col-title">
                        Offer Price
                      </td>
                      <td class="tdm__tbl-col-price">
                        {{ getOfferPriceAsText() }}
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
  import * as _ from 'lodash'
  // import BigNumber from 'bignumber.js'
  import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
  import { Coins, NotificationType, Gender, ProductTypes } from '@/constants'
  import { splitZero, formatNumberAsText, formatLocalTimeInSeconds, convertUnitToReal } from '@/utils/converter'
  import { txsGetters } from '@/store/getters.type'
  import { txsActions, commonActions } from '@/store/actions.type'
  import Web3Service from '@/services/web3-service'
  import ErrorHandler from '@/services/error-handler'

  let notifyTimeout
  export default {
    name: 'TransactionDetailModal',

    components: {

    },

    props: {
      value: Boolean,
      orderId: {
        type: String,
        default: null,
      },
    },

    data () {
      return {
        loaded: false,
        // fees: {
        //   genesisFee: 0,
        //   inviterReward: 0,
        //   buyerReward: 0,
        // },
        coins: Coins,
        Gender,
        VUE_APP_API_URL: process.env.VUE_APP_API_URL,
      }
    },

    computed: {
      /* eslint-disable vue/no-dupe-keys */
      show: {
        get () {
          return this.value
        },
        set (value) {
          this.$emit('input', value)
        },
      },
      ...mapState({
        errorMsg: (state) => state.transactions.errorMsg,
      }),
      ...mapGetters({
        currentTx: txsGetters.GET_SELECTED_TRANSACTION,
      }),
    },

    mounted () {
      this.$store.dispatch(txsActions.GET_SELECTED_TRANSACTION, this.orderId)
        // .then((_) => {
        //   return this.getFeeDetail()
        // })
        .then((_) => {
          this.loaded = true
        })
        .catch((_) => {
          this.setNotification({
            type: NotificationType.ERROR,
            msg: ErrorHandler.getMessage(null, this.errorMsg),
          })
          this._resetForm()
        })
    },

    methods: {
      ...mapMutations({
        resetMessage: 'RESET_MESSAGE',
      }),
      ...mapActions({
        setNotification: commonActions.SET_NOTIFICATION,
      }),
      // isInitialOffer () {
      //   if (!this.currentTx || !this.currentTx.transactionType) {
      //     return false
      //   }
      //   const initialType = this.transactionTypes[2]
      //   return this.currentTx.transactionType === initialType.value
      // },
      // async getFeeDetail () {
      //   if (!this.currentTx || !this.currentTx.feeSettingId) {
      //     return
      //   }

      //   const SYSTEM_FEE_COEFF = await Web3Service.readContract(SmartContractMethod.SYSTEM_FEE_COEFF, [])
      //   const feesResult = await Web3Service.readContract(SmartContractMethod.GET_SYSTEM_FEE, [this.currentTx.feeSettingId])
      //   this.fees.genesisFee = new BigNumber(feesResult.genesisFee || 0).multipliedBy(100).div(SYSTEM_FEE_COEFF).decimalPlaces(2).toNumber()
      //   this.fees.inviterReward = new BigNumber(feesResult.inviterReward || 0).multipliedBy(100).div(SYSTEM_FEE_COEFF).decimalPlaces(2).toNumber()
      //   this.fees.buyerReward = new BigNumber(feesResult.buyerReward || 0).multipliedBy(100).div(SYSTEM_FEE_COEFF).decimalPlaces(2).toNumber()
      // },
      timeFormatterAsText (time, format) {
        if (!time || !format) {
          return ''
        }
        return formatLocalTimeInSeconds(Math.ceil(time / 1000), format)
      },
      getDisplayName () {
        if (!this.currentTx) {
          return ''
        }
        return this.currentTx.productName
      },
      // getTransactionTypeAsText () {
      //   if (!this.currentTx || !this.currentTx.transactionType) {
      //     return ''
      //   }
      //   const txType = _.find(this.transactionTypes, t => t.value === this.currentTx.transactionType)
      //   if (!txType) {
      //     return ''
      //   }
      //   return this.$t(txType.text)
      // },
      getOfferPrice () {
        if (!this.currentTx || !this.currentTx.price || !this.currentTx.currency) {
          return '--'
        }
        const coin = _.find(this.coins, c => c.value === this.currentTx.currency)
        if (!coin) {
          return '--'
        }
        const amount = convertUnitToReal(this.currentTx.price, coin.decimals)
        return {
          amount,
          coin,
        }
      },
      // gender
      getGenderAsText (gender) {
        const genderObject = _.find(Gender, g => g.value === gender)
        return genderObject ? genderObject.text : ''
      },
      getGenderAsColor (gender) {
        const genderObject = _.find(Gender, g => g.value === gender)
        return genderObject ? genderObject.textColor : ''
      },
      getTypeAsText (type) {
        const productType = _.find(ProductTypes, t => t.value === type)
        return productType ? productType.text : ''
      },
      getOfferPriceAsText () {
        const { amount, coin } = this.getOfferPrice()
        return splitZero(formatNumberAsText(amount, coin.decimals)) + ' ' + coin.text
      },
      // getGenesisFeePercentageAsText () {
      //   if (!this.currentTx || !this.currentTx.feeSettingId) {
      //     return this.$t('modals.transaction_detail.right.lbl_genesis_fee_value', {
      //       percentage: '---',
      //     })
      //   }
      //   if (this.isInitialOffer()) {
      //     return this.$t('modals.transaction_detail.right.lbl_no_apply')
      //   }
      //   return this.$t('modals.transaction_detail.right.lbl_genesis_fee_value', {
      //     percentage: this.fees.genesisFee,
      //   })
      // },
      // getGenesisRevenueAsText () {
      //   const { amount, coin } = this.getOfferPrice()
      //   const genesisRevenue = amount.multipliedBy(this.fees.genesisFee).div(100)
      //   return splitZero(formatNumberAsText(genesisRevenue, coin.decimals)) + ' ' + coin.text
      // },
      // getSellerRevenueAsText () {
      //   const { amount, coin } = this.getOfferPrice()
      //   const genesisRevenue = this.isInitialOffer() ? new BigNumber(0) : amount.multipliedBy(this.fees.genesisFee).div(100)
      //   return splitZero(formatNumberAsText(amount.minus(genesisRevenue), coin.decimals)) + ' ' + coin.text
      // },
      getTransactionUrl () {
        if (!this.currentTx || !this.currentTx.txId) {
          return ''
        }
        const config = Web3Service.getNetworkConfigs()
        return `${config.explorerEndpoint}/tx/${this.currentTx.txId}`
      },
      _resetForm () {
        if (notifyTimeout) {
          clearTimeout(notifyTimeout)
        }
        notifyTimeout = setTimeout(() => {
          this.resetMessage('transactions')
        }, 5000)
      },
    },
  }
</script>

<style lang="scss" scoped>
.tdm {
  &__tbl-col-no {
    width: 40px;
  }
  &__tbl-col-title {
    width: 160px;
  }
  &__tbl-col-sub {
    width: 100px;
  }
}
</style>
