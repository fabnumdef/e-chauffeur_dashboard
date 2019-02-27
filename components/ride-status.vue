<template>
  <div class="ride-status" :class="badgeClass">
    {{ badgeTitle }}
  </div>
</template>

<script>
import {
  DELIVERED, IN_PROGRESS, WAITING, STARTED, ACCEPTED, VALIDATED, DONE,
} from '~/api/status';

export default {
  props: {
    ride: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    badgeTitle() {
      if (!this.ride) {
        return 'Disponible';
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
          return 'Retour';
        case DONE:
        default:
          return 'Disponible';
      }
    },

    badgeClass() {
      if (!this.ride) {
        return 'ride-status-available';
      }
      switch (this.ride.status) {
        case STARTED:
        case WAITING:
          return 'ride-status-going';
        case IN_PROGRESS:
        case DELIVERED:
          return 'ride-status-coming';
        case ACCEPTED:
        case DONE:
        default:
          return 'ride-status-available';
      }
    },
  },
};
</script>
<style scoped lang="scss">
  @import "~assets/css/head";

  .ride-status {
    padding: 5px;
    width: 100%;
    font-weight: bold;
    display: inline-block;
    text-transform: uppercase;
    &-available {
      background: $success;
      color: findColorInvert($success);
    }
    &-planned {
      background: $dark-gray;
      color: findColorInvert($dark-gray);
    }
    &-going {
      background: $warning;
      color: findColorInvert($warning);
    }
    &-coming {
      background: $primary;
      color: findColorInvert($primary);
    }
  }
</style>
