<template>
  <div>
    <nuxt-child :poi="poi" />
  </div>
</template>

<script>

export default {
  async asyncData({ params, $api }) {
    return {
      poi: (await $api.pois.getPoi(params.id, 'id,label,location(coordinates)')).data,
    };
  },
};
</script>
