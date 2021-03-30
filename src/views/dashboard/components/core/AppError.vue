<template>
  <div
    v-if="error"
    class="flash-error"
    :class="{
      'flash-error__no-margin': noMargin,
    }"
  >
    <div class="flash-error-candle" />
    <div class="flash-error-content">
      <button
        v-if="!hiddenClose"
        type="button"
        class="flash-close"
        @click="close"
      >
        <svg
          class="octicon octicon-x"
          viewBox="0 0 12 16"
          version="1.1"
          width="12"
          height="16"
          aria-hidden="true"
        ><path
          fill-rule="evenodd"
          d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"
        /></svg>
      </button>
      <div class="flash-error-title">
        Alert
      </div>
      <div class="flash-error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
  import { mapMutations } from 'vuex'

  export default {
    name: 'AppError',

    props: {
      error: {
        type: String,
        default: '',
      },
      modul: {
        type: String,
        default: '',
      },
      noMargin: {
        type: Boolean,
        default: false,
      },
      hasShadow: {
        type: Boolean,
        default: false,
      },
      hiddenClose: {
        type: Boolean,
        default: false,
      },
    },

    methods: {
      ...mapMutations({
        resetMessage: 'RESET_MESSAGE',
      }),

      close () {
        this.resetMessage(this.modul)
        this.$emit('onClose', true)
      },
    },

  }
</script>

<style lang="scss" scoped>
  .flash-error {
    z-index: 8;
    font-size: 13px;
    color: #86181d;
    display: flex;
    flex-direction: row;
    margin: 0 auto 30px;
    border-radius: 5px;
    // border: 1px solid rgba(27,31,35,.15);
    background-color: #ffffff;
    box-shadow: 0px 2px 10px 0px rgba(17, 17, 17, 0.08);
    &__no-margin {
      margin: 0px auto !important;
    }
  }

  .flash-error .flash-error-candle {
    width: 7px;
    min-height: 100%;
    margin-right: 13px;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    background-color: #dd3d42;
  }

  .flash-error .flash-error-content {
    position: relative;
    padding: 15px 20px;
    width: 100%;
  }

  .flash-error .flash-error-title {
    color: #dd3d42;
    font-size: 15px;
    font-weight: 600;
    line-height: 25px;
  }

  .flash-error .flash-error-message {
    color: #666666;
    font-size: 12px;
    font-weight: 300;
  }

  .flash-error .container-lg {
    color: #86181d;
    margin-right: auto;
    margin-left: auto;
  }

  .flash-error .px-2 {
    padding-right: 8px!important;
    padding-left: 8px!important;
  }

  .flash-error .flash-close {
    cursor: pointer;
    color: inherit;
    fill: #999999;
    height: 40px;
    position: absolute;
    top: 0px;
    right: 0px;
    padding: 13px;
    background: none;
    border: 0;
  }
</style>
