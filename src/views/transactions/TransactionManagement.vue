<template>
  <app-container>
    <template v-slot:coins-content>
      <div>
        <v-row style="justify-content: center">
          <v-col
            v-for="(revenue, index) in computedRevenues()"
            :key="'revenue__' + index"
            cols="4"
            class="pa-0"
          >
            <div
              class="txs__coin-item"
              :class="{
                'txs__no-border': index === 2
              }"
            >
              <div class="txs__coin-logo mr-3">
                <img
                  :src="revenue.icon"
                  :alt="revenue.text"
                  :class="'txs__img-' + revenue.value"
                >
              </div>
              <div class="txs__coin-detail">
                <div class="txs__coin-text-bold txs__coin-title">
                  {{ revenue.text }} Revenue
                </div>
                <div class="txs__coin-balance-bold txs__coin-balance">
                  {{ getTotalRevenueAsText(revenue) }}
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </template>

    <template v-slot:content>
      <div class="txs__coin-history__filter">
        <v-row>
          <v-col
            cols="12"
            class="txs__coin-history__row"
          >
            <div class="txs__coin-history__search-box">
              <div class="txs__coin-history__search mr-1">
                <div>
                  <img
                    src="/images/icons/icon-search.svg"
                    class="txs__coin-history__search-icon"
                  >
                </div>
                <input
                  id="search-key"
                  v-model.trim="history.search.key"
                  type="text"
                  name="search-key"
                  class="cards__input cards__pl-50"
                  placeholder="Search by product name"
                >
              </div>

              <div class="txs__coin-history__filter-item ml-5">
                From
                <div class="ml-3">
                  <datetime
                    id="search-filter-from"
                    v-model="history.search.from"
                    format="DD/MM/YYYY"
                    class="cards__s-picker mr-3"
                    position="right"
                    :index="1"
                  />
                </div>
              </div>

              <div class="txs__coin-history__filter-item">
                To
                <div class="ml-3">
                  <datetime
                    id="search-filter-to"
                    v-model="history.search.to"
                    format="DD/MM/YYYY"
                    class="cards__s-picker mr-3"
                    position="right"
                    :index="2"
                  />
                </div>
              </div>
            </div>

            <div class="txs__coin-history__search-box txs__coin-history__search-right">
              <button
                class="ft__btn-submit ft__btn-small mr-1"
              >
                Search
              </button>

              <button
                class="ft__btn-submit ft__btn-small ft__btn-white"
              >
                Reset
              </button>
            </div>
          </v-col>
        </v-row>

      <!-- <v-row v-if="submitted && validators.errorMessage">
        <v-col
          cols="12"
          lg="12"
          class="pt-0"
        >
          <small class="text-error">
            {{ $t(validators.errorMessage) }}
          </small>
        </v-col>
      </v-row> -->
      </div>

      <!-- history -->
      <div class="txs__coin-history">
        <div
          v-if="!loaded"
          class="ft__container-loading"
        >
          <font-awesome-icon
            icon="spinner"
            class="fa-spin ft__loading"
          />
        </div>

        <v-row v-if="loaded && allTransactions.length === 0">
          <v-col
            cols="12"
            lg="12"
          >
            <app-no-data
              :text="!isMounted ? '' : 'No data'"
            />
          </v-col>
        </v-row>

        <v-card-text
          v-if="loaded && allTransactions.length !== 0"
          class="pa-0"
        >
          <v-simple-table class="cards__tbl-wrapper cards__tbl-hover-none">
            <thead>
              <tr>
                <th
                  id="txs-head-id"
                  class="text-center"
                >
                  No
                </th>
                <th
                  id="txs-head-datetime"
                >
                  <div class="sort-items text-left">
                    <div>
                      Date Time
                    </div>
                    <div class="sort-dir">
                      <font-awesome-icon
                        icon="sort-up"
                        class="sort-dir-up"
                        :class="{
                          'sort-enabled': history.sortBy.key === Sort.Type.Transaction.DATETIME && history.sortBy.type === Sort.Direction.ASC,
                          'sort-disabled': history.sortBy.key !== Sort.Type.Transaction.DATETIME || history.sortBy.type !== Sort.Direction.ASC,
                        }"
                      />
                      <font-awesome-icon
                        icon="sort-down"
                        class="sort-dir-down"
                        :class="{
                          'sort-enabled': history.sortBy.key === Sort.Type.Transaction.DATETIME && history.sortBy.type === Sort.Direction.DESC,
                          'sort-disabled': history.sortBy.key !== Sort.Type.Transaction.DATETIME || history.sortBy.type !== Sort.Direction.DESC,
                        }"
                      />
                    </div>
                  </div>
                </th>

                <th
                  id="txs-head-name"
                  class="text-left"
                >
                  Product Name
                </th>
                <th
                  id="txs-head-revenue"
                >
                  <div class="sort-items text-right">
                    <div>
                      Revenue
                    </div>
                  </div>
                </th>
                <th
                  id="txs-head-action"
                >
                  <div class="sort-items text-center">
                    <div>
                      Action
                    </div>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody v-if="!isFetching">
              <tr
                v-for="(tx, index) in allTransactions"
                :key="tx.id + '_' + index"
              >
                <td class="text-center">
                  {{ tx.index }}
                </td>
                <td class="text-left">
                  <div>{{ timeFormatterAsText(tx.updatedAt, 'DD/MM/YYYY') }}</div>
                  <div class="cards__time">
                    {{ timeFormatterAsText(tx.updatedAt, 'HH:mm:ss') }}
                  </div>
                </td>
                <td class="text-left">
                  {{ getProductNameAsText(tx) }}
                </td>
                <td class="text-right">
                  {{ getRevenueAsText(tx.price, tx.currency) }}
                </td>
                <td class="text-center">
                  <v-row class="justify-center">
                    <button
                      class="cards__link cards__link-bold"
                      @click="seeTransactionDetail(tx.id)"
                    >
                      View
                    </button>
                  </v-row>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>

        <!-- <v-row v-if="loaded && !isFetching && allTransactions.length !== 0">
          <v-col
            cols="12"
            lg="12"
          >
            <div class="cards__pagination__wrapper">
              <div class="cards__pagination__limit">
                {{ $t('common.pagination.lbl_show') }}
                <v-select
                  id="pagination-limit"
                  v-model="history.limit"
                  :items="computedLimits()"
                  class="cards__select-bottom cards__select cards__pagination__select ml-3 mr-3"
                  auto
                  attach
                  @change="limitChange"
                />
              </div>

              <v-spacer />

              <div class="cards__pagination__page">
                <v-row>
                  <paginate
                    v-model="history.page"
                    :page-count="getMaxPage()"
                    :page-range="3"
                    :margin-pages="2"
                    :container-class="'pagination'"
                    :page-class="'cus-page-item'"
                    :page-link-class="'cus-page-link-item'"
                    :prev-class="'cus-prev-item'"
                    :prev-link-class="'cus-prev-link-item'"
                    :next-class="'cus-next-item'"
                    :next-link-class="'cus-next-link-item'"
                    :break-view-class="'cus-break-view'"
                    :break-view-link-class="'cus-break-view-link'"
                    :active-class="'cus-page-active'"
                    :prev-text="$t('common.pagination.lbl_previous')"
                    :next-text="$t('common.pagination.lbl_next')"
                    :click-handler="fetchWithTimeout"
                  />
                </v-row>
              </div>
            </div>
          </v-col>
        </v-row> -->
      </div>

      <div class="py-3" />
    </template>
  </app-container>
