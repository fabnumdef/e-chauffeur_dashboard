<template>
  <main>
    <h1 class="title">
      Supervision des courses
    </h1>
    <ride-calendar
      :drivers="drivers"
      :rides="rides"
      :current-campus="currentCampus"
      :campus="campus"
    />
  </main>
</template>

<script>
import { mapGetters } from 'vuex';
import RideCalendar from '~/components/ride-calendar';
import { DateTime } from 'luxon';

const EDITABLE_FIELDS = [
  'id',
  'start',
  'end',
  'departure(id,label)',
  'arrival(id,label)',
  'car(id,label,model(id,label))',
  'driver(id,name)',
  'phone',
  'status',
  'comments',
  'passengersCount',
  'category(id,label)',
  'luggage',
].join(',');

export default {
  components: {
    RideCalendar,
  },

  computed: {
    ...mapGetters({
      rides: 'realtime/rides',
      currentCampus: 'context/campus',
    }),
  },

  async asyncData({ params, $api, store }) {
    const today = new Date();
    const start = DateTime.local().startOf('days').toJSDate();
    const end = DateTime.local().endOf('days').toJSDate();
    const ridesApi = $api.rides(params.campus, EDITABLE_FIELDS);
    const { data: drivers } = await ridesApi.getAvailableDrivers(
      'id,name,availabilities(s,e)',
      start,
      end,
    );
    const { data: rides } = await ridesApi.getRides(start, end);
    store.commit('realtime/setRides', rides);
    return {
      campus: params.campus,
      drivers,
      today,
    };
  },
};
</script>

<style scoped lang="scss">

</style>
