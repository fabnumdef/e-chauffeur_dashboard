<template>
  <nuxt-child />
</template>
<script>
export default {
  layout: ({ route: { name } }) => (name === 'campus-rides' ? 'with-map' : 'default'),
  async asyncData({ params, store }) {
    if (!store.getters['context/isCampus'](params.campus)) {
      await store.dispatch('context/fetchCampus', params.campus);
    }
    return {};
  },
};
</script>
