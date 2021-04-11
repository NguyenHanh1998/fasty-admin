<template>
  <v-content class="ft__view">
    <app-card>
      <template
        v-slot:content
      >
        <router-view />

        <!-- common widget -->
        <app-notification />
        <overlay-loading-modal />
      </template>
    </app-card>
  </v-content>
</template>

<script>
  export default {
    name: 'DashboardCoreView',

    components: {
      AppCard: () => import('@/views/dashboard/components/AppCard'),
      AppNotification: () => import('./AppNotification'),
      OverlayLoadingModal: () => import('@/views/modals/OverlayLoadingModal'),
    },
  }
</script>
