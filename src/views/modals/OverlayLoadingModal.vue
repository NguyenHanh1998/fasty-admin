<template>
  <v-overlay
    :value="show"
    z-index="6"
  >
    <font-awesome-icon
      icon="spinner"
      class="fa-spin gk__loading"
    />
  </v-overlay>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'OverlayLoadingModal',

    computed: {
      ...mapState({
        show: state => state.common.showOverlayLoading,
      }),
    },
  }
</script>
