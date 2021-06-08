<template>
  <div>
    <v-container
      id="products-listing"
      fluid
      tag="section"
    >
      <base-material-card
        class="px-5 py-3"
      >
        <div class="products__filter">
          <v-row>
            <v-col
              cols="12"
              class="products__filter-item-wrapper"
            >
              <div class="products__search mr-1">
                <div>
                  <img
                    src="/images/icons/icon-search.svg"
                    class="products__search-icon"
                  >
                </div>
                <input
                  id="search-key"
                  type="text"
                  name="search-key"
                  class="cards__input cards__pl-50"
                  placeholder="Search by product name"
                >
              </div>
              <button class="ft__btn-submit ft__btn-small mr-1">
                Search
              </button>

              <div class="spacer" />
              <button
                class="ft__btn-submit ft__btn-small"
                @click="setShowCreateProductModal(true)"
              >
                Add
              </button>
            </v-col>
          </v-row>
        </div>
        <v-card-text class="cards__v-text">
          <v-simple-table class="cards__tbl-wrapper cards__tbl-hover-none">
            <thead>
              <tr>
                <th class="text-center">
                  No
                </th>
                <th class="text-left">
                  Image
                </th>
                <th class="text-left">
                  Product Name
                </th>
                <th class="text-left">
                  Slug
                </th>
                <th class="text-center">
                  Gender
                </th>
                <th class="text-right">
                  Price
                </th>
                <th class="text-left">
                  Status
                </th>
                <th class="text-right text-center">
                  Action
                </th>
              </tr>
            </thead>

            <tbody v-if="!isFetching">
              <tr
                v-for="(product, index) in allProducts"
                :key="product.id + '_' + index"
              >
                <td>
                  <div class="products__row-index-box">
                    <div class="products__row-index-text">
                      {{ product.index }}
                    </div>
                  </div>
                </td>
                <td class="text-left">
                  <img
                    :src="VUE_APP_API_URL + product.image"
                    :alt="product.name"
                    class="products__image"
                  >
                </td>
                <td class="text-left">
                  {{ product.name }}
                </td>
                <td class="text-left">
                  {{ product.slug }}
                </td>
                <td
                  :class="getGenderAsColor(product.gender)"
                >
                  {{ getGenderAsText(product.gender) }}
                </td>
                <td class="text-right products__offer-price-box">
                  {{ soldPriceFormatter(product) }}
                </td>
                <td :class="getSellingStatusAsColor(product.status)">
                  {{ getSellingStatusAsText(product.status) }}
                </td>
                <td>
                  <v-row
                    justify="center"
                  >
                    <button
                      v-if="canEditable(product.status)"
                      class="cards__link cards__link-bold"
                      @click="seeProductDetail(product.id)"
                    >
                      Edit
                    </button>
                    <button
                      v-if="!canEditable(product.status)"
                      class="cards__link cards__link-bold"
                      @click="seeProductDetail(product.id)"
                    >
                      View
                    </button>
                  </v-row>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>

        <v-row v-if="loaded && !isFetching && allProducts.length !== 0">
          <v-col
            cols="12"
          >
            <div class="cards__pagination__wrapper">
              <div class="cards__pagination__limit">
                Show
                <v-select
                  id="pagination-limit"
                  v-model="limit"
                  :items="computedLimits()"
                  class="cards__select-bottom cards__select cards__pagination__select ml-3 mr-3"
                  auto
                  attach
                  @change="limitChange"
                />
              </div>

              <div class="cards__pagination__page">
                <v-row class="pagination">
                  <paginate
                    v-model="page"
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
                    :prev-text="'Prev'"
                    :next-text="'Next'"
                    :click-handler="fetchWithTimeout"
                  />
                </v-row>
              </div>
            </div>
          </v-col>
        </v-row>
      </base-material-card>

      <div class="py-3" />
    </v-container>

    <create-new-product-modal />
  </div>
