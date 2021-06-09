<template>
  <v-dialog
    v-model="ethererumConnectionAlert.show"
    width="450"
    persistent
  >
    <v-card
      min-height="200"
      class="md__cards"
    >
      <v-card-title class="lighten-2">
        <h4 class="font-weight-bold primary--text">
          MetaMask Connection Alert!
        </h4>
      </v-card-title>

      <v-card-text class="pt-3">
        <v-row>
          <v-col
            class="text-center"
            lg="12"
            cols="12"
          >
            <div class="md__sub-title">
              <span
                class="primary--text"
                v-html="ethererumConnectionAlert.msg"
              />
            </div>
          </v-col>
        </v-row>

        <v-row v-if="isMetaMaskNotInstalled()">
          <v-col
            lg="12"
            cols="12"
            class="justify-center"
          >
            <div class="md__button">
              <button
                class="gk__btn-submit gk__btn-large"
                @click="openMetamaskLink"
              >
                Download MetaMask
              </button>
            </div>
          </v-col>
        </v-row>

        <!-- <v-row v-if="isMetaMaskNotInstalled()">
          <v-col
            class="text-center"
            lg="12"
            cols="12"
          >
            <div class="md__sub-title">
              <span class="primary--text">
                If you already have Metamask installed, press to continue
              </span>
            </div>
          </v-col>
        </v-row> -->

        <!-- <v-row v-if="isMetaMaskNotInstalled()">
          <v-col
            lg="12"
            cols="12"
            class="justify-center"
          >
            <div class="md__button">
              <button
                class="gk__btn-submit"
                @click="reload"
              >
                {{ $t('meta_mask_alert.btn_reload') }}
              </button>
            </div>
          </v-col>
        </v-row> -->
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import { commonActions } from '@/store/actions.type'
  import { Web3Error } from '@/constants'

  export default {
    name: 'ProviderNotAvailableModal',

    computed: {
      ...mapState({
        ethererumConnectionAlert: state => state.common.ethererumConnectionAlert,
      }),
    },

    methods: {
      ...mapActions({
        setAlert: commonActions.SET_ETHERERUM_CONNECTION_ALERT,
      }),
      isMetaMaskNotInstalled () {
        return Web3Error.META_MASK_NOT_INSTALLED === this.ethererumConnectionAlert.alertType
      },
      reload () {
        window.location.reload()
      },
      openMetamaskLink () {
        window.open('https://metamask.io/download.html', '_blank')
      },
    },
  }
</script>
