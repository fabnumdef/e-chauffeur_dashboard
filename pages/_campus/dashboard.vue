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
              :first-day-of-week="1"
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
      <bulma-tile vertical>
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
        <categories-tile :categories="stats[REQUESTABLE.categories]" />
        <car-models-tile :models="stats[REQUESTABLE.carModels]" />
        <drivers-tile :drivers="stats[REQUESTABLE.drivers]" />
      </bulma-tile>
      <bulma-tile vertical>
        <has-phone-tile :data="stats[REQUESTABLE.hasPhone]" />
        <statuses-tile :statuses="stats[REQUESTABLE.statuses]" />
      </bulma-tile>
      <bulma-tile vertical>
        <pois-tile
          :pois="stats[REQUESTABLE.poisDeparture]"
          title="Lieux de départ les plus utilisés"
          sub-key="departure"
          :map-center="campus.location.coordinates"
        />
        <pois-tile
          :pois="stats[REQUESTABLE.poisArrival]"
          title="Lieux d'arrivée les plus utilisés"
          sub-key="arrival"
          :map-center="campus.location.coordinates"
        />
        <over-time-tile
          :data="stats[REQUESTABLE.period]"
          :time-unit="request.timeUnit"
          :time-scope="request.timeScope"
          @input="changeTimeConfig"
        />
      </bulma-tile>
    </bulma-tile>
  </main>
</template>

<script>
import { DateTime } from 'luxon';
import bulmaTile from '~/components/tile';
import carModelsTile from '~/components/dashboard/car-models';
import categoriesTile from '~/components/dashboard/categories';
import driversTile from '~/components/dashboard/drivers';
import hasPhoneTile from '~/components/dashboard/has-phone';
import overTimeTile from '~/components/dashboard/over-time';
import poisTile from '~/components/dashboard/pois';
import statusesTile from '~/components/dashboard/statuses';

const REQUESTABLE = {
  total: 'total',
  poisArrival: 'pois-arrival',
  poisDeparture: 'pois-departure',
  categories: 'categories',
  carModels: 'car-models',
  statuses: 'statuses',
  drivers: 'drivers',
  hasPhone: 'has-phone',
  period: 'period',
};

export default {
  components: {
    categoriesTile,
    carModelsTile,
    driversTile,
    bulmaTile,
    poisTile,
    hasPhoneTile,
    statusesTile,
    overTimeTile,
  },
  props: {
    campus: {
      type: Object,
      default: null,
    },
  },
  watchQuery: ['before', 'after', 'time-scope', 'time-unit'],
  async asyncData({ $api, params, query }) {
    const start = (query.after ? DateTime.fromISO(query.after) : DateTime.local().startOf('weeks')).toJSDate();
    const end = (query.before ? DateTime.fromISO(query.before) : DateTime.local().endOf('weeks')).toJSDate();
    const timeScope = (query['time-scope'] ? query['time-scope'] : 'week');
    const timeUnit = (query['time-unit'] ? query['time-unit'] : 'day');
    const { data: stats } = await $api.rides(params.campus).getStats(
      {
        timeScope,
        timeUnit,
        mask: [
          REQUESTABLE.total, REQUESTABLE.categories, REQUESTABLE.carModels,
          REQUESTABLE.hasPhone,
          REQUESTABLE.statuses,
          `${REQUESTABLE.poisDeparture}(id,departure(location(coordinates),label),total)`,
          `${REQUESTABLE.poisArrival}(id,arrival(location(coordinates),label),total)`,
          `${REQUESTABLE.drivers}(id,driver(name,firstname,lastname),total)`,
          REQUESTABLE.period,
        ].join(','),
      },
      start,
      end,
    );
    return {
      stats,
      request: {
        start,
        end,
        timeScope,
        timeUnit,
      },
    };
  },
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
    'request.timeScope': function watchRequestTimeScope() {
      this.updateRoute();
    },
    'request.timeUnit': function watchRequestTimeUnit() {
      this.updateRoute();
    },
  },
  methods: {
    updateDates([start, end]) {
      this.request.start = start;
      this.request.end = end;
    },
    changeTimeConfig({ timeScope, timeUnit } = {}) {
      this.request.timeScope = timeScope;
      this.request.timeUnit = timeUnit;
    },
    updateRoute() {
      const query = {
        before: this.request.end.toISOString(),
        after: this.request.start.toISOString(),
        'time-scope': this.request.timeScope,
        'time-unit': this.request.timeUnit,
      };
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