</template>
<script>
  import * as _ from 'lodash'
  import { productsActions, commonActions } from '@/store/actions.type'
  import { productsMutations } from '@/store/mutations.type'
  import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
  import { productsGetters } from '@/store/getters.type'
  import { splitZero, formatNumberAsText, convertUnitToReal } from '@/utils/converter'
  import {
    Coins,
    Gender,
    SellingStatuses,
    LimitItems,
  } from '../../constants'

  // let notifyTimeout
  let filterDelayTimer
  export default {
    name: 'ProductsListing',

    components: {
      CreateNewProductModal: () => import('@/views/modals/CreateNewProductModal'),
    },

    data () {
      return {
        loaded: false,
        isMounted: true,
        isFetching: false,
        VUE_APP_API_URL: process.env.VUE_APP_API_URL,
        search: {
          key: '',
          status: '',
        },
        // sortBy: {
        //   key: Sort.Type.Token.LAND_NAME,
        //   type: Sort.Direction.ASC,
        // },
        page: 1,
        limit: 10,
        SellingStatuses,
        // Sort,
      }
    },

    computed: {
      ...mapState({
        errorMsg: (state) => state.products.errorMsg,
      }),
      ...mapGetters({
        totalProducts: productsGetters.GET_TOTAL_PRODUCTS,
        allProducts: productsGetters.GET_ALL_PRODUCTS,
        latestPage: productsGetters.GET_LATEST_PAGE,
      }),
    },

    mounted () {
      if (this.latestPage) {
        this.page = this.latestPage
        this.setLatestPage(0)
      }

      this.fetchData({
        isMounted: true,
      }).then(() => {
        this.loaded = true
      })
    },

    methods: {
      ...mapMutations({
        setLatestPage: productsMutations.SET_LATEST_PAGE,
        resetMessage: 'RESET_MESSAGE',
      }),
      ...mapActions({
        setShowCreateProductModal: commonActions.SET_SHOW_CREATE_PRODUCT_MODAL,
      }),

      async fetchData (options = {}) {
        await this.$store.dispatch(productsActions.FETCH_PRODUCTS, {
          page: this.page,
          limit: this.limit,
          key: this.search.key,
        }).catch(_ => {
          this.isFetching = false
          if (!options || !options.isMounted) {
            this.isMounted = false
          }
          // handle error
        })
        this.isFetching = false
        if (!options || !options.isMounted) {
          this.isMounted = false
        }
      },
      fetchWithTimeout () {
        if (filterDelayTimer) {
          clearTimeout(filterDelayTimer)
        }

        this.isFetching = true
        filterDelayTimer = setTimeout(() => {
          return this.fetchData()
        }, 1000)
      },
      soldPriceFormatter (product) {
        const currency = product.currency
        const coin = _.find(Coins, c => c.value === product.currency)
        const amount = product.price
        if (!amount || !coin || !currency) {
          return ''
        }
        return splitZero(formatNumberAsText(convertUnitToReal(amount, coin.decimals))) + ' ' + currency.toUpperCase()
      },
      // selling status
      getSellingStatusAsText (status) {
        const _sellingStatus = _.find(SellingStatuses, s => s.value === status)
        return _sellingStatus ? _sellingStatus.text : ''
      },
      getSellingStatusAsColor (status) {
        const sellingStatus = _.find(SellingStatuses, s => s.value === status)
        return sellingStatus ? sellingStatus.textColor : 'text-muted'
      },
      canEditable (status) {
        const sellingStatus = _.find(SellingStatuses, s => s.value === status)
        return sellingStatus ? sellingStatus.canEditable : false
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
      // pagination
      computedLimits () {
        return _.map(LimitItems, item => {
          return Object.assign({}, item, { text: item.text })
        })
      },
      limitChange (_) {
        this.page = 1
        this.fetchWithTimeout()
      },
      getMaxPage () {
        const maxPage = Math.ceil(this.totalProducts / this.limit)
        return maxPage
      },
      seeProductDetail (productId) {
        if (!productId) {
          return
        }
        this.setLatestPage(this.page)
        this.$router.push(`/products/${productId}`).catch(error => error ? console.error(error) : '')
      },
    },
  }
</script>
