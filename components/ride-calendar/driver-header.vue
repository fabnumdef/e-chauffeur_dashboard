<template>
  <div class="driver-header">
    <div class="driver">
      <span class="name">{{ driver.name }}</span>
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
</template>

<script>
import { DateTime } from 'luxon';
import rideStatus from '~/components/ride-status.vue';

export default {
  components: {
    rideStatus,
  },
  props: {
    driver: {
      type: Object,
      default: () => {},
    },
    ride: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    isAvailable() {
      let res = false;
      this.driver.availabilities.forEach((avail) => {
        if (avail.contains(DateTime.local())) {
          res = true;
        }
      });
      return res;
    },
  },
};
</script>

<style lang="scss" scoped>
  .driver-header {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: left;
    border-right: 1px solid black;
    height: 100%;
    .name {
      font-weight: bold;
    }
    .driver {
      padding: 0 5px;
    }
  }
</style>
