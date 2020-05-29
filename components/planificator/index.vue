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
        :time-cell-height="30"
        :disable-views="['years', 'year', 'week']"
        :split-days="splitDrivers"
        :events="events"
        :on-event-click="onClickEvent"
        :min-event-width="75"
        :min-split-width="MIN_SPLIT_WIDTH"
        @click-and-release="openTypeModal"
        @view-change="viewChange"
        @event-mouse-enter="eventMouseEnter"
        @event-mouse-leave="eventMouseLeave"
      >
        <template #title-bar="{ view, switchView, previous, next }">
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
        </template>
        <template #split-day-column>
          <fa-icon icon="user-circle" />
        </template>
        <template #split-day="{ split }">
          <driver-header
            :style="{'min-width': `${MIN_SPLIT_WIDTH}px`}"
            :driver="split.driver"
            :ride="getCurrentDisplacement(split.driver.id)"
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
            <div class="event-hover-wrapper">
              <div
                v-show="eventHovered[event.index]"
                class="event-hover"
              >
                <div>
                  {{ event.ride.departure.label }} <fa-icon icon="arrow-right" /> {{ event.ride.arrival.label }}
                </div>
                <div>
                  {{ event.timeString }}
                </div>
                <div v-if="event.ride.car && event.ride.car.model">
                  {{ event.ride.car.model.label }} - {{ event.ride.car.id }}
                </div>
                <div>
                  <span>{{ event.ride.passengersCount }} passager(s)</span> /
                  <span v-if="event.ride.luggage">Avec</span><span v-else>Sans</span> Bagages
                </div>
                <div v-if="event.ride.phone">
                  {{ event.ride.phone }}
                </div>
              </div>
            </div>
            <div class="overflow-hidden">
              <div>
                {{ event.ride.departure.label }} <fa-icon icon="arrow-right" /> {{ event.ride.arrival.label }}
              </div>
              <div v-if="event.ride.car && event.ride.car.model">
                {{ event.ride.car.model.label }} - {{ event.ride.car.id }}
              </div>
              <div>
                <span>{{ event.ride.passengersCount }} passager(s)</span> /
                <span v-if="event.ride.luggage">Avec</span><span v-else>Sans</span> Bagages
              </div>
            </div>
          </div>
          <div
            v-if="event.shuttle"
            class="vuecal__event-title"
          >
            <div class="event-hover-wrapper">
              <div
                v-show="eventHovered[event.index]"
                class="event-hover"
              >
                <div v-if="event.shuttle.stops && event.shuttle.stops.length > 0">
                  {{ event.shuttle.stops[0].label }}
                  <fa-icon icon="arrow-right" />
                  {{ event.shuttle.stops[event.shuttle.stops.length - 1].label }}
                </div>
                <div>Navette {{ event.shuttle.label }}</div>
                <div>
                  {{ event.timeString }}
                </div>
                <div v-if="event.shuttle.car && event.shuttle.car.model">
                  {{ event.shuttle.car.model.label }} - {{ event.shuttle.car.id }}
                </div>
                <div v-if="event.shuttle.phone">
                  {{ event.shuttle.phone }}
                </div>
              </div>
            </div>
            <div class="overflow-hidden">
              <div class="event-title">
                Navette {{ event.shuttle.label }}
              </div>
              <div v-if="event.shuttle.stops && event.shuttle.stops.length > 0">
                {{ event.shuttle.stops[0].label }}
                <fa-icon icon="arrow-right" />
                {{ event.shuttle.stops[event.shuttle.stops.length - 1].label }}
              </div>
              <div v-if="event.shuttle.car && event.shuttle.car.model">
                {{ event.shuttle.car.model.label }} - {{ event.shuttle.car.id }}
              </div>
            </div>
          </div>
        </template>
        <template #cell-content="{ cell, view, events: evts }">
          <div class="vuecal__cell-date">
            {{ cell.content }}
          </div>
          <div
            v-if="view.id === 'month' && customEventsCount(evts)"
            class="cell-counts"
          >
            <div
              v-if="eventsToValidate(evts) > 0"
              class="to-validate"
            >
              {{ eventsToValidate(evts) }}
            </div>
            <div>
              {{ customEventsCount(evts) }}
            </div>
          </div>
        </template>
      </vue-cal>
      <type-modal
        :active="modalOpen.type"
        @choose-type="newDisplacement"
        @toggle-modal="closeTypeModal"
      />
      <ride-modal
        :current-ride="ride"
        :campus="campus"
        :modal-open="modalOpen.ride"
        @toggle-modal="toggleRideModal"
      />
      <shuttle-modal
        :current-shuttle="shuttle"
        :campus="campus"
        :active="modalOpen.shuttle"
        @toggle-modal="toggleShuttleModal"
      />
    </client-only>
  </div>
