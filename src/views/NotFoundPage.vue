<template>
  <v-app class="ft__v-app">
    <div class="ft__container">
      <div class="ft__auth ft__auth-wrapper">
        <div class="ft__auth-col ft__auth-col-1">
          <div class="ft__auth-col-1__logo-box">
            <img
              src="images/icons/group-3.png"
              alt="Fasty"
              class="ft__auth-col-1-background"
            >
            <img
              src="images/icons/logo.png"
              alt="Fasty"
              class="ft__auth-logo"
            >
          </div>
          <div class="ft__auth-col-1-text">
            Copy right
          </div>
        </div>

        <div class="ft__auth-col ft__auth-col-2">
          <div class="ft__form ft__auth-form">
            <h1 class="page404__error-title">
              404 Page Not Found
            </h1>
            <p class="page404__error-note">
              You will be redirected to the homepage in 5 seconds
            </p>
          </div>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        seconds: 5,
      }
    },

    mounted () {
      const interval = setInterval(() => {
        this.seconds--

        if (this.seconds === 0) {
          clearInterval(interval)
          window.location.href = '/'
        }
      }, 1000)
    },
  }
</script>

<style lang="scss" scoped>
.page404 {
  &__error-title {
    color: #9c282b;
  }
  &__error-note {
    color: #333333;
  }
}
</style>
