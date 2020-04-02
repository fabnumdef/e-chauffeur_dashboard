<template>
  <main
    class="planificator"
    :class="{'planificator-max-width': !hideMap}"
  >
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
      :rides="flavoredRides"
      :current-campus="currentCampus"
      :campus="campus"
      @view-change="viewChange"
    />
  </main>
</template>

<script>
import { mapGetters } from 'vuex';
import { DateTime } from 'luxon';
import {
  DRAFTED,
} from '@fabnumdef/e-chauffeur_lib-vue/api/status/states';
import RideCalendar from '~/components/planificator/index.vue';

const EDITABLE_FIELDS = [
  'id',
  'start',
  'end',
  'departure(id,label)',
  'arrival(id,label)',
  'car(id,label,model(id,label))',
  'driver(id,name,firstname,lastname)',
  'owner(id)',
  'phone',
  'status',
  'userComments',
  'comments',
  'passengersCount',
  'category(id,label)',
  'luggage',
].join(',');

export default {
  components: {
    RideCalendar,
  },

  async asyncData({ params, $api }) {
    const start = DateTime.local().startOf('days').toJSDate();
    const end = DateTime.local().endOf('days').toJSDate();
    const ridesApi = $api.rides(params.campus, EDITABLE_FIELDS);
    const { data: drivers } = await ridesApi.getAvailableDrivers(
      'id,name,availabilities(start,end),firstname,lastname',
      start,
      end,
    );
    drivers.splice(0, 0, { name: 'Requêtes utilisateur', id: null, availabilities: [] });
    return {
      campus: params.campus,
      drivers,
    };
  },

  computed: {
    ...mapGetters({
      rides: 'realtime/rides',
      currentCampus: 'context/campus',
      hideMap: 'context/hideMap',
    }),
    flavoredRides() {
      return this.rides.filter(({ status }) => status !== DRAFTED);
    },
  },

  methods: {
    mapToggle() {
      this.$store.dispatch('context/hideMap', !this.hideMap);
    },
    async viewChange(obj) {
      const start = DateTime.fromJSDate(obj.startDate).startOf('days').toJSDate();
      const end = DateTime.fromJSDate(obj.endDate).endOf('days').toJSDate();
      const ridesApi = this.$api.rides(this.campus, EDITABLE_FIELDS);
      const { data: drivers } = await ridesApi.getAvailableDrivers(
        'id,name,availabilities(start,end),firstname,lastname',
        start,
        end,
      );
      drivers.splice(0, 0, { name: 'Requêtes utilisateur', id: null, availabilities: [] });
      await this.$store.dispatch('realtime/setRides', {
        campus: this.campus, start, end, persist: true,
      });
      this.drivers = drivers;
    },
  },
};
</script>

<style scoped lang="scss">
  @import "~assets/css/head";
  @import "~bulma/sass/components/level.sass";

  @media screen and (min-width: 768px) {
    .planificator {
      max-width: calc(100% - 240px);
    }
    .planificator-max-width {
      max-width: 50%;
    }
  }
</style>
