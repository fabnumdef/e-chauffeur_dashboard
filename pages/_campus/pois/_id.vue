<template>
  <div>
    <nuxt-child :poi="poi" />
  </div>
</template>

<script>

export default {
  async asyncData({
    app, params, $api, store: { getters },
  }) {
    if (!app.$auth.isRegulator()) {
      throw new Error('Vous n\'avez pas les droits pour récupérer les informations d\'un lieu.');
    }
    return {
      poi: (await $api.pois(getters['context/campus'], 'id,label,location(coordinates),campus,enabled')
        .getPoi(params.id)).data,
    };
  },
};
</script>
