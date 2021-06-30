<template>
  <v-app-bar
    id="app-bar"
    absolute
    app
    color="transparent"
    flat
    height="75"
  >
    <v-btn
      class="mr-3"
      elevation="1"
      fab
      small
      @click="setDrawer(!drawer)"
    >
      <v-icon v-if="value">
        mdi-view-quilt
      </v-icon>

      <v-icon v-else>
        mdi-dots-vertical
      </v-icon>
    </v-btn>

    <v-toolbar-title
      class="hidden-sm-and-down font-weight-light"
      v-text="$route.name"
    />

    <v-spacer />

    <button
      type="button"
      class="ft__appbar-profile"
    >
      {{ user.email }}
    </button>

    <div class="ft__appbar__menu-dropdown-wrap dropdown">
      <a
        id="dropdownMenu"
        href="javascript:void(0)"
        role="button"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <img
          src="/images/logo_small.png"
          alt="Genesis Kingdom"
          class="ft__appbar-logo ml-4 mr-5"
        >
      </a>

      <!-- <div
        class="ft__appbar__menu-dropdown dropdown-menu dropdown-menu-right mt-6"
        aria-labelledby="dropdownMenu"
      > -->
      <!-- <a
          class="ft__appbar__menu-item dropdown-item d-flex"
          href="javascript:void(0)"
          @click="setShowChangePasswordModal(true)"
        >
          <font-awesome-icon
            class="ft__appbar__menu-icon"
            icon="user-circle"
          />
          Change Password
        </a> -->
      <!-- <a
          class="ft__appbar__menu-item dropdown-item d-flex"
          href="/logout"
        >
          <font-awesome-icon
            class="ft__appbar__menu-icon"
            icon="sign-out-alt"
          />
          Logout
        </a> -->
      <!-- </div> -->
    </div>
  </v-app-bar>
</template>

<script>
  // Utilities
  import { mapState, mapMutations } from 'vuex'

  import { getUser } from '@/services/user-service'

  export default {
    name: 'DashboardCoreAppBar',

    components: {
    },

    props: {
      value: {
        type: Boolean,
        default: false,
      },
    },

    data: () => ({
      user: {
        email: '',
      },
    }),

    computed: {
      ...mapState(['drawer']),
    },

    mounted () {
      this.user = getUser()
    },

    methods: {
      ...mapMutations({
        setDrawer: 'SET_DRAWER',
      }),
    },
  }
</script>
