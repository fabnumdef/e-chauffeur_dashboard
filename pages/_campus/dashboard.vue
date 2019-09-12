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
          <div class="content is-large">
            <strong>{{ stats.total }}</strong> course(s)
          </div>
        </bulma-tile>
        <bulma-tile
          v-if="stats.categories && stats.categories.length"
          class="box"
        >
          <header class="title">
            <div class="is-pulled-right">
              <button
                class="button is-text"
                :class="{'is-active': isText('categories')}"
                @click="switchToText('categories')"
              >
                <fa-icon icon="list" />
              </button>
              <button
                class="button is-text"
                :class="{'is-active': isPieChart('categories')}"
                @click="switchToPieChart('categories')"
              >
                <fa-icon icon="chart-pie" />
              </button>
            </div>
            Catégories les plus demandées
          </header>
          <div
            v-if="isText('categories')"
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
            v-if="isPieChart('categories')"
            class="content is-large"
          >
            <pie-chart :chart-data="transformCategoriesData(stats.categories)" />
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
          'rgba(155, 89, 182, .8)'
        ],
      };
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
    const { data: stats } = await $api.rides(params.campus).getStats('total,categories', start, end);
    return {
      stats,
      request: {
        start,
        end,
      },
      switches: {
        categories: TEXT,
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
