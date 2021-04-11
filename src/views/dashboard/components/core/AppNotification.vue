<template>
  <div>
    <v-snackbar
      v-model="showNotification"
      :timeout="notification.timeout || defaultTimeout"
      :color="notification.type"
      multi-line
      bottom
      right
    >
      {{ notification.msg }}
      <v-btn
        color="black"
        icon
        @click="showNotification = false"
      >
        <v-icon size="20">
          mdi-close
        </v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { commonActions } from '@/store/actions.type'

  export default {
    data () {
      return {
        defaultTimeout: 3000,
      }
    },

    computed: {
      ...mapState({
        notification: state => state.common.notification,
      }),

      showNotification: {
        get () {
          return this.$store.state.common.showNotification
        },
        set (val) {
          this.setNotification(val)
        },
      },
    },

    methods: {
      ...mapActions({
        setNotification: commonActions.SET_SHOW_NOTIFICATION,
      }),
    },
  }
</script>
