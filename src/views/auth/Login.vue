<template>
  <v-app class="ft__v-app">
    <div class="ft__container">
      <div class="ft__auth ft__auth-wrapper">
        <div class="ft__auth-col ft__auth-col-1">
          <div class="ft__auth-col-1__logo-box">
            <img
              src="images/icons/group-3.png"
              alt="Genesis Kingdom"
              class="ft__auth-col-1-background"
            >
            <img
              src="images/icons/logo.png"
              alt="Genesis Kingdom"
              class="ft__auth-logo"
            >
          </div>
          <div class="ft__auth-col-1-text">
            Copy Right
          </div>
        </div>

        <div class="ft__auth-col ft__auth-col-2">
          <div class="ft__form ft__auth-form">
            <form>
              <div class="ft__auth-head-logo">
                <img
                  class="ft__logo-small"
                  src="images/icons/logo-small.png"
                  alt="Genesis Kingdom"
                >
              </div>
              <div class="ft__auth-title">
                Login
              </div>
              <div class="ft__auth-title ft__auth-welcome">
                Welcome to Fasty
              </div>

              <app-error
                v-if="errorMessage"
                :error="errorMessage"
                modul="auth"
              />

              <div class="form-group">
                <div
                  class="form-input ft__auth-input-box"
                  :class="{ 'invalid': submitted && $v.email.$error }"
                >
                  <img
                    src="/images/icons/mail.png"
                    class="ft__auth-input-icon"
                  >
                  <input
                    id="email"
                    v-model.trim="email"
                    name="email"
                    type="text"
                    class="cards__input ft__auth-input"
                    placeholder="Your email"
                    @keypress.enter="handleLogin"
                  >
                </div>
                <div
                  v-if="submitted && $v.email.$error"
                  class="form-error"
                >
                  <small
                    v-if="!$v.email.required"
                    class="text-error"
                  >The email field is required.</small>
                  <small
                    v-if="!$v.email.email"
                    class="text-error"
                  >The email field is invalid.</small>
                </div>
              </div>

              <div class="form-group">
                <div
                  class="form-input ft__auth-input-box"
                  :class="{ 'invalid': submitted && $v.password.$error }"
                >
                  <img
                    src="/images/icons/key.png"
                    class="ft__auth-input-icon"
                  >
                  <input
                    id="password"
                    v-model="password"
                    name="password"
                    type="password"
                    class="cards__input ft__auth-input"
                    autocomplete="off"
                    placeholder="Your password"
                    @keypress.enter="handleLogin"
                  >
                </div>
                <div
                  v-if="submitted && $v.password.$error"
                  class="form-error"
                >
                  <small
                    v-if="!$v.password.required"
                    class="text-error"
                  >The password field is required.</small>
                </div>
              </div>

              <!-- <div class="ft__auth-remember">
                <p-check
                  class="p-svg p-curve"
                  color="primary"
                >
                  svg path
                  <svg
                    slot="extra"
                    class="svg svg-icon"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z"
                      style="stroke: white;fill:white"
                    />
                  </svg>
                  Remember me
                </p-check>
              </div> -->

              <div
                class="form-group form-submit"
                justify="center"
              >
                <button
                  type="button"
                  class="ft__btn-submit ft__btn-radius-10 ft__btn-login"
                  @click="handleLogin"
                >
                  <!-- <div v-if="requesting">
                    <font-awesome-icon
                      icon="spinner"
                      class="fa-spin"
                    />
                  </div> -->
                  <!-- {{ !requesting ? $t('login.btn_login') : '' }} -->
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </v-app>
</template>
<script>
  import { mapActions, mapMutations, mapState } from 'vuex'
  import { required, email } from 'vuelidate/lib/validators'
  import { authActions } from '@/store/actions.type'
  import ErrorHandler from '@/services/error-handler'

  let notifyTimeout
  export default {
    name: 'Login',

    components: {
      AppError: () => import('@/views/dashboard/components/core/AppError'),
    },

    data () {
      return {
        email: '',
        password: '',
        requesting: false,
        submitted: false,
      }
    },

    validations: {
      email: { required, email },
      password: { required },
    },

    computed: {
      ...mapState({
        errorMessage: state => ErrorHandler.getMessage(null, state.auth.errorMsg),
      }),
    },

    mounted () {
    },

    methods: {
      ...mapActions({
        login: authActions.LOGIN,
      }),
      ...mapMutations({
        resetMessage: 'RESET_MESSAGE',
      }),

      async handleLogin () {
        this.submitted = true
        this.$v.$touch()
        if (this.$v.$invalid) {
          return
        }

        this.requesting = true
        try {
          await this.login({
            email: this.email,
            password: this.password,
            isAdmin: true,
          })
          this.$router.push('/')
        } catch (err) {
          this._resetForm()
        }
      },

      _resetForm () {
        this.password = ''
        this.submitted = false
        this.requesting = false

        if (notifyTimeout) {
          clearTimeout(notifyTimeout)
        }
        notifyTimeout = setTimeout(() => {
          this.resetMessage('auth')
        }, 5000)
      },
    },
  }
</script>
