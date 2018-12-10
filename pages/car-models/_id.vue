<template>
  <div>
    <nuxt-child :car-model="carModel" />
  </div>
</template>

<script>

export default {
  async asyncData({ params, $api }) {
    return {
      carModel: (await $api.carModels.getCarModel(params.id, 'id,label')).data,
    };
  },
};
</script>
