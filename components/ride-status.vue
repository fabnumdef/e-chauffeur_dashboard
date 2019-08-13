<template>
  <div
    class="ride-status"
    :class="`ride-status-${badgeClass}`"
  >
    {{ badgeTitle }}
  </div>
</template>

<script>
import {
  DELIVERED, IN_PROGRESS, WAITING, STARTED, ACCEPTED, VALIDATED,
} from '@fabnumdef/e-chauffeur_lib-vue/api/status/states';

export default {
  props: {
    ride: {
      type: Object,
      default: () => ({}),
    },
    isAvailable: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    badgeTitle() {
      if (!this.ride) {
        return 'Disponible';
      }
      if (!this.isAvailable) {
        return 'Pas en service';
      }
      switch (this.ride.status) {
        case VALIDATED:
        case ACCEPTED:
          return 'Planifié';
        case STARTED:
          return 'En route';
        case WAITING:
          return 'En attente';
        case IN_PROGRESS:
          return 'En route';
        case DELIVERED:
        default:
          return 'Disponible';
      }
    },

    badgeClass() {
      if (!this.ride) {
        return 'available';
      }
      if (!this.isAvailable) {
        return 'unavailable';
      }
      switch (this.ride.status) {
        case WAITING:
          return 'waiting';
        case STARTED:
        case IN_PROGRESS:
          return 'driving';
        case ACCEPTED:
          return 'accepted';
        case VALIDATED:
          return 'planned';
        case DELIVERED:
        default:
          return 'available';
      }
    },
  },
};
</script>
<style scoped lang="scss">
  @import "~assets/css/head";

  .ride-status {
    padding: 0 5px;
    width: 100%;
    font-weight: bold;
    display: inline-block;
    text-transform: uppercase;
    &-available {
      background: $success;
      color: findColorInvert($success);
    }
    &-unavailable {
      background: $gray;
      color: findColorInvert($gray);
    }
    &-planned {
      background: repeating-linear-gradient(45deg, rgba(195, 195, 195, 0.85), rgba(195, 195, 195, 0.85) 1px,
        #8192A9 1px, #8192A9 20px);
      color: findColorInvert($dark-gray);
    }
    &-accepted {
      background: #8192A9;
      color: findColorInvert($primary);
    }
    &-driving {
      background: $primary;
      color: findColorInvert($primary);
    }
    &-waiting{
      background: $warning;
      color: findColorInvert($warning);
    }
  }
</style>
