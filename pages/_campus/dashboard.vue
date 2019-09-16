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
              Dont <strong>{{stats[REQUESTABLE.carModels].length}}</strong> type(s) de véhicule(s)
            </li>
            <li v-if="stats[REQUESTABLE.drivers] && stats[REQUESTABLE.drivers].length">
              Dont <strong>{{stats[REQUESTABLE.drivers].length}}</strong> chauffeur(s) différent(s)
            </li>
          </ul>
        </bulma-tile>
      </bulma-tile>
        <bulma-tile
          v-if="stats.categories && stats.categories.length"
          parent
        >
          <bulma-tile
            class="box"
          >
            <header class="title">
              <div class="is-pulled-right">
                <button
                  class="button is-text"
                  :class="{'is-active': isText(REQUESTABLE.categories)}"
                  @click="switchToText(REQUESTABLE.categories)"
                >
                  <fa-icon icon="list" />
                </button>
                <button
                  class="button is-text"
                  :class="{'is-active': isPieChart(REQUESTABLE.categories)}"
                  @click="switchToPieChart(REQUESTABLE.categories)"
                >
                  <fa-icon icon="chart-pie" />
                </button>
              </div>
              Catégories les plus demandées
            </header>
            <div
              v-if="isText(REQUESTABLE.categories)"
              class="content is-large"
            >
              <ol>
                <li
                  v-for="{total, category, id} of stats.categories.slice(0, 3)"
                  :key="id"
                >
                  {{ category ? category.label : 'NC' }} (<strong>{{ total }}</strong> course(s))
                </li>
              </ol>
            </div>
            <div
              v-if="isPieChart(REQUESTABLE.categories)"
              class="content is-large"
            >
              <pie-chart :chart-data="transformCategoriesData(stats.categories)" />
            </div>
          </bulma-tile>
        </bulma-tile>
      <bulma-tile parent>
        <bulma-tile
          v-if="stats[REQUESTABLE.carModels] && stats[REQUESTABLE.carModels].length"
          class="box"
        >
          <header class="title">
            <div class="is-pulled-right">
              <button
                class="button is-text"
                :class="{'is-active': isText(REQUESTABLE.carModels)}"
                @click="switchToText(REQUESTABLE.carModels)"
              >
                <fa-icon icon="list" />
              </button>
              <button
                class="button is-text"
                :class="{'is-active': isPieChart(REQUESTABLE.carModels)}"
                @click="switchToPieChart(REQUESTABLE.carModels)"
              >
                <fa-icon icon="chart-pie" />
              </button>
            </div>
            Catégories de véhicules les plus utilisés
          </header>
          <div
            v-if="isText(REQUESTABLE.carModels)"
            class="content is-large"
          >
            <ol>
              <li
                v-for="{total, model, id} of stats[REQUESTABLE.carModels].slice(0, 3)"
                :key="id"
              >
                {{ model ? model.label : 'NC' }} (<strong>{{ total }}</strong> course(s))
              </li>
            </ol>
          </div>
          <div
            v-if="isPieChart(REQUESTABLE.carModels)"
            class="content is-large"
          >
            <pie-chart :chart-data="transformCarModelsData(stats[REQUESTABLE.carModels])" />
          </div>
        </bulma-tile>
      </bulma-tile>
    </bulma-tile>
    <bulma-tile ancestor>
      <bulma-tile parent>
        <bulma-tile
          v-if="stats[REQUESTABLE.drivers] && stats[REQUESTABLE.drivers].length"
          class="box"
        >
          <header class="title">
            <div class="is-pulled-right">
              <button
                class="button is-text"
                :class="{'is-active': isText(REQUESTABLE.drivers)}"
                @click="switchToText(REQUESTABLE.drivers)"
              >
                <fa-icon icon="list" />
              </button>
              <button
                class="button is-text"
                :class="{'is-active': isPieChart(REQUESTABLE.drivers)}"
                @click="switchToPieChart(REQUESTABLE.drivers)"
              >
                <fa-icon icon="chart-pie" />
              </button>
            </div>
            Chauffeurs les plus solicités
          </header>
          <div
            v-if="isText(REQUESTABLE.drivers)"
            class="content is-large"
          >
            <ol>
              <li
                v-for="{total, driver, id} of stats[REQUESTABLE.drivers].slice(0, 3)"
                :key="id"
              >
                {{ driver ? (driver.name || `${driver.firstname} ${driver.lastname}`) : 'NC' }} (<strong>{{ total }}</strong> course(s))
              </li>
            </ol>
          </div>
          <div
            v-if="isPieChart(REQUESTABLE.drivers)"
            class="content is-large"
          >
            <pie-chart :chart-data="transformDriversData(stats[REQUESTABLE.drivers])" />
          </div>
        </bulma-tile>
      </bulma-tile>
      <bulma-tile parent>
        <bulma-tile
          v-if="stats[REQUESTABLE.poisArrival] && stats[REQUESTABLE.poisArrival].length"
          class="box"
        >
          <header class="title">
            <div class="is-pulled-right">
              <button
                class="button is-text"
                :class="{'is-active': isText(REQUESTABLE.poisArrival)}"
                @click="switchToText(REQUESTABLE.poisArrival)"
              >
                <fa-icon icon="list" />
              </button>
              <button
                class="button is-text"
                :class="{'is-active': isPieChart(REQUESTABLE.poisArrival)}"
                @click="switchToPieChart(REQUESTABLE.poisArrival)"
              >
                <fa-icon icon="chart-pie" />
              </button>
            </div>
            Lieux d'arrivée les plus utilisés
          </header>
          <div
            v-if="isText(REQUESTABLE.poisArrival)"
            class="content is-large"
          >
            <ol>
              <li
                v-for="{total, arrival, id} of stats[REQUESTABLE.poisArrival].slice(0, 3)"
                :key="id"
              >
                {{ arrival ? arrival.label : 'NC' }} (<strong>{{ total }}</strong> course(s))
              </li>
            </ol>
          </div>
          <div
            v-if="isPieChart(REQUESTABLE.poisArrival)"
            class="content is-large"
          >
            <pie-chart :chart-data="transformPoisArrivalData(stats[REQUESTABLE.poisArrival])" />
          </div>
        </bulma-tile>
      </bulma-tile>
      <bulma-tile parent>
        <bulma-tile
          v-if="stats[REQUESTABLE.poisDeparture] && stats[REQUESTABLE.poisDeparture].length"
          class="box"
        >
          <header class="title">
            <div class="is-pulled-right">
              <button
                class="button is-text"
                :class="{'is-active': isText(REQUESTABLE.poisDeparture)}"
                @click="switchToText(REQUESTABLE.poisDeparture)"
              >
                <fa-icon icon="list" />
              </button>
              <button
                class="button is-text"
                :class="{'is-active': isPieChart(REQUESTABLE.poisDeparture)}"
                @click="switchToPieChart(REQUESTABLE.poisDeparture)"
              >
                <fa-icon icon="chart-pie" />
              </button>
            </div>
            Lieux de départ les plus utilisés
          </header>
          <div
            v-if="isText(REQUESTABLE.poisDeparture)"
            class="content is-large"
          >
            <ol>
              <li
                v-for="{total, departure, id} of stats[REQUESTABLE.poisDeparture].slice(0, 3)"
                :key="id"
              >
                {{ departure ? departure.label : 'NC' }} (<strong>{{ total }}</strong> course(s))
              </li>
            </ol>
          </div>
          <div
            v-if="isPieChart(REQUESTABLE.poisDeparture)"
            class="content is-large"
          >
            <pie-chart :chart-data="transformPoisDepartureData(stats[REQUESTABLE.poisDeparture])" />
          </div>
        </bulma-tile>
      </bulma-tile>
    </bulma-tile>
  </main>
