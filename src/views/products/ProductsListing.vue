<template>
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
              <th class="text-center">
                Product Name
              </th>
              <th class="text-center">
                Slug
              </th>
              <th class="text-center">
                Description
              </th>
              <th class="text-center">
                Image
              </th>
              <th class="text-right text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td class="tokens__row-index-text">
                1
              </td>
              <td class="text-right">
                Dakota Rice
              </td>
              <td class="text-right">
                Niger
              </td>
              <td class="text-right">
                Oud-Turnhout
              </td>
              <td class="text-right">
                $36,738
              </td>
            </tr>

            <tr>
              <td>2</td>
              <td>Minverva Hooper</td>
              <td>Curaçao</td>
              <td>Sinaas-Waas</td>
              <td class="text-right">
                $23,789
              </td>
            </tr>

            <tr>
              <td>3</td>
              <td>Sage Rodriguez</td>
              <td>Netherlands</td>
              <td>Baileux</td>
              <td class="text-right">
                $56,142
              </td>
            </tr>

            <tr>
              <td>4</td>
              <td>Philip Chaney</td>
              <td>Korea, South</td>
              <td>Overland Park</td>
              <td class="text-right">
                $38,735
              </td>
            </tr>

            <tr>
              <td>5</td>
              <td>Doris Greene</td>
              <td>Malawi</td>
              <td>Feldkirchen in Kärnten</td>
              <td class="text-right">
                $63,542
              </td>
            </tr>

            <tr>
              <td>6</td>
              <td>Mason Porter</td>
              <td>Chile</td>
              <td>Gloucester</td>
              <td class="text-right">
                $78,615
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card-text>
    </base-material-card>

    <div class="py-3" />
  </v-container>
</template>
<script>
  import { productsActions } from '@/store/actions.type'

  export default {
    name: 'ProductsListing',

    data () {
      return {
        loaded: false,
        isMounted: true,
        isFetching: false,
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

    mounted () {
      this.fetchData({
        isMounted: true,
      }).then(() => {
        this.loaded = true
      })
    },

    methods: {
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
        })
        this.isFetching = false
        if (!options || !options.isMounted) {
          this.isMounted = false
        }
      },
    },
  }
</script>
