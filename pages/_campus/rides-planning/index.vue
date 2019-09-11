<template>
  <main>
    <div class="level">
      <div class="level-left">
        <div class="level-item">
          <h1 class="title">
            Supervision des courses
          </h1>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <button
            class="button is-primary"
            @click="mapToggle"
          >
            <span v-if="hideMap">Montrer la carte</span>
            <span v-else>Cacher la carte</span>
          </button>
        </div>
      </div>
    </div>
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
import { DateTime } from 'luxon';
import RideCalendar from '~/components/ride-calendar';

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
      hideMap: 'context/hideMap',
    }),
  },

  async asyncData({ params, $api, store }) {
    const today = new Date();
    const start = DateTime.local().startOf('days').toJSDate();
    const end = DateTime.local().endOf('days').toJSDate();
    const ridesApi = $api.rides(params.campus, EDITABLE_FIELDS);
    const { data: drivers } = await ridesApi.getAvailableDrivers(
      'id,name,availabilities(start,end)',
      start,
      end,
    );
    drivers.splice(0, 0, { name: 'Requêtes utilisateur', id: null, availabilities: [] });
    const { data: rides } = await ridesApi.getRides(start, end);
    store.commit('realtime/setRides', rides);
    return {
      campus: params.campus,
      drivers,
      today,
    };
  },

  methods: {
    mapToggle() {
      this.$store.dispatch('context/hideMap', !this.hideMap);
    },
  },
};
</script>

<style scoped lang="scss">
  @import "~assets/css/head";
  @import "~bulma/sass/components/level.sass";
</style>
