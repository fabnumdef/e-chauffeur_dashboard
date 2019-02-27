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
      @click-event="onClickEvent"
      @init-event="initRide"
    >
      <template slot="title">
        <template v-if="ride.id">
          Modifier course #{{ ride.id }}
        </template>
        <template v-else>
          Nouvelle course
        </template>
      </template>
      <template
        slot="col-title"
        slot-scope="{ col }"
      >
        {{ col.name }}
      </template>
      <template
        slot="event-card"
        slot-scope="{ event }"
      >
        <p>{{ event.departure.label }} <fa-icon icon="arrow-right" /> {{ event.arrival.label }}</p>
      </template>
      <template
        slot="col-title"
        slot-scope="{ col }"
      >
        {{ col.name }}
      </template>
      <template
        slot="modal"
        class="white-background"
      >
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

        <div class="columns">
          <ec-field
            class="column"
            label="Départ"
            field-id="departure"
          >
            <search-poi v-model="ride.departure" />
          </ec-field>

          <ec-field
            class="column"
            label="Arrivée"
            field-id="arrival"
          >
            <search-poi v-model="ride.arrival" />
          </ec-field>
        </div>

        <ec-field
          label="Type de course"
          field-id="departure"
        >
          <search-category v-model="ride.category" />
        </ec-field>
        <div class="columns">
          <ec-field
            v-if="ride.driver && ride.driver.name"
            class="column"
            label="Chauffeur"
            field-id="driver"
          >
            {{ ride.driver.name }}
          </ec-field>
          <ec-field
            class="column"
            label="Véhicule"
            field-id="car"
          >
            <search-available-car
              v-model="ride.car"
              :start="ride.start"
              :end="ride.end"
              :campus="campus"
            />
          </ec-field>
        </div>

        <ec-field
          label="Téléphone"
          field-id="phone"
        >
          <input
            id="phone"
            v-model="ride.phone"
            class="input"
          >
        </ec-field>

        <ec-field
          label="Nombre de passagers"
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
          label="Commentaires"
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
import { mapGetters, mapMutations } from 'vuex';
import vueCalendar from '~/components/calendar.vue';
import ecField from '~/components/form/field.vue';
import { DateTime } from 'luxon';
import searchPoi from '~/components/form/search-poi';
import searchCategory from '~/components/form/search-campus-category';
import searchAvailableCar from '~/components/form/search-available-car';

const EDITABLE_FIELDS = [
  'id',
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
    ...mapGetters({ rides: 'realtime/rides' }),
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
      this.setRides(rides);
    },
  },

  async asyncData({ params, $api, store }) {
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
    store.commit('realtime/setRides', rides);
    return {
      campus: params.campus,
      drivers,
      today,
      ride: generateEmptyRide(),
    };
  },
  methods: {
    ...mapMutations({
      pushRide: 'realtime/pushRide',
      setRides: 'realtime/setRides',
    }),
    async edit(ride) {
      if (ride.id) {
        await this.$api.rides(
          this.campus,
          EDITABLE_FIELDS,
        ).patchRide(ride.id, ride);
      } else {
        await this.$api.rides(
          this.campus,
          EDITABLE_FIELDS,
        ).postRide(ride);
      }
    },

    updateDates([start, end], { id, name } = {}) {
      this.ride.driver = { id, name };
      this.ride.start = start instanceof DateTime ? start : DateTime.fromJSDate(start);
      this.ride.end = end instanceof DateTime ? end : DateTime.fromJSDate(end);
    },

    onClickEvent(ride) {
      this.ride = ride;
    },
    initRide() {
      this.ride = generateEmptyRide();
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
