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
              input-class="input"
              type="datetime"
              range
              :value="range"
              :minute-step="5"
              format="YYYY-MM-DD HH:mm"
              range-separator="->"
              @input="updateDates"
            >
              <template slot="icon-calendar">
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
        <over-time-tile
          :data="stats[REQUESTABLE.period]"
          :time-unit="request.timeUnit"
          :time-scope="request.timeScope"
          @input="changeTimeConfig"
        />
        <ratings-tile
          :ratings="{
            ux: stats[REQUESTABLE.uxGrade],
            recommendation: stats[REQUESTABLE.recommendationGrade]
          }"
        />
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
import overTimeTile from '~/components/dashboard/over-time.vue';
import statusesTile from '~/components/dashboard/statuses.vue';
import ratingsTile from '~/components/dashboard/ratings.vue';
import REQUESTABLE from '~/helpers/requestable';

export default {
  components: {
    categoriesTile,
    carModelsTile,
    driversTile,
    bulmaTile,
    hasPhoneTile,
    statusesTile,
    overTimeTile,
    ratingsTile,

  },
  watchQuery: ['before', 'after', 'time-scope', 'time-unit'],
  async asyncData({ $api, query, params }) {
    const start = (query.after ? DateTime.fromISO(query.after) : DateTime.local().startOf('weeks')).toJSDate();
    const end = (query.before ? DateTime.fromISO(query.before) : DateTime.local().endOf('weeks')).toJSDate();
    const timeScope = (query['time-scope'] ? query['time-scope'] : 'week');
    const timeUnit = (query['time-unit'] ? query['time-unit'] : 'day');
    const { data: stats } = await $api.query('rides')
      .setCampus(params.campus)
      .setMask([
        REQUESTABLE.total, REQUESTABLE.categories, REQUESTABLE.carModels,
        REQUESTABLE.hasPhone,
        REQUESTABLE.statuses,
        `${REQUESTABLE.poisDeparture}(id,departure(location(coordinates),label),total)`,
        `${REQUESTABLE.poisArrival}(id,arrival(location(coordinates),label),total)`,
        `${REQUESTABLE.drivers}(id,driver(name,firstname,lastname),total)`,
        REQUESTABLE.period, REQUESTABLE.uxGrade, REQUESTABLE.recommendationGrade,
      ])
      .stats(start, end, { timeScope, timeUnit });

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

      this.$router.push({ path: 'dashboard', query: { ...query } });
    },
  },
};
</script>

<style lang="scss" scoped>
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
  .field {
    width: 50%;
    /deep/ label {
      color: $white;
    }
  }
</style>
