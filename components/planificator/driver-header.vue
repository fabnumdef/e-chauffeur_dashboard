<template>
  <div
    v-if="driver.name !== 'Requêtes utilisateur'"
    class="driver-header"
  >
    <div class="driver">
      <div class="name">
        {{ driver.name }}
        <div :class="isConnected ? 'badge badge-active' : 'badge'" />
      </div>
      <div v-if="ride && ride.car">
        <p v-if="ride.car.model">
          <strong>{{ ride.car.model.label }}</strong>
        </p>
        <p>
          {{ ride.car.id }}
        </p>
      </div>
    </div>
    <ride-status
      class="ride-status"
      :ride="ride"
      :is-available="isAvailable"
    />
  </div>
  <div
    v-else
    class="first-col-header"
  >
    <div>Courses non attribuées</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { DateTime, Interval } from 'luxon';
import rideStatus from '~/components/ride-status.vue';

export default {
  components: {
    rideStatus,
  },
  props: {
    driver: {
      type: Object,
      default: () => ({}),
    },
    ride: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapGetters({ connectedDrivers: 'realtime/connectedDrivers' }),
    isConnected() {
      return this.connectedDrivers.reduce((acc, driverId) => acc || (driverId === this.driver.id), false);
    },
    isAvailable() {
      return this.driver.availabilities.some((avail) => {
        if (typeof avail.s === 'string') {
          // eslint-disable-next-line no-param-reassign
          avail = Interval.fromDateTimes(DateTime.fromISO(avail.s), DateTime.fromISO(avail.e));
        }
        return avail.contains && avail.contains(DateTime.local());
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "~assets/css/head";

  .driver-header {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: left;
    border-right: 1px solid black;
    height: 100%;
    .name {
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .badge {
      border-radius: 100%;
      height: 10px;
      width: 10px;
      background-color: $red;
      &-active {
        background-color: $green;
      }
    }
    .driver {
      padding: 0 5px;
    }
  }

  .first-col-header {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 100%;
    font-weight: bold;
    color: $red;
    text-transform: uppercase;
  }
</style>
