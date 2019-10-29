<template>
  <nuxt-child :campus="campus" />
</template>

<script>
import { mapGetters } from 'vuex';
import { DateTime } from 'luxon';

export default {
  layout: ({ route: { name } }) => {
    let layout = 'default';
    if (name === 'campus-rides' || name === 'campus-planificator') {
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
      const start = DateTime.local().startOf('days').toJSDate();
      const end = DateTime.local().endOf('days').toJSDate();
      await store.dispatch('context/fetchCampus', params.campus);
      await store.dispatch('realtime/setRides', { campus: params.campus, start, end });
    }
    return {};
  },
};
</script>
