<template>
  <div>
    <nuxt-child :car="car"/>
  </div>
</template>

<script>
const EDITABLE_FIELDS = ['id', 'label', 'model'];

export default {
  async asyncData({ params, $api, store: { getters } }) {
    return {
      car: (await $api.cars(getters['context/campus'], EDITABLE_FIELDS.join(',')).getCar(params.id)).data,
    };
  },
};
</script>
