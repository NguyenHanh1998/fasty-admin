<template>
  <div>Logout...</div>
</template>

<script>
  import store from '@/store'
  import { authActions } from '@/store/actions.type'

  export default {
    name: 'Logout',

    beforeRouteEnter (to, from, next) {
      Promise.all([
        store.dispatch(authActions.LOGOUT),
      ])
    },

    methods: {},
  }
</script>

<style lang="scss" scoped>
</style>