</template>

<script>
import { DateTime, Interval } from 'luxon';

import { mapGetters } from 'vuex';
import cloneDeep from 'lodash.clonedeep';
import { CREATED } from '@fabnumdef/e-chauffeur_lib-vue/api/status/states';
import rideModal from '~/components/modals/planificator/ride.vue';
import shuttleModal from '~/components/modals/planificator/shuttle.vue';
import driverHeader from './driver-header.vue';
import typeModal from '~/components/modals/planificator/choose-type.vue';
import dateRelated from '~/components/planificator/mixins/date-related';
import toggleModals from '~/components/planificator/mixins/toggle-modals';
import shuttleHandler from '~/components/planificator/mixins/shuttle-handler';
import rideHandler from '~/components/planificator/mixins/ride-handler';
import mouseEvents from '~/components/planificator/mixins/mouse-events';
import resetableMixin from '~/helpers/mixins/reset-data';

const MIN_SPLIT_WIDTH = 200;

function reset(type = null) {
  const shuttle = {
    shuttle: {
      start: null,
      end: null,
      phone: null,
      driver: null,
      status: CREATED,
      category: null,
      passengers: [],
      comments: '',
      shuttleFactory: {
        id: null,
        label: null,
        stops: [],
      },
    },
  };
  const ride = {
    ride: {
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
    },
  };
  if (type === 'shuttle') {
    return shuttle;
  }
  if (type === 'ride') {
    return ride;
  }
  return {
    ...shuttle,
    ...ride,
  };
}

