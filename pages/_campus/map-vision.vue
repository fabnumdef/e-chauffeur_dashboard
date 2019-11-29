<template>
  <main>
    <header class="with-options">
      <h1 class="title">
        Map vision
      </h1>
      <div class="options">
        <div class="box">
          <button
            class="button is-primary"
            @click="decrementSecs(10)"
          >
            - 10 secondes
          </button>
          <client-only>
            <date-time
              v-model="currentTime"
              lang="fr"
              type="datetime"
              append-to-body
              input-class="input"
              format="YYYY-MM-DD HH:mm:ss"
              :clearable="false"
              :first-day-of-week="1"
            >
              <template slot="calendar-icon">
                <fa-icon icon="calendar-alt" />
              </template>
            </date-time>
          </client-only>
          <button
            class="button is-primary"
            @click="incrementSecs(10)"
          >
            + 10 secondes
          </button>
        </div>
      </div>
    </header>
    <div class="box">
      <driver-positions
        :positions="positions"
        :campus="campus"
      />
    </div>
  </main>
</template>

<script>
import { DateTime } from 'luxon';
import driverPositions from '~/components/map-driver-positions';

export default {
  watchQuery: ['date'],
  components: {
    driverPositions,
  },
  props: {
    campus: {
      type: Object,
      default: null,
    },
  },
  async asyncData({ $api, query, params: { campus } }) {
    const date = query.date ? DateTime.fromISO(query.date) : DateTime.local();
    const { data: positions } = await $api.logs()
      .getDriversPositionsHistory(
        date.toJSDate(),
        'driver(id,name,firstname,lastname),date,position(coordinates)',
        campus,
      );
    return {
      currentTime: date.toJSDate(),
      positions,
    };
  },
  computed: {
    luxonDate: {
      get() {
        return DateTime.fromJSDate(this.currentTime);
      },
      set(val) {
        this.currentTime = val.toJSDate();
      },
    },
  },
  watch: {
    currentTime() {
      this.$router.push(this.campusLink('map-vision', { query: { date: this.currentTime.toISOString() } }));
    },
  },
  methods: {
    incrementSecs(seconds) {
      this.luxonDate = this.luxonDate.plus({ seconds });
    },
    decrementSecs(seconds) {
      this.luxonDate = this.luxonDate.minus({ seconds });
    },
  },
};
</script>
<style lang="scss" scoped>
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
</style>
