<template>
  <main>
    <header class="with-options">
      <h1 class="title">
        Tableau de bord
      </h1>
      <div class="options">
        <div class="box">
          <client-only>
            <date-time
              lang="fr"
              append-to-body
              input-class="input"
              type="datetime"
              range
              :value="range"
              :minute-step="5"
              format="YYYY-MM-DD HH:mm"
              range-separator="->"
              @input="updateDates"
            >
              <template slot="calendar-icon">
                <fa-icon icon="calendar-alt" />
              </template>
            </date-time>
          </client-only>
        </div>
      </div>
    </header>
    <bulma-tile ancestor>
      <bulma-tile parent>
        <bulma-tile class="box">
          <header class="title">
            Total de courses
          </header>
          <ul class="content is-large">
            <li><strong>{{ stats.total }}</strong> course(s)</li>
            <li v-if="stats[REQUESTABLE.carModels] && stats[REQUESTABLE.carModels].length">
              Dont <strong>{{ stats[REQUESTABLE.carModels].length }}</strong> type(s) de véhicule(s)
            </li>
            <li v-if="stats[REQUESTABLE.drivers] && stats[REQUESTABLE.drivers].length">
              Dont <strong>{{ stats[REQUESTABLE.drivers].length }}</strong> chauffeur(s) différent(s)
            </li>
          </ul>
        </bulma-tile>
      </bulma-tile>
      <bulma-tile
        parent
      >
        <categories-tile :categories="stats[REQUESTABLE.categories]" />
      </bulma-tile>
      <bulma-tile parent>
        <car-models-tile :models="stats[REQUESTABLE.carModels]" />
      </bulma-tile>
    </bulma-tile>
    <bulma-tile ancestor>
      <bulma-tile parent>
        <drivers-tile :drivers="stats[REQUESTABLE.drivers]" />
      </bulma-tile>
      <bulma-tile parent>
        <pois-tile
          :pois="stats[REQUESTABLE.poisDeparture]"
          title="Lieux de départ les plus utilisés"
          sub-key="departure"
          :map-center="campus.location.coordinates"
        />
      </bulma-tile>
      <bulma-tile parent>
        <pois-tile
          :pois="stats[REQUESTABLE.poisArrival]"
          title="Lieux d'arrivée les plus utilisés"
          sub-key="arrival"
          :map-center="campus.location.coordinates"
        />
      </bulma-tile>
    </bulma-tile>
    <bulma-tile ancestor>
      <bulma-tile parent>
        <has-phone-tile :data="stats[REQUESTABLE.hasPhone]" />
      </bulma-tile>
    </bulma-tile>
  </main>
</template>

<script>
import { DateTime } from 'luxon';
import bulmaTile from '~/components/tile.vue';
import carModelsTile from '~/components/dashboard/car-models.vue';
import categoriesTile from '~/components/dashboard/categories.vue';
import driversTile from '~/components/dashboard/drivers.vue';
import hasPhoneTile from '~/components/dashboard/has-phone.vue';
import poisTile from '~/components/dashboard/pois.vue';

const REQUESTABLE = {
  total: 'total',
  poisArrival: 'pois-arrival',
  poisDeparture: 'pois-departure',
  categories: 'categories',
  carModels: 'car-models',
  statuses: 'statuses',
  drivers: 'drivers',
  hasPhone: 'has-phone',
};

export default {
  components: {
    categoriesTile,
    carModelsTile,
    driversTile,
    bulmaTile,
    poisTile,
    hasPhoneTile,
  },
  props: {
    campus: {
      type: Object,
      default: null,
    },
  },
  watchQuery: ['before', 'after'],
  computed: {
    range() {
      return [
        this.request.start || null,
        this.request.end || null,
      ].map((l) => (l && l.toJSDate ? l.toJSDate() : l));
    },
    REQUESTABLE() {
      return REQUESTABLE;
    },
  },
  watch: {
    'request.start': function watchRequestStart() {
      this.updateRoute();
    },
    'request.end': function watchRequestEnd() {
      this.updateRoute();
    },
  },
  async asyncData({ $api, params, query }) {
    const start = (query.after ? DateTime.fromISO(query.after) : DateTime.local().startOf('weeks')).toJSDate();
    const end = (query.before ? DateTime.fromISO(query.before) : DateTime.local().endOf('weeks')).toJSDate();
    const { data: stats } = await $api.rides(params.campus).getStats(
      [
        REQUESTABLE.total, REQUESTABLE.categories, REQUESTABLE.carModels,
        REQUESTABLE.hasPhone,
        `${REQUESTABLE.poisDeparture}(id,departure(location(coordinates),label),total)`,
        `${REQUESTABLE.poisArrival}(id,arrival(location(coordinates),label),total)`,
        `${REQUESTABLE.drivers}(id,driver(name,firstname,lastname),total)`,
      ].join(','),
      start,
      end,
    );
    return {
      stats,
      request: {
        start,
        end,
      },
    };
  },
  methods: {
    updateDates([start, end]) {
      this.request.start = start;
      this.request.end = end;
    },
    updateRoute() {
      const query = { before: this.request.end.toISOString(), after: this.request.start.toISOString() };
      this.$router.push(this.campusLink('dashboard', { query }));
    },
  },
};
</script>

<style scoped lang="scss">
  @import "~assets/css/head";
  $box-padding: 1.25rem !default
  .with-options {
    display: flex;
    .title {
      flex-grow: 1;
    }
    .options {
      padding: 0 10px 10px;
      float: right;
    }
  }
  /deep/ .box {
    .title {
      background: $light-gray;
      padding: $box-padding;
      color: findColorInvert($light-gray);
      font-size: $size-large;
      margin: -$box-padding;
      button.is-active, button:hover {
        color: $white;
      }
    }
    .content {
      margin-top: $box-padding * 2;
    }
  }
</style>
