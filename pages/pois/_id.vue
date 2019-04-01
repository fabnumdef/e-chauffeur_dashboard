<template>
  <div>
    <nuxt-child :poi="poi" />
  </div>
</template>

<script>

export default {
  async asyncData({ params, $api }) {
    return {
      poi: (await $api.pois(null, 'id,label,location(coordinates),campus').getPoi(params.id)).data,
    };
  },
};
</script>
