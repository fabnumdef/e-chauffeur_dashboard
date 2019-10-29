<template>
  <div class="calendar">
    <client-only>
      <vue-cal
        class="vuecal--blue-theme"
        default-view="day"
        locale="fr"
        split-days-in-header
        hide-view-selector
        watch-real-time
        dom-cells
        :time-from="startDayHour * 60"
        :time-to="endDayHour * 60"
        :time-step="step"
        :time-cell-height="20"
        :disable-views="['years', 'year', 'week']"
        :split-days="splitDrivers"
        :events="events"
        :on-event-click="onClickEvent"
        :min-event-width="75"
        :min-split-width="MIN_SPLIT_WIDTH"
        @click-and-release="onClickAndRelease"
        @ready="initRide"
        @view-change="viewChange"
      >
        <template #title-bar="{ view, switchView, previous, next }">
          <div
            class="control-width"
            :style="{width: `calc(${MIN_SPLIT_WIDTH * splitDrivers.length}px + 3em)`, color: 'red'}"
          >
            <div v-if="view.id === 'day'">
              <button
                class="button"
                @click="switchView('month')"
              >
                <fa-icon icon="calendar-alt" />&nbsp; {{ getFormatedDate(view.startDate) }}
              </button>
            </div>
            <div v-else>
              <button @click="previous()">
                <fa-icon :icon="['fas', 'chevron-left']" />
              </button>
              <button
                class="button"
                @click="switchView('day', new Date())"
              >
                <fa-icon icon="calendar-alt" />&nbsp; {{ getFormatedDate(view.startDate, 'month') }}
              </button>
              <button @click="next()">
                <fa-icon :icon="['fas', 'chevron-right']" />
              </button>
            </div>
          </div>
        </template>
        <template #split-day-column>
          <fa-icon icon="user-circle" />
        </template>
        <template #split-day="{ split }">
          <driver-header
            :driver="split.driver"
            :ride="getCurrentRide(split.driver.id)"
          />
        </template>
        <template
          #time-cell="{ hours, minutes }"
        >
          <div :class="{ line: true, hours: !minutes }">
            <strong
              v-if="!minutes"
              class="hours"
            >{{ hours }}</strong>
            <span
              v-else
              class="minutes"
            >{{ minutes }}</span>
          </div>
        </template>
        <template
          #event-renderer="{ event }"
        >
          <div
            v-if="event.ride"
            class="vuecal__event-title"
          >
            <div>
              {{ event.ride.departure.label }} <fa-icon icon="arrow-right" /> {{ event.ride.arrival.label }}
            </div>
            <div v-if="event.ride.car">
              {{ event.ride.car.model.label }} - {{ event.ride.car.id }}
            </div>
            <div>
              <span>{{ event.ride.passengersCount }} passager(s)</span> /
              <span v-if="event.ride.luggage">Avec</span><span v-else>Sans</span> Bagages
            </div>
          </div>
        </template>
        <template #cell-content="{ cell, view, events }">
          <div class="vuecal__cell-date">
            {{ cell.content }}
          </div>
          <div
            v-if="view.id === 'month' && customEventsCount(events)"
            class="vuecal__cell-events-count"
          >
            {{ customEventsCount(events) }}
          </div>
        </template>
      </vue-cal>
      <modal
        :current-ride="ride"
        :current-campus="currentCampus"
        :campus="campus"
        :modal-open="modalOpen"
        @toggle-modal="toggleModal"
      />
    </client-only>
  </div>
</template>

<script>

import { DateTime, Interval } from 'luxon';
import {
  DELIVERED, IN_PROGRESS, WAITING, STARTED, ACCEPTED, CREATED, VALIDATED,
  REJECTED_BOUNDARY, REJECTED_CAPACITY,
  CANCELED_TECHNICAL,
  CANCELED_REQUESTED_CUSTOMER,
  CANCELED_CUSTOMER_OVERLOAD,
  CANCELED_CUSTOMER_MISSING,
} from '@fabnumdef/e-chauffeur_lib-vue/api/status/states';
import { mapGetters } from 'vuex';
import Modal from './modal';
import DriverHeader from './driver-header';

const STEP = 30;
const START_DAY_HOUR = 0;
const END_DAY_HOUR = 24;
const MIN_SPLIT_WIDTH = 200;

function generateEmptyRide() {
  return {
    start: null,
    end: null,
    phone: null,
    departure: null,
    arrival: null,
    driver: null,
    status: CREATED,
    category: null,
    passengersCount: 1,
    luggage: false,
    comments: '',
  };
}

