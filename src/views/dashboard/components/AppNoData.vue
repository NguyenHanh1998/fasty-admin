<template>
  <div class="cards__no-data">
    <img
      class="cards__no-data__img"
      src="/images/icons/empty_result.png"
    >
    <div
      v-if="text"
      class="cards__no-data__title-head"
    >
      {{ text }}
    </div>
    <div
      v-if="!text"
      class="cards__no-data__title-head"
    >
      {{ $t('widget.no_data.lbl_title') }}
    </div>
    <div
      v-if="!text"
      class="cards__no-data__sub-title"
    >
      {{ $t('widget.no_data.lbl_sub_title') }}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'AppNoData',

    props: {
      text: {
        type: String,
        default: '',
      },
    },

  }
</script>

<style lang="scss">

</style>