export default {
  components: {
    rideModal,
    shuttleModal,
    driverHeader,
    typeModal,
  },
  mixins: [
    dateRelated(),
    toggleModals(),
    shuttleHandler(),
    rideHandler(),
    mouseEvents(),
    resetableMixin(reset),
  ],
  props: {
    drivers: {
      type: Array,
      default: () => [],
    },
    displacements: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      day: new Date(),
      MIN_SPLIT_WIDTH,
    };
  },

  computed: {
    ...mapGetters({
      campus: 'context/campus',
    }),
    splitDrivers() {
      return this.drivers.map((driver) => ({
        class: driver.licences && driver.licences.includes('D') ? 'driver-col heavy-weight' : 'driver-col',
        label: driver.name,
        driver,
      }));
    },
    ridesCalendar() {
      return this.displacements.map((d, index) => {
        const start = this.$vuecal(this.step).getVueCalFloorDateFromISO(d.start);
        const end = this.$vuecal(this.step).getVueCalCeilDateFromISO(d.end);
        const split = d.driver ? this.drivers.findIndex((driver) => driver.id === d.driver.id) + 1 : 1;
        const clas = d.shuttleFactory ? 'shuttle-event' : `ride-event ${this.eventStatusClass(d)}`;
        const timeString = `${DateTime.fromISO(d.start).toLocaleString(DateTime.TIME_SIMPLE)} à `
          + `${DateTime.fromISO(d.end).toLocaleString(DateTime.TIME_SIMPLE)}`;
        return {
          start,
          end,
          [d.shuttleFactory ? 'shuttle' : 'ride']: d,
          split,
          class: clas,
          index,
          timeString,
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
    formatArgsForEvent() {
      const {
        id, name, firstname, lastname,
      } = this.drivers[this.event.split - 1];

      const driverInfos = {
        id, name, firstname, lastname,
      };
      const start = this.$vuecal(this.step).getDateTimeFloorFromVueCal(this.event.start);
      const end = this.$vuecal(this.step).getDateTimeCeilFromVueCal(this.event.end);

      return [start, end, driverInfos];
    },
    newDisplacement(type) {
      if (this.event && this.event.split > 1) {
        const args = this.formatArgsForEvent();

        if (type === 'shuttle') {
          this.newShuttle(...args);
        } else {
          this.newRide(...args);
        }
      }
    },
    onClickEvent(event) {
      const eventType = this.isShuttle(event) ? 'shuttle' : 'ride';
      if (event[eventType]) {
        const displacement = cloneDeep(event[eventType]);
        displacement.start = DateTime.fromISO(event[eventType].start);
        displacement.end = DateTime.fromISO(event[eventType].end);
        displacement.interval = Interval.fromDateTimes(displacement.start, displacement.end);

        if (eventType === 'shuttle') {
          this.updateShuttle(displacement);
        } else {
          this.updateRide(displacement);
        }
      }
    },

    getCurrentDisplacement(driverId) {
      if (driverId === null) {
        return null;
      }
      const currentTime = DateTime.fromJSDate(new Date());
      return this.displacements
        .filter((r) => r.driver && r.driver.id === driverId)
        .sort((a, b) => (DateTime.fromISO(a.start) < DateTime.fromISO(b.start) ? -1 : 1))
        .find((r) => (
          Interval.fromDateTimes(DateTime.fromISO(r.start), DateTime.fromISO(r.end)).contains(currentTime)
          || currentTime < DateTime.fromISO(r.start)
        ));
    },
    customEventsCount(events) {
      return events ? events.filter((e) => e.class !== 'not-working').length : 0;
    },
    eventsToValidate(events) {
      return events
        ? events.filter((e) => (
          e.class !== 'not-working'
            && (e.ride && e.ride.status === CREATED))).length
        : 0;
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "~assets/css/head";
  @import "~assets/css/elements/vue-cal.scss";

  /deep/ {
    .vuecal--overflow-x.vuecal--day-view .vuecal__cells, .vuecal--overflow-x.vuecal--week-view .vuecal__cells {
      overflow-x: hidden;
    }
    .vuecal.vuecal--overflow-x {
      overflow-x: auto;
    }
    .vuecal {
      .cell-counts {
        display: flex;
        justify-content: center;
        & > div {
          background-color: rgba(66,163,185,.8);
          font-size: .6em;
          font-weight: 700;
          color: $white;
          margin: .2em;
          padding: .1em .6em;
          border-radius: 100%;
          &.to-validate {
            background-color: rgba($red, .8);
          }
        }
      }
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
      &__bg, &__weekdays-headings {
        overflow-y: scroll;
      }
      &__split-days-in-header {
        padding: 0;
        overflow-y: scroll;
        .vuecal__time-column {
          text-align: center;
          margin: auto 0;
          color: $success;
          vertical-align: middle;
          line-height: 20px;
          svg {
            font-size: 25px;
          }
        }
        .vuecal__flex[wrap] {
          flex-wrap: nowrap;
        }
      }
      &__event-title{
        overflow: visible;
        height: 100%;
        .event-hover-wrapper {
          position: relative;
          overflow: visible;
          .event-hover {
            font-weight: normal;
            font-size: 0.90rem;
            background-color: white;
            border: 1px solid black;
            padding: 10px;
            position: absolute;
            color: black;
            bottom: 5px;
            left: 0;
          }
          .event-hover:after, .event-hover:before {
            top: 100%;
            left: 25px;
            border: solid transparent;
            content: " ";
            height: 0;
            width: 0;
            position: absolute;
            pointer-events: none;
          }
          .event-hover:after {
            border-color: rgba(255, 255, 255, 0);
            border-top-color: #ffffff;
            border-width: 5px;
            margin-left: -5px;
          }
          .event-hover:before {
            border-color: rgba(0, 0, 0, 0);
            border-top-color: #000000;
            border-width: 6px;
            margin-left: -6px;
          }
        }
        .overflow-hidden {
          height: 100%;
          overflow: hidden;
          text-align: left;
          padding: .3em 1em;
          .event-title {
            font-size: 1em;
            text-transform: capitalize;
            font-weight: 700;
          }
        }
      }
      &__time-cell .hours.line:before {
        border-color: $white;
      }
      &__event.not-working {
        background-color: $gray;/* IE 10+ */
        color: #999;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: default;
        width: calc(100% + 15px) !important;
        opacity: 1;
        z-index: 10;
      }
      &__event.not-working &__event-time {
        align-items: center;
      }
    }
    .driver-col {
      border-right: 1px solid black;
      overflow: visible;

    }
    .heavy-weight {
      background-color: rgba($blue-ultra-light, .2);
    }
    .hours {
      font-size: 15px;
    }
    .minutes {
      font-size: 11px;
    }
    .ride-event, .shuttle-event {
      cursor: pointer;
      overflow: visible;
      border: 1px solid $white;
      border-radius: .3em;
    }
    .shuttle-event {
      background: $blue-light;
      color: $white;
      font-weight: 700;
    }
    .event-status {
      &-done {
        color: $black;
      }
      &-planned {
        background: $dark-gray;
        color: findColorInvert($dark-gray);
      }
      &-waiting {
        background: rgba(255, 221, 87, 1);
        color: findColorInvert($warning);
      }
      &-driving {
        background: rgba(0, 83, 179, 1);
        color: findColorInvert($primary);
      }
      &-accepted {
        background: rgba(129, 146, 169, 1);
        color: findColorInvert($primary);
      }
      &-wrong {
        background: $danger;
        color: $white;
      }
      p {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
</style>
