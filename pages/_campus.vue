<template>
  <nuxt-child />
</template>
<script>
export default {
  layout: ({ route: { name } }) => {
    let layout = 'default';
    if (name === 'campus-rides') {
      layout = 'with-map';
    } else if (name === 'campus-map') {
      layout = 'simple';
    }
    return layout;
  },
  async asyncData({ params, store }) {
    if (!store.getters['context/isCampus'](params.campus)) {
      await store.dispatch('context/fetchCampus', params.campus);
    }
    return {};
  },
};
</script>
