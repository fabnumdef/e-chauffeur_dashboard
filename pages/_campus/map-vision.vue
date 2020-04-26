<template>
  <main>
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
          input-class="input"
          format="YYYY-MM-DD HH:mm:ss"
          :clearable="false"
        >
          <template slot="icon-calendar">
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
import driverPositions from '~/components/map-driver-positions.vue';
import titleMixin from '~/helpers/mixins/page-title';


export default {
  watchQuery: ['date'],
  mixins: [
    titleMixin('Map vision'),
  ],
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
    const { data: positions } = await $api.query('logs')
      .setMask('driver(id,name,firstname,lastname),date,position(coordinates)')
      .listDriversPositions(date.toJSDate())
      .setFilter('campus', campus);
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
    .options {
      padding: 0 10px 10px;
      float: right;
    }
  }
</style>
