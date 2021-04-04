<template>
  <div class="cards__container-wrapper">
    <div
      v-if="!!headerTitle"
      class="cards__header"
    >
      {{ headerTitle }}
    </div>

    <div
      class="cards__main-layout"
      :class="{
        'cards__auto-height': autoHeight
      }"
    >
      <div class="cards__coins-container">
        <slot name="coins-content" />
      </div>

      <div
        class="cards__container"
        :class="containerClass"
      >
        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'AppContainer',

    props: {
      headerTitle: {
        type: String,
        default: '',
      },
      autoHeight: {
        type: Boolean,
        default: false,
      },
      containerClass: {
        type: String,
        default: '',
      },
    },

    data () {
      return {

      }
    },

    mounted () {

    },

    methods: {

    },
  }
</script>

<style lang="scss" scoped>
</style>
