<template>
  <nuxt-child :campus="campus" />
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  layout: ({ route: { name } }) => {
    let layout = 'default';
    if (name === 'campus-rides' || name === 'campus-rides-planning') {
      layout = 'with-map';
    } else if (name === 'campus-map') {
      layout = 'simple';
    }
    return layout;
  },
  computed: {
    ...mapGetters('context', ['campus']),
  },
  async asyncData({ params, store }) {
    if (!store.getters['context/isCampus'](params.campus)) {
      await store.dispatch('context/fetchCampus', params.campus);
    }
    return {};
  },
};
</script>
