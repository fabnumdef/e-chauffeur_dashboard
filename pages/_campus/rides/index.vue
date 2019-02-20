<template>
  <main>
    <h1 class="title">
      Supervision des courses
    </h1>
    <div class="box today">
      <date-time
        v-model="today"
        lang="fr"
        append-to-body
        input-class="input"
        format="YYYY-MM-DD"
      >
        <template slot="calendar-icon">
          <fa-icon icon="calendar-alt" />
        </template>
      </date-time>
    </div>
    <vue-calendar
      :events="rides"
      with-current-time
      :schedule-with="drivers"
      :current-date="today"
      @modal-submit="edit(ride)"
      @dates-update="updateDates"
    >
      <template slot="title">
        Nouvelle course
      </template>
      <template
        slot="modal"
        class="white-background"
      >
        <ec-field
          v-if="ride.driver && ride.driver.name"
          label="Chauffeur"
          field-id="driver"
        >
          {{ ride.driver.name }}
        </ec-field>

        <ec-field
          label="Type de course"
          field-id="departure"
        >
          <search-category v-model="ride.category" />
        </ec-field>

        <ec-field
          label="Dates"
          field-id="dates"
        >
          <date-time
            lang="fr"
            append-to-body
            input-class="input"
            type="datetime"
            range
            :value="range"
            :minute-step="5"
            format="YYYY-MM-DD HH:mm:ss"
            range-separator="->"
            @input="updateDates"
          >
            <template slot="calendar-icon">
              <fa-icon icon="calendar" />
            </template>
          </date-time>
        </ec-field>

        <ec-field
          label="Departure"
          field-id="departure"
        >
          <search-poi v-model="ride.departure" />
        </ec-field>

        <ec-field
          label="Arrival"
          field-id="arrival"
        >
          <search-poi v-model="ride.arrival" />
        </ec-field>

        <ec-field
          label="Available cars"
          field-id="car"
        >
          <search-available-car
            v-model="ride.car"
            :start="ride.start"
            :end="ride.end"
            :campus="campus"
          />
        </ec-field>

        <ec-field
          label="Phone number"
          field-id="phone"
        >
          <input
            id="phone"
            v-model="ride.phone"
            class="input"
          >
        </ec-field>

        <ec-field
          label="Passengers"
          field-id="passengers-count"
        >
          <div class="select">
            <select
              id="passengers-count"
              v-model="ride.passengersCount"
            >
              <option
                v-for="i in 8"
                :key="i"
                :value="i"
              >
                {{ i }}
              </option>
            </select>
          </div>
        </ec-field>

        <ec-field
          label="Comments"
          field-id="comments"
        >
          <textarea
            id="comments"
            v-model="ride.comments"
            class="textarea"
          />
        </ec-field>
      </template>
    </vue-calendar>
  </main>
</template>

<script>
import vueCalendar from '~/components/calendar.vue';
import ecField from '~/components/form/field.vue';
import { DateTime } from 'luxon';
import searchPoi from '~/components/form/search-poi';
import searchCategory from '~/components/form/search-campus-category';
import searchAvailableCar from '~/components/form/search-available-car';

const EDITABLE_FIELDS = [
  'start',
  'end',
  'departure(id,label)',
  'arrival(id,label)',
  'car(id,label)',
  'driver(id,name)',
  'phone',
  'comments',
  'passengersCount',
  'category(id,label)',
].join(',');

export function generateEmptyRide() {
  return {
    start: null,
    end: null,
    phone: null,
    departure: null,
    arrival: null,
    driver: null,
    passengersCount: 0,
  };
}

export default {
  components: {
    searchPoi,
    vueCalendar,
    ecField,
    searchAvailableCar,
    searchCategory,
  },
  computed: {
    range() {
      return [
        this.ride.start || null,
        this.ride.end || null,
      ].map(l => (l && l.toJSDate ? l.toJSDate() : null));
    },
  },

  watch: {
    async today(v) {
      const today = DateTime.fromJSDate(v);
      const start = today.startOf('days').toJSDate();
      const end = today.endOf('days').toJSDate();
      const ridesApi = this.$api.rides(this.campus, EDITABLE_FIELDS);
      // todo: Should be able to trigger queries in the same time.
      const { data: drivers } = await ridesApi.getAvailableDrivers(
        'id,name,availabilities(s,e)',
        start,
        end,
      );
      const { data: rides } = await ridesApi.getRides(start, end);
      this.drivers = drivers;
      this.rides = rides;
    },
  },

  async asyncData({ params, $api }) {
    const today = new Date();
    const start = DateTime.local().startOf('days').toJSDate();
    const end = DateTime.local().endOf('days').toJSDate();
    const ridesApi = $api.rides(params.campus, EDITABLE_FIELDS);
    const { data: drivers } = await ridesApi.getAvailableDrivers(
      'id,name,availabilities(s,e)',
      start,
      end,
    );
    const { data: rides } = await ridesApi.getRides(start, end);
    return {
      campus: params.campus,
      drivers,
      rides,
      today,
      ride: generateEmptyRide(),
    };
  },
  methods: {
    async edit(ride) {
      const { data } = await this.$api.rides(
        this.campus,
        EDITABLE_FIELDS,
      ).postRide(ride);
      this.rides.push(data);
    },

    updateDates([start, end], { id, name } = {}) {
      this.ride.driver = { id, name };
      this.ride.start = start instanceof DateTime ? start : DateTime.fromJSDate(start);
      this.ride.end = end instanceof DateTime ? end : DateTime.fromJSDate(end);
    },
  },
};
</script>
<style scoped lang="scss">
  @import "~assets/css/head";

  .today.box {
    padding: $size-small;
    display: inline-block;
    .svg-inline--fa {
      color: $black;
    }
  }
</style>
