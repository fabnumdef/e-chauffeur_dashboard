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
            class="button"
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
      :displacements="flavoredDisplacements"
      @view-change="viewChange"
    />
  </main>
</template>

<script>
import { mapGetters } from 'vuex';
import { DateTime } from 'luxon';
import { DRAFTED } from '@fabnumdef/e-chauffeur_lib-vue/api/status/states';
import RideCalendar from '~/components/planificator/index.vue';

const DRIVER_MASK = 'id,name,availabilities(start,end),firstname,lastname,licences';
export default {
  components: {
    RideCalendar,
  },

  async asyncData({ params, $api }) {
    const start = DateTime.local().startOf('days').toJSDate();
    const end = DateTime.local().endOf('days').toJSDate();
    const { data: drivers } = await $api.query('rides')
      .setMask(DRIVER_MASK)
      .setCampus(params.campus)
      .availableDrivers(start, end);
    drivers.splice(0, 0, { name: 'Requêtes utilisateur', id: null, availabilities: [] });

    return {
      drivers,
    };
  },
  computed: {
    ...mapGetters({
      hideMap: 'context/hideMap',
      campus: 'context/campus',
      displacements: 'realtime/displacements',
    }),
    flavoredDisplacements() {
      return this.displacements.filter(({ status }) => status !== DRAFTED);
    },
  },
  methods: {
    mapToggle() {
      this.$store.dispatch('context/hideMap', !this.hideMap);
    },
    async viewChange(obj) {
      const start = DateTime.fromJSDate(obj.startDate).startOf('days').toJSDate();
      const end = DateTime.fromJSDate(obj.endDate).endOf('days').toJSDate();
      const { data: drivers } = await this.$api.query('rides')
        .setCampus(this.campus.id)
        .setMask(DRIVER_MASK)
        .availableDrivers(start, end);
      drivers.splice(0, 0, { name: 'Requêtes utilisateur', id: null, availabilities: [] });
      await this.$store.dispatch('realtime/appendDisplacements', { campus: this.campus.id, start, end });
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