</template>
<script>
  import * as _ from 'lodash'
  import moment from 'moment'
  import datetime from 'sota-vuejs-datetimepicker'
  import { txsActions, commonActions } from '@/store/actions.type'
  import { Coins, NotificationType, Sort } from '../../constants'
  import ErrorHandler from '@/services/error-handler'
  import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
  import { txsGetters } from '@/store/getters.type'
  import { splitZero, formatNumberAsText, convertUnitToReal, formatLocalTimeInSeconds } from '@/utils/converter'

  let notifyTimeout
  export default {
    name: 'TransactionManagement',

    components: {
      datetime,
      AppContainer: () => import('@/views/dashboard/components/AppContainer'),
    },

    data () {
      return {
        loaded: false,
        isMounted: true,
        isFetching: false,
        isShowCurrentTx: false,
        history: {
          search: {
            key: '',
            from: '',
            to: '',
          },
          sortBy: {
            key: Sort.Type.Transaction.DATETIME,
            type: Sort.Direction.DESC,
          },
          page: 1,
          limit: 10,
        },
        coins: Coins,
        Sort,
        formatNumberAsText,
        convertUnitToReal,
        formatLocalTimeInSeconds,
      }
    },

    computed: {
      ...mapState({
        errorMsg: (state) => state.transactions.errorMsg,
      }),
      ...mapGetters({
        totalRevenues: txsGetters.GET_TOTAL_REVENUES,
        totalTransactions: txsGetters.GET_TOTAL_TRANSACTIONS,
        allTransactions: txsGetters.GET_ALL_TRANSACTIONS,
      }),
    },

    mounted () {
      this.fetchRevenues()
        .then((_) => {
          return this.fetch({ isMounted: true })
        })
        .then((_) => {
          this.loaded = true
        })
    },

    methods: {
      ...mapMutations({
        resetMessage: 'RESET_MESSAGE',
      }),
      ...mapActions({
        setNotification: commonActions.SET_NOTIFICATION,
      }),
      computedRevenues () {
        return _.map(this.totalRevenues, revenue => {
          const coin = _.find(Coins, coin => coin.value === revenue.currency)
          return Object.assign(revenue, {
            text: coin ? coin.text : '',
            icon: coin ? coin.icon : '',
            decimals: coin ? coin.decimals : 18,
          })
        })
      },
      fetchRevenues () {
        return this.$store.dispatch(txsActions.GET_TOTAL_REVENUES)
          .catch((_) => {
            this.handleErrorNotification()
          })
      },
      async fetch (options = {}) {
        let startDate
        let endDate
        if (this.history.search.from) {
          startDate = moment(this.history.search.from, 'DD/MM/YYYY').startOf('day').valueOf()
        }
        if (this.history.search.to) {
          endDate = moment(this.history.search.to, 'DD/MM/YYYY').endOf('day').valueOf()
        }
        await this.$store.dispatch(txsActions.FETCH_TRANSACTIONS, {
          name: this.history.search.key,
          start_date: startDate,
          end_date: endDate,
          page: this.history.page,
          limit: this.history.limit,
          sort_by: this.history.sortBy.key,
          sort_type: this.history.sortBy.type,
        })
          .catch((_) => {
            this.isFetching = false
            this.submitted = false
            if (!options.isMounted) {
              this.isMounted = false
            }
            this.handleErrorNotification()
          })
      },
      getRevenueAsText (revenue, currency) {
        if (!revenue || !currency) {
          return '--'
        }
        const coin = _.find(this.coins, c => c.value === currency)
        if (!coin) {
          return '--'
        }
        const amount = splitZero(formatNumberAsText(convertUnitToReal(revenue, coin.decimals)))
        return amount + ' ' + coin.text
      },
      getProductNameAsText (tx) {
        if (!tx) {
          return ''
        }
        return tx.productName
      },
      timeFormatterAsText (time, format) {
        if (!time || !format) {
          return ''
        }
        return formatLocalTimeInSeconds(Math.ceil(time / 1000), format)
      },
      getTotalRevenueAsText (revenue) {
        return splitZero(formatNumberAsText(convertUnitToReal(revenue.amount, revenue.decimals), 8))
      },
      handleErrorNotification () {
        this.setNotification({
          type: NotificationType.ERROR,
          msg: ErrorHandler.getMessage(null, this.errorMsg),
        })
        this._resetForm()
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