</template>

<script>
import { DateTime } from 'luxon';
import bulmaTile from '~/components/tile.vue';
import pieChart from '~/components/charts/pie';

const TEXT = 'txt';
const PIE = 'pie';

const REQUESTABLE = {
  total: 'total',
  poisArrival: 'pois-arrival',
  poisDeparture: 'pois-departure',
  categories: 'categories',
  carModels: 'car-models',
  statuses: 'statuses',
  drivers: 'drivers',
};

export default {
  watchQuery: ['before', 'after'],
  components: {
    bulmaTile,
    pieChart,
  },
  computed: {
    range() {
      return [
        this.request.start || null,
        this.request.end || null,
      ].map((l) => (l && l.toJSDate ? l.toJSDate() : l));
    },
    backgroundColors() {
      return {
        backgroundColor: [
          'rgba(65, 184, 131, .8)',
          'rgba(228, 102, 81, .8)',
          'rgba(0, 216, 255, .8)',
          'rgba(155, 89, 182, .8)',
        ],
      };
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
      switches: {
        [REQUESTABLE.categories]: TEXT,
        [REQUESTABLE.carModels]: TEXT,
        [REQUESTABLE.poisArrival]: TEXT,
        [REQUESTABLE.poisDeparture]: TEXT,
        [REQUESTABLE.drivers]: TEXT,
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
    switchToPieChart(d) {
      this.switches[d] = PIE;
    },
    switchToText(d) {
      this.switches[d] = TEXT;
    },
    isPieChart(d) {
      return this.switches[d] === PIE;
    },
    isText(d) {
      return this.switches[d] === TEXT;
    },
    transformCategoriesData(categories) {
      return {
        labels: categories.map(({ category }) => (category ? category.label : 'NC')),
        datasets: [{ ...this.backgroundColors, data: categories.map(({ total }) => total) }],
      };
    },
    transformCarModelsData(models) {
      return {
        labels: models.map(({ model }) => (model ? model.label : 'NC')),
        datasets: [{ ...this.backgroundColors, data: models.map(({ total }) => total) }],
      };
    },
    transformPoisArrivalData(pois) {
      return {
        labels: pois.map(({ arrival }) => (arrival ? arrival.label : 'NC')),
        datasets: [{ ...this.backgroundColors, data: pois.map(({ total }) => total) }],
      };
    },
    transformPoisDepartureData(pois) {
      return {
        labels: pois.map(({ departure }) => (departure ? departure.label : 'NC')),
        datasets: [{ ...this.backgroundColors, data: pois.map(({ total }) => total) }],
      };
    },
    transformDriversData(drivers) {
      return {
        labels: drivers.map(({ driver }) => (driver ? (driver.name || `${driver.firstname} ${driver.lastname}`) : 'NC')),
        datasets: [{ ...this.backgroundColors, data: drivers.map(({ total }) => total) }],
      };
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
