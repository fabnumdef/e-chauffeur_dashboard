<template>
  <nuxt-child />
</template>
<script>
export default {
  async asyncData({ params, store }) {
    if (!store.getters['context/isCampus'](params.campus)) {
      await store.dispatch('context/fetchCampus', params.campus);
    }
    return {};
  },
};
</script>
