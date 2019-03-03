<template>
  <header>
    <ride-status :ride="ride" />
    <p>{{ driver.name }}</p>
    <template v-if="ride && ride.car">
      <p v-if="ride.car.model">
        <strong>{{ride.car.model.label}}</strong>
      </p>
      <p>
        {{ride.car.id}}
      </p>
    </template>
  </header>
</template>

<script>
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
};
</script>
<style scoped lang="scss">
  @import "~assets/css/head";

  header {
    padding: 5px;
  }
</style>
