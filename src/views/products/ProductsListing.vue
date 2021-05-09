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
                <td class="text-center">
                  {{ product.gender }}
                </td>
                <td class="text-right products__offer-price-box">
                  {{ product.price }}
                </td>
                <td class="text-left">
                  {{ getSellingStatusAsText(product.status) }}
                </td>
                <td>
                  <v-row
                    justify="center"
                  >
                    <button
                      class="cards__link cards__link-bold"
                      @click="seeProductDetail(product.id)"
                    >
                      Edit
                    </button>
                  </v-row>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </base-material-card>

      <div class="py-3" />
    </v-container>

    <create-new-product-modal />
  </div>
</template>
<script>
  import * as _ from 'lodash'
  import { productsActions, commonActions } from '@/store/actions.type'
  import { mapActions, mapGetters, mapState } from 'vuex'
  import { productsGetters } from '@/store/getters.type'
  import {
    SellingStatuses,
  } from '../../constants'

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
          initialStatus: '',
        },
        // sortBy: {
        //   key: Sort.Type.Token.LAND_NAME,
        //   type: Sort.Direction.ASC,
        // },
        page: 1,
        limit: 10,
        // SellingStatuses,
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
      }),
    },

    mounted () {
      this.fetchData({
        isMounted: true,
      }).then(() => {
        this.loaded = true
      })
    },

    methods: {
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
      getSellingStatusAsText (status) {
        const _sellingStatus = _.find(SellingStatuses, s => s.value === status)
        return _sellingStatus ? _sellingStatus.text : ''
      },
      seeProductDetail (productId) {
        if (!productId) {
          return
        }
        this.$router.push(`/products/${productId}`).catch(error => error ? console.error(error) : '')
      },
    },
  }
</script>