export default {
  components: {
    Modal,
    DriverHeader,
  },

  props: {
    drivers: {
      type: Array,
      default: () => [],
    },
    rides: {
      type: Array,
      default: () => [],
    },
    currentCampus: {
      type: Object,
      default: () => ({}),
    },
    campus: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      ride: generateEmptyRide(),
      day: new Date(),
      modalOpen: false,
      MIN_SPLIT_WIDTH,
    };
  },

  computed: {
    ...mapGetters({
      campusContext: 'context/campus',
    }),
    startDayHour() {
      return (this.campusContext && this.campusContext.workedHours)
        ? this.campusContext.workedHours.start : START_DAY_HOUR;
    },
    endDayHour() {
      return (this.campusContext && this.campusContext.workedHours)
        ? this.campusContext.workedHours.end : END_DAY_HOUR;
    },
    step() {
      return (this.campusContext && this.campusContext.defaultRideDuration)
        ? this.campusContext.defaultRideDuration : STEP;
    },
    splitDrivers() {
      return this.drivers.map((driver) => ({
        class: 'driver-col',
        label: driver.name,
        driver,
      }));
    },
    ridesCalendar() {
      return this.rides.map((ride) => {
        const start = this.$vuecal(this.step).getVueCalFloorDateFromISO(ride.start);
        const end = this.$vuecal(this.step).getVueCalCeilDateFromISO(ride.end);
        const split = ride.driver ? this.drivers.findIndex((driver) => driver.id === ride.driver.id) + 1 : 1;
        const clas = `ride-event ${this.eventStatusClass(ride)}`;
        return {
          start,
          end,
          ride,
          split,
          class: clas,
        };
      });
    },
    events() {
      const evts = this.ridesCalendar;
      const openingHoursEvents = [];
      this.drivers.forEach((driver, index) => {
        if (driver.availabilities && driver.availabilities.length > 0) {
          const availibilites = driver.availabilities.map((a) => (typeof a.s === 'string'
            ? Interval.fromDateTimes(DateTime.fromISO(a.s), DateTime.fromISO(a.e)) : a));
          const todayInterval = Interval.fromDateTimes(DateTime.fromJSDate(this.day).set({
            hour: this.startDayHour,
          }).startOf('hour'),
          DateTime.fromJSDate(this.day).set({
            hour: this.endDayHour,
          }).startOf('hour'));
          const notWorkingIntervals = todayInterval.difference(...Interval.merge(availibilites));
          notWorkingIntervals.forEach((avail) => {
            const start = this.$vuecal(this.step).getVueCalCeilDateFromISO(avail.start.toISO());
            const end = this.$vuecal(this.step).getVueCalCeilDateFromISO(avail.end.toISO());
            const split = index + 1;
            openingHoursEvents.push({
              start,
              end,
              split,
              class: 'not-working',
              background: true,
            });
          });
        }
      });
      return evts.concat(openingHoursEvents);
    },
  },

  methods: {
    toggleModal(newStatus = false) {
      this.modalOpen = newStatus;
    },
    initRide() {
      this.ride = generateEmptyRide();
      if (this.currentCampus.categories.length > 0) {
        [this.ride.category] = this.currentCampus.categories;
      }
    },
    updateDates([start, end], {
      id, name, firstname, lastname,
    } = {}) {
      this.ride.driver = {
        id, name, firstname, lastname,
      };
      this.ride.start = start instanceof DateTime ? start : DateTime.fromJSDate(start);
      this.ride.end = end instanceof DateTime ? end : DateTime.fromJSDate(end);
    },
    onClickAndRelease(event) {
      if (event.split > 1) {
        this.initRide();
        const {
          id, name, firstname, lastname,
        } = this.drivers[event.split - 1];
        this.updateDates([
          this.$vuecal(this.step).getDateTimeFloorFromVueCal(event.start),
          this.$vuecal(this.step).getDateTimeCeilFromVueCal(event.end)], {
          id,
          name,
          firstname,
          lastname,
        });
        this.toggleModal(true);
      }
    },
    onClickEvent(event) {
      if (event.ride) {
        const ride = { ...event.ride };
        ride.start = DateTime.fromISO(event.ride.start);
        ride.end = DateTime.fromISO(event.ride.end);
        ride.interval = Interval.fromDateTimes(ride.start, ride.end);
        this.ride = Object.assign(generateEmptyRide(), ride);
        this.toggleModal(true);
      }
    },
    eventStatusClass(event) {
      switch (event.status) {
        case DELIVERED:
          return 'event-status-done';
        case STARTED:
        case IN_PROGRESS:
          return 'event-status-driving';
        case WAITING:
          return 'event-status-waiting';
        case REJECTED_CAPACITY:
        case REJECTED_BOUNDARY:
        case CANCELED_TECHNICAL:
        case CANCELED_CUSTOMER_MISSING:
        case CANCELED_CUSTOMER_OVERLOAD:
        case CANCELED_REQUESTED_CUSTOMER:
          return 'event-status-wrong';
        case ACCEPTED:
          return 'event-status-accepted';
        case VALIDATED:
        default:
          return 'event-status-planned';
      }
    },
    getCurrentRide(driverId) {
      if (driverId === null) {
        return null;
      }
      const currentTime = DateTime.fromJSDate(new Date());
      return this.rides
        .filter((r) => r.driver && r.driver.id === driverId)
        .sort((a, b) => (DateTime.fromISO(a.start) < DateTime.fromISO(b.start) ? -1 : 1))
        .find((r) => (
          Interval.fromDateTimes(DateTime.fromISO(r.start), DateTime.fromISO(r.end)).contains(currentTime)
          || currentTime < DateTime.fromISO(r.start)
        ));
    },
    getFormatedDate(date, unit = 'day') {
      const dt = DateTime.fromJSDate(date);
      let formatedDate = '';
      if (unit === 'day') {
        formatedDate = dt.setLocale('fr').toFormat('cccc dd LLLL');
      } else {
        formatedDate = dt.setLocale('fr').toFormat('LLLL y');
      }
      return formatedDate;
    },
    viewChange(obj) {
      if (obj.view === 'day') {
        this.day = obj.startDate;
      }
      this.$emit('view-change', obj);
    },
    customEventsCount(events) {
      return events ? events.filter((e) => e.class !== 'not-working').length : 0;
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "~assets/css/head";
  @import "~assets/css/elements/vue-cal.scss";

  /deep/ {
    .control-width {
      text-align: left;
    }
    .vuecal--overflow-x.vuecal--day-view .vuecal__cells, .vuecal--overflow-x.vuecal--week-view .vuecal__cells {
      overflow-x: hidden;
    }
    .vuecal.vuecal--overflow-x {
      overflow-x: auto;
    }
    .vuecal {
      &__title-bar {
        background: $background;
      }
      &__header button {
        background-color: #fff;
        font-size: 1rem;
      }
      &__body, &__header {
        min-width: fit-content;
      }
      &__bg {
        overflow-y: scroll;
      }
      &__split-days-in-header {
        padding: 0;
        overflow-y: scroll;
        padding-right: 1px;
      }
      &__split-days-in-header .vuecal__time-column {
        text-align: center;
        margin: auto 0;
        color: $success;
        vertical-align: middle;
        line-height: 20px;
        svg {
          font-size: 25px;
        }
      }
      &__time-cell .hours.line:before {border-color: #42b983;}
      &__event.not-working {
        background: repeating-linear-gradient(45deg, white, white 10px, #f2f2f2 10px, #f2f2f2 20px);/* IE 10+ */
        color: #999;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: default;
        width: calc(100% + 15px) !important;
        opacity: 1;
      }
      &__event.not-working &__event-time {
        align-items: center;
      }
    }
    .driver-col {
      border-right: 1px solid black;
    }
    .hours {
      font-size: 15px;
    }
    .minutes {
      font-size: 11px;
    }
    .ride-event {
      cursor: pointer;
    }
    .event-status {
      &-done {
        color: $black;
        border: 1px solid $black;
      }
      &-planned {
        background: repeating-linear-gradient(45deg, rgba(195, 195, 195, 1), rgba(195, 195, 195, 1) 1px,
          rgba(129, 146, 169, 1) 1px, rgba(129, 146, 169, 1) 20px);
        color: findColorInvert($dark-gray);
        border: 1px solid $dark-gray;
      }
      &-waiting {
        background: rgba(255, 221, 87, 1);
        color: findColorInvert($warning);
        border: 1px solid $warning;
      }
      &-driving {
        background: rgba(0, 83, 179, 1);
        color: findColorInvert($primary);
        border: 1px solid $primary;
      }
      &-accepted {
        background: rgba(129, 146, 169, 1);
        color: findColorInvert($primary);
        border: 1px solid $primary;
      }
      &-wrong {
        background: rgba(248, 248, 248, 1);
        color: $danger;
        border: 1px solid $danger;
      }
      p {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
</style>
