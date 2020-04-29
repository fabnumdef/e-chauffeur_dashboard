<template>
  <nuxt-child :campus="campus" />
</template>

<script>
import { mapGetters } from 'vuex';
import { DateTime } from 'luxon';

export default {
  layout: ({ route: { name } }) => {
    switch (name) {
      case 'campus-rides':
      case 'campus-planificator':
        return 'with-map';
      case 'campus-map':
        return 'simple';
      default:
        return 'default';
    }
  },
  async asyncData({ params, store }) {
    if (!store.getters['context/isCampus'](params.campus)) {
      await store.dispatch('context/fetchCampus', params.campus);
      const start = DateTime.local().startOf('days').toJSDate();
      const end = DateTime.local()
        .plus({ seconds: store.getters['context/campus'].defaultReservationScope })
        .toJSDate();
      await store.dispatch('realtime/setRides', { campus: params.campus, start, end });
    }
    return {};
  },
  computed: {
    ...mapGetters('context', ['campus']),
  },
};
</script>
