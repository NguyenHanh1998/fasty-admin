<template>
  <div>
    <v-dialog
      v-model="show"
      width="850"
      :retain-focus="false"
    >
      <div class="cards__main-layout">
        <div class="cards__container">
          <v-row>
            <v-col
              cols="12"
              class="text-center"
            >
              <div class="cpm__head-title">
                Create New Product
              </div>

              <!-- <img
                src="/images/icons/logo.png"
                class="cpm__head-logo"
              > -->
            </v-col>
          </v-row>

          <div class="ft__form mb-0">
            <form>
              <div class="form-group mb-2">
                <label
                  class="cards__label"
                  for="name"
                >
                  Product Name
                </label>
                <div class="cpm__input-item">
                  <img
                    src="/images/icons/icon-info.png"
                    class="ft__auth-input-icon"
                  >
                  <input
                    id="txt-product-name"
                    v-model.trim="product.name"
                    name="txt-product-name"
                    class="cards__input cpm__input"
                    :class="{
                      'invalid': submitted && $v.product.name.$error
                    }"
                    autocomplete="off"
                    type="text"
                    placeholder="Product Name"
                  >
                </div>
                <div
                  class="form-error mb-2"
                >
                  <small
                    v-if="submitted && !$v.product.name.required"
                    class="text-error"
                  >Product name is required</small>
                </div>
              </div>

              <div class="form-group mb-2">
                <label
                  class="cards__label"
                  for="description"
                >
                  Description
                </label>
                <div class="cpm__input-item">
                  <img
                    src="/images/icons/key.png"
                    class="ft__auth-input-icon"
                  >
                  <textarea
                    id="txt-description"
                    v-model="product.description"
                    name="txt-description"
                    type="text"
                    class="cards__textarea cpm__textarea"
                    :class="{
                      'invalid': submitted && $v.product.description.$error
                    }"
                    autocomplete="off"
                    placeholder="Description"
                  />
                </div>
                <div
                  class="form-error mb-2"
                >
                  <small
                    v-if="submitted && !$v.product.description.required"
                    class="text-error"
                  >Description is required!</small>
                </div>
              </div>

              <div class="form-group mb-2">
                <label
                  class="cards__label"
                  for="type"
                >
                  Type
                </label>
                <div class="cpm__input-item">
                  <img
                    src="/images/icons/key.png"
                    class="ft__auth-input-icon"
                  >

                  <v-select
                    id="txt-type"
                    v-model="product.type"
                    name="txt-type"
                    class="cards__select"
                    :items="ProductTypes"
                    auto
                    attach
                  />
                </div>
              </div>

              <div class="form-group mb-2">
                <label
                  class="cards__label"
                  for="gender"
                >
                  Gender
                </label>
                <div class="cpm__input-item">
                  <img
                    src="/images/icons/key.png"
                    class="ft__auth-input-icon"
                  >

                  <v-select
                    id="txt-gender"
                    v-model="product.gender"
                    name="gender"
                    class="cards__select"
                    :items="Gender"
                    auto
                    attach
                  />
                </div>
              </div>

              <div class="form-group mb-2">
                <label
                  class="cards__label"
                  for="image"
                >
                  Image
                </label>
                <div class="cpm__input-item">
                  <input
                    id="txt-product-image"
                    ref="file"
                    name="txt-product-image"
                    type="file"
                    @change="handleFileUpload()"
                  >
                </div>
                <div
                  v-if="fileName !== ''"
                  class="cpm__image"
                >
                  <img
                    :src="VUE_APP_API_URL + fileName"
                    alt="product image"
                    style="width: 200px"
                  >
                </div>
              </div>

              <!-- <div
                class="form-group mb-2"
              >
                <label
                  class="cards__label"
                  for="offer-currency"
                >
                  Choose default currency you want to offer.
                </label>
                <v-select
                  id="paid-currency-select"
                  v-model="product.currency"
                  name="paid-currency-select"
                  :items="Coins"
                  class="cards__select"
                  auto
                  attach
                />
              </div> -->

              <!-- <div class="form-group mb-2">
                <label
                  class="cards__label"
                  for="price"
                >
                  Offer Price(Wei)
                </label>
                <div class="cpm__input-item">
                  <img
                    src="/images/icons/key.png"
                    class="ft__auth-input-icon"
                  >

                  <input
                    id="txt-product-price"
                    v-model="product.price"
                    name="txt-product-price"
                    class="cards__input cpm__input"
                    :class="{
                      'invalid': submitted && $v.product.price.$error
                    }"
                    autocomplete="off"
                    type="number"
                    placeholder="Offer Price"
                  >
                </div>
              </div> -->

              <div class="form-group form-submit cpm__button-group">
                <button
                  type="button"
                  class="ft__btn-submit ft__exit-btn ft__btn-white ft__btn-radius-10 cpm__btn-half-width mr-2 "
                  @click="setShowCreateProductModal(false)"
                >
                  Exit
                </button>
                <button
                  type="button"
                  class="ft__btn-submit ft__btn-radius-10 cpm__btn-half-width ml-2"
                  :disabled="requesting"
                  @click="handleOnApply()"
                >
                  <div v-if="requesting">
                    <font-awesome-icon
                      icon="spinner"
                      class="fa-spin"
                    />
                  </div>
                  {{ !requesting ? 'Apply' : '' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
  import { mapActions, mapMutations, mapState } from 'vuex'
  import { commonActions, productsActions } from '@/store/actions.type'
  import {
    ProductTypes,
    Gender,
    Coins,
    NotificationType,
  } from '../../constants'
  import ErrorHandler from '@/services/error-handler'
  export default {
    name: 'CreateNewProductModal',

    data () {
      return {
        // input
        product: {
          name: '',
          description: '',
          type: '',
          gender: '',
          currency: 'eth',
          price: '0.0',
        },
        submitted: false,
        requesting: false,
        ProductTypes,
        Gender,
        Coins,
        file: '',
        VUE_APP_API_URL: process.env.VUE_APP_API_URL,
      }
    },

    computed: {
      ...mapState({
        errorMsg: (state) => state.products.errorMsg,
        fileName: (state) => state.common.fileName,
      }),
      show: {
        get () {
          return this.$store.state.common.showCreateProductModal
        },
        set (value) {
          this.setShowCreateProductModal(value)
        },
      },
    },

    watch: {
      show: function (val) {
        if (!val) {
          console.log(',,,,')
        }
      },
    },

    methods: {
      ...mapMutations({
        resetMessage: 'RESET_MESSAGE',
      }),
      ...mapActions({
        setShowCreateProductModal: commonActions.SET_SHOW_CREATE_PRODUCT_MODAL,
        setUploadFile: commonActions.UPLOAD_FILE,
        createNewProduct: productsActions.CREATE_NEW_PRODUCT,
        setNotification: commonActions.SET_NOTIFICATION,
      }),

      handleFileUpload () {
        this.requesting = true

        const data = new FormData()
        data.append('file', this.$refs.file.files[0])

        this.setUploadFile(data)
        this.requesting = false
      },

      handleOnApply () {
        this.requesting = true
        this.product.image = this.fileName

        this.createNewProduct(this.product)
          .then(_ => {
            this.handleNotification(NotificationType.SUCCESS)
          })
          .catch(_ => {
            this.handleNotification(NotificationType.ERROR)
          })
      },

      handleNotification (type) {
        let message
        if (type === NotificationType.SUCCESS) {
          message = ErrorHandler.getMessage('Create new product successfully', null)
        } else {
          message = ErrorHandler.getMessage(null, this.errorMsg)
        }
        this.setNotification({
          type,
          msg: message,
        })
        // should refactor later
        setTimeout(() => {
          this.requesting = false
          if (type === NotificationType.SUCCESS) {
            this.setShowCreateProductModal(false)
          }
        }, 1000)
        setTimeout(() => {
          this.resetMessage('auth')
        }, 5000)
      },
    },
  }
</script>
