<template>
  <div>
    <nuxt-child :car-model="carModel" />
  </div>
</template>

<script>

export default {
  async asyncData({ app, params, $api }) {
    if (!app.$auth.hasRight('canGetCarModel')) {
      throw new Error('Vous d\'avez pas les droits pour récupérer les informations d\'un modèle de véhicule.');
    }
    return {
      carModel: (await $api.carModels.getCarModel(params.id, 'id,label')).data,
    };
  },
};
</script>
