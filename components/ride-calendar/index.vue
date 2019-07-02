<template>
  <div class="calendar">
    <vue-cal
      class="vuecal--blue-theme"
      :time-from="START_DAY_HOUR * 60"
      :time-to="END_DAY_HOUR * 60"
      :time-step="STEP"
      :time-cell-height="20"
      default-view="day"
      locale="fr"
      :disable-views="['years', 'year', 'week']"
      :split-days="splitDrivers"
      :events="events"
      :on-event-click="onClickEvent"
      split-days-in-header
      hide-view-selector
      @click-and-release="onClickAndRelease"
      @ready="initRide"
    >
      <template #title-bar="{ view, switchView, previous, next }">
        <div class="">
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
        <driver-header :driver="split.driver" :ride="getCurrentRide(split.driver.id)"/>
      </template>
      <div
        slot="time-cell"
        slot-scope="{ hours, minutes }"
        :class="{ line: true, hours: !minutes }"
      >
        <strong
          v-if="!minutes"
          style="font-size: 15px"
        >{{ hours }}</strong>
        <span
          v-else
          style="font-size: 11px"
        >{{ minutes }}</span>
      </div>
      <div
        slot="event-renderer"
        slot-scope="{ event }"
      >
        <div
          v-if="event.ride"
          class="vuecal__event-title"
        >
          <div>
            {{ event.ride.departure.label }} <fa-icon icon="arrow-right" /> {{ event.ride.arrival.label }}
          </div>
          <div>
            {{ event.ride.car.model.label }} - {{ event.ride.car.id }}
          </div>
          <div>
            <span>{{event.ride.passengersCount}} passager(s)</span> /
            <span v-if="event.ride.luggage">Avec</span><span v-else>Sans</span> Bagages
          </div>
        </div>
      </div>
    </vue-cal>
    <modal
      :current-ride="ride"
      :current-campus="currentCampus"
      :campus="campus"
      :modal-open="modalOpen"
      @toggle-modal="toggleModal"
    />
  </div>
</template>

<script>
/* eslint-disable no-plusplus */

import VueCal from '@qonfucius/vue-cal';
import { DateTime, Interval } from 'luxon';
import {
  DELIVERED, IN_PROGRESS, WAITING, STARTED, ACCEPTED, CREATED, VALIDATED,
  REJECTED_BOUNDARY, REJECTED_CAPACITY,
  CANCELED_TECHNICAL,
  CANCELED_REQUESTED_CUSTOMER,
  CANCELED_CUSTOMER_OVERLOAD,
  CANCELED_CUSTOMER_MISSING,
} from '@fabnumdef/e-chauffeur_lib-vue/api/status/states';
import Modal from './modal';
import DriverHeader from './driver-header';

const STEP = 30;
const START_DAY_HOUR = 5;
const END_DAY_HOUR = 23;

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
  };
}

function getFloorMinute(minute) {
  const numberOfStep = Math.floor(60 / STEP);
  let res = 0;
  for (let i = 1; i <= numberOfStep; i++) {
    const currentStep = STEP * i;
    if (currentStep > minute) {
      break;
    }
    res = currentStep;
  }
  return res;
}

function getCeilMinute(minute) {
  const numberOfStep = Math.floor(60 / STEP);
  let res = 0;
  for (let i = 0; i <= numberOfStep; i++) {
    const currentStep = STEP * i;
    if (currentStep >= minute) {
      res = currentStep;
      break;
    }
  }
  return res;
}

function getVueCalFloorDateFromISO(date) {
  const exactDate = DateTime.fromISO(date);
  return DateTime.fromObject({
    day: exactDate.day,
    hour: exactDate.hour,
    minute: getFloorMinute(exactDate.minute),
  }).setLocale('fr')
    .toFormat('yyyy-LL-dd HH:mm');
}

function getVueCalCeilDateFromISO(date) {
  const exactDate = DateTime.fromISO(date);
  const minute = getCeilMinute(exactDate.minute);
  return DateTime.fromObject({
    day: exactDate.day,
    hour: minute === 60 ? exactDate.hour + 1 : exactDate.hour,
    minute: minute === 60 ? 0 : minute,
  }).setLocale('fr')
    .toFormat('yyyy-LL-dd HH:mm');
}

function getDateTimeFloorFromVueCal(date) {
  const exactDate = DateTime.fromFormat(date, 'yyyy-LL-dd HH:mm');
  const now = DateTime.local();
  let minute = getFloorMinute(exactDate.minute);
  if (now.hasSame(exactDate, 'year') && now.hasSame(exactDate, 'month') && now.hasSame(exactDate, 'hour')
    && getFloorMinute(now.minute) === minute) {
    // eslint-disable-next-line prefer-destructuring
    minute = now.minute;
  }
  return DateTime.fromObject({
    day: exactDate.day,
    hour: exactDate.hour,
    minute,
  });
}

