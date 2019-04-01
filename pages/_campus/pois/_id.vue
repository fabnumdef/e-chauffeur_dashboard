<template>
  <div>
    <nuxt-child :poi="poi" />
  </div>
</template>

<script>

export default {
  async asyncData({ params, $api, store: { getters } }) {
    return {
      poi: (await $api.pois(getters['context/campus'], 'id,label,location(coordinates),campus').getPoi(params.id)).data,
    };
  },
};
</script>
