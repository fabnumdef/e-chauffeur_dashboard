<template>
  <div>
    <nuxt-child :car="car"/>
  </div>
</template>

<script>

export default {
  async asyncData({ params, $api }) {
    return {
      car: (await $api.cars.getCar(params.id, 'id,email')).data,
    };
  },
};
</script>