function getDateTimeCeilFromVueCal(date) {
  const exactDate = DateTime.fromFormat(date, 'yyyy-LL-dd HH:mm');
  const minute = getCeilMinute(exactDate.minute);
  return DateTime.fromObject({
    day: exactDate.day,
    hour: minute === 60 ? exactDate.hour + 1 : exactDate.hour,
    minute: minute === 60 ? 0 : minute,
  });
}

export default {
  components: {
    VueCal,
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
      default: () => {},
    },
    campus: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      ride: generateEmptyRide(),
      STEP,
      START_DAY_HOUR,
      END_DAY_HOUR,
      modalOpen: false,
    };
  },

  computed: {
    splitDrivers() {
      return this.drivers.map((driver, index) => {
        let driverClass = 'driver-col';
        if (index % 2 !== 0) {
          driverClass = 'driver-col-bis';
        }
        return {
          class: driverClass,
          label: driver.name,
          driver,
        };
      });
    },
    ridesCalendar() {
      return this.rides.map((ride) => {
        const start = getVueCalFloorDateFromISO(ride.start);
        const end = getVueCalCeilDateFromISO(ride.end);
        const split = this.drivers.findIndex(driver => driver.id === ride.driver.id) + 1;
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
          driver.availabilities.forEach((avail) => {
            if (avail.start.hour > START_DAY_HOUR) {
              const start = getVueCalFloorDateFromISO(DateTime.fromObject({ hour: START_DAY_HOUR }).toISO());
              const end = getVueCalCeilDateFromISO(avail.start.toISO());
              const split = index + 1;
              openingHoursEvents.push({
                start,
                end,
                split,
                class: 'not-working',
                background: true,
              });
            }
            if (avail.end.hour < END_DAY_HOUR) {
              const start = getVueCalFloorDateFromISO(avail.end.toISO());
              const end = getVueCalCeilDateFromISO(DateTime.fromObject({ hour: END_DAY_HOUR }).toISO());
              const split = index + 1;
              openingHoursEvents.push({
                start,
                end,
                split,
                class: 'not-working',
                background: true,
              });
            }
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
    updateDates([start, end], { id, name } = {}) {
      this.ride.driver = { id, name };
      this.ride.start = start instanceof DateTime ? start : DateTime.fromJSDate(start);
      this.ride.end = end instanceof DateTime ? end : DateTime.fromJSDate(end);
    },
    onClickAndRelease(event) {
      this.initRide();
      const { id, name } = this.drivers[event.split - 1];
      this.updateDates([getDateTimeFloorFromVueCal(event.start), getDateTimeCeilFromVueCal(event.end)], {
        id,
        name,
      });
      this.toggleModal(true);
    },
    onClickEvent(event) {
      if (event.ride) {
        const ride = Object.assign({}, event.ride);
        ride.start = DateTime.fromISO(event.ride.start);
        ride.end = DateTime.fromISO(event.ride.end);
        ride.interval = Interval.fromDateTimes(ride.start, ride.end);
        this.ride = ride;
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
      const currentTime = DateTime.fromJSDate(new Date());
      return this.rides
        .filter(r => r.driver.id === driverId)
        .find(r => Interval.fromDateTimes(DateTime.fromISO(r.start), DateTime.fromISO(r.end)).contains(currentTime));
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
  },
};
</script>

<style lang="scss" scoped>
  @import "~assets/css/head";
  .calendar {
    height: calc(100vh - 100px);
    background-color: white;
  }
  /deep/ {
    .vuecal {
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
      &__now-line {
        z-index: 100;
      }
      &--blue-theme &__title-bar {
        background: $background;
      }
      &__time-cell .hours.line:before {border-color: #42b983;}
      &__event.not-working {
        background: repeating-linear-gradient(45deg, white, white 10px, #f2f2f2 10px, #f2f2f2 20px);/* IE 10+ */
        color: #999;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: default;
      }
      &__event.not-working &__event-time {display: none;align-items: center;}
      &__event-title {
        font-size: 0.75rem;
        font-weight: bold;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .driver-col, /deep/ .driver-col-bis {
      border-right: 1px solid black;
      cursor: crosshair;
    }
    .ride-event {
      margin-right: 15px;
      cursor: pointer;
    }
    .event-status {
      &-done {
        color: $black;
        border: 1px solid $black;
      }
      &-planned {
        background: repeating-linear-gradient(45deg, rgba(195, 195, 195, 0.85), rgba(195, 195, 195, 0.85) 1px,
          rgba(129, 146, 169, 0.85) 1px, rgba(129, 146, 169, 0.85) 20px);
        color: findColorInvert($dark-gray);
        border: 1px solid $dark-gray;
      }
      &-waiting {
        background: rgba(255, 221, 87, 0.85);
        color: findColorInvert($warning);
        border: 1px solid $warning;
      }
      &-driving {
        background: rgba(0, 83, 179, 0.86);
        color: findColorInvert($primary);
        border: 1px solid $primary;
      }
      &-accepted {
        background: rgba(129, 146, 169, 0.85);
        color: findColorInvert($primary);
        border: 1px solid $primary;
      }
      &-wrong {
        background: rgba(248, 248, 248, 0.85);
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
