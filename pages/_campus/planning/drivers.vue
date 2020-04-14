<template>
  <div>
    <div class="box">
      <div class="title columns">
        <div class="column aside is-one-quarter">
          Planning Chauffeurs
        </div>
        <div class="column">
          <nuxt-link
            class="button switch-planning"
            :to="campusLink('planning-cars', { query: { current: $route.query.current } })"
          >
            <fa-icon icon="user-circle" /> <fa-icon icon="car" />
          </nuxt-link>
        </div>
      </div>
      <driver-modal
        :active="modalOpen.driver"
        :time-slot="timeSlot"
        :drivers="drivers"
        @toggle-modal="toggleDriversModal"
        @edit-time-slot="editDriversTimeSlot(timeSlot)"
        @remove-time-slot="removeTimeSlot(timeSlot)"
      />

      <shuttle-modal
        :active="modalOpen.shuttle"
        :time-slot="timeSlot"
        :patterns="patterns"
        :drivers="drivers"
        @toggle-modal="toggleShuttlesModal"
        @edit-time-slot="editShuttles(timeSlot)"
        @remove-time-slot="removeTimeSlot(timeSlot, 'shuttle')"
      />

      <main class="columns">
        <aside class="column is-one-quarter">
          <button
            class="button create-timeslot is-expanded"
            @click="openCreate({ type: 'driver' })"
          >
            <fa-icon icon="user-circle" /> Configurer un créneau
          </button>
          <button
            class="button create-timeslot is-expanded"
            @click="openCreate({ type: 'shuttle' })"
          >
            <fa-icon
              class="shuttle"
              icon="user-circle"
            /> Configurer une navette
          </button>

          <div class="drivers-expander">
            <span>Chauffeurs</span>
          </div>
          <ul>
            <li
              v-for="driver of drivers.data"
              :key="driver.id"
              class="box driver-box"
              draggable="true"
              @dragstart="dragstart($event, driver)"
              @dragend="dragend"
            >
              {{ driver.firstname }} {{ driver.lastname }}
              <nuxt-link
                class="config-button is-pulled-right"
                :to="campusLink('drivers-id-edit', {params:{id: driver.id}})"
              >
                <fa-icon icon="cog" />
              </nuxt-link>
            </li>
          </ul>
        </aside>
        <planning-calendar
          :is-grabbing="isGrabbing"
          :events="calEvents"
          :drivers="drivers"
          @edit-time-slot="editDriversTimeSlot"
          @edit-shuttle="editShuttles"
          @open-edit="openEdit"
          @open-create="openCreate"
          @view-change="viewChange"
        />
      </main>
    </div>
  </div>
</template>
<script>
// eslint-disable-next-line max-classes-per-file
import { DateTime } from 'luxon';
import driverModal from '~/components/modals/planning/drivers.vue';
import shuttleModal from '~/components/modals/planning/shuttles.vue';
import planningCalendar from '~/components/planning/drivers/calendar.vue';

const DRIVER_DATA = 'id,firstname,lastname';
const TIMESLOT_DATA = `id,start,end,drivers(${DRIVER_DATA}),recurrence(enabled,frequency)`;
const PATTERN_DATA = 'id,label,stops';
const commons = 'id,label,start,end,comments';
const SHUTTLE_DATA = `${commons},pattern(${PATTERN_DATA}),driver(${DRIVER_DATA}),recurrence(enabled,frequency)`;

class TimeSlot {
  drivers = [];

  cars = null;

  recurrence = { frequency: null, enabled: false };

  constructor(start = null, end = null) {
    this.start = start;
    this.end = end;
  }
}

class Shuttle {
  recurrence = { frequency: null, enabled: false };

  title = null;

  driver = null;

  comments = null;

  constructor(
    start = null,
    end = null,
    pattern = { id: null, label: null, stops: [] },
  ) {
    this.start = start;
    this.end = end;
    this.pattern = pattern;
  }
}

function generateCalEvents(array, vuecal, type) {
  return array.map((event) => {
    const start = DateTime.fromISO(event.start);
    const end = DateTime.fromISO(event.end);
    return {
      start: vuecal().getVueCalFromDatetime(start),
      end: vuecal().getVueCalFromDatetime(end),
      content: {
        ...event,
        start,
        end,
      },
      class: type === 'shuttle' ? 'slot-event shuttle' : 'slot-event',
    };
  });
}

export default {
  components: {
    driverModal,
    shuttleModal,
    planningCalendar,
  },
  async asyncData({ $api, params, query }) {
    const offset = parseInt(query.driver_offset, 10) || 0;
    const limit = parseInt(query.driver_limit, 10) || 30;
    const week = query.week ? DateTime.fromISO(query.week) : DateTime.local();
    const after = week.startOf('week').toJSDate();
    const before = week.endOf('week').toJSDate();

    const drivers = await $api.drivers(params.campus, DRIVER_DATA)
      .getDrivers({ offset, limit });
    const patterns = await $api.patterns(params.campus, PATTERN_DATA)
      .getPatterns({ offset, limit });
    const driversEvents = await $api.timeSlot(TIMESLOT_DATA, params.campus)
      .getDriversTimeSlotsBetween(after, before);
    const shuttleEvents = await $api.shuttles(params.campus, SHUTTLE_DATA)
      .getShuttles(after, before);

    return {
      timeSlot: new TimeSlot(),
      drivers: {
        data: drivers.data,
        pagination: drivers.pagination,
      },
      patterns: {
        data: patterns.data,
        pagination: patterns.pagination,
      },
      events: {
        drivers: {
          data: driversEvents.data,
          pagination: driversEvents.pagination,
        },
        shuttles: {
          data: shuttleEvents.data,
          pagination: shuttleEvents.pagination,
        },
      },
      modalOpen: {
        driver: false,
        shuttle: false,
      },
      campusId: params.campus,
      isGrabbing: false,
    };
  },
  computed: {
    calEvents() {
      const { data: drivers } = this.events.drivers;
      const { data: shuttles } = this.events.shuttles;
      return [
        ...generateCalEvents(drivers, this.$vuecal),
        ...generateCalEvents(shuttles, this.$vuecal, 'shuttle'),
      ];
    },
  },
  methods: {
    async viewChange({ startDate, endDate }) {
      const driversEvents = await this.$api.timeSlot(TIMESLOT_DATA, this.campusId)
        .getDriversTimeSlotsBetween(startDate, endDate);
      const shuttleEvents = await this.$api.shuttles(this.campusId, SHUTTLE_DATA)
        .getShuttles(startDate, endDate);
      this.events = {
        drivers: {
          data: driversEvents.data,
          pagination: driversEvents.pagination,
        },
        shuttles: {
          data: shuttleEvents.data,
          pagination: shuttleEvents.pagination,
        },
      };
    },
    toggleDriversModal(val) {
      this.modalOpen.driver = typeof val !== 'undefined' ? val : !this.modalOpen.driver;
    },
    toggleShuttlesModal(val) {
      this.modalOpen.shuttle = typeof val !== 'undefined' ? val : !this.modalOpen.shuttle;
    },
    async editDriversTimeSlot(timeSlot) {
      const api = this.$api.timeSlot(TIMESLOT_DATA, this.campusId);
      if (timeSlot.id) {
        const i = this.events.drivers.data.findIndex(({ id }) => id === timeSlot.id);
        const { data } = await api.editTimeSlot(timeSlot.id, timeSlot);
        if (i >= 0) {
          this.events.drivers.data.splice(i, 1, data);
        } else {
          this.events.drivers.data.push(data);
        }
      } else {
        const { data } = await api.createTimeSlot(timeSlot);
        this.events.drivers.data.push(data);
      }
      this.toggleDriversModal(false);
    },
    async editShuttles(timeSlot) {
      const api = this.$api.shuttles(this.campusId, SHUTTLE_DATA);
      if (timeSlot.id) {
        const i = this.events.shuttles.data.findIndex(({ id }) => id === timeSlot.id);
        const { data } = await api.patchShuttle(timeSlot.id, timeSlot);
        if (i >= 0) {
          this.events.shuttles.data.splice(i, 1, data);
        } else {
          this.events.shuttles.data.push(data);
        }
      } else {
        const { data } = await api.postShuttle(timeSlot);
        this.events.shuttles.data.push(data);
      }
      this.toggleShuttlesModal(false);
    },
    updateDates([start, end]) {
      this.timeSlot.start = start;
      this.timeSlot.end = end;
    },
    openCreate({
      start = DateTime.fromJSDate(new Date()).startOf('hour').toJSDate(),
      end = DateTime.fromJSDate(new Date()).endOf('hour').toJSDate(),
      type,
    }) {
      if (type === 'shuttle') {
        this.timeSlot = new Shuttle(start, end);
        this.toggleShuttlesModal(true);
      } else {
        this.timeSlot = new TimeSlot(start, end);
        this.toggleDriversModal(true);
      }
    },
    dragstart(event, driver) {
      this.isGrabbing = true;
      event.dataTransfer.setData('application/json', JSON.stringify(driver));
      // eslint-disable-next-line no-param-reassign
      event.currentTarget.style.backgroundColor = 'rgba(0, 83, 179, 0.4)';
      // eslint-disable-next-line no-param-reassign
      event.currentTarget.style.cursor = 'grabbing';
    },
    dragend(event) {
      this.isGrabbing = false;
      // eslint-disable-next-line no-param-reassign
      event.currentTarget.style.cursor = 'grab';
      // eslint-disable-next-line no-param-reassign
      event.currentTarget.style.backgroundColor = '';
    },
    openEdit({ content: timeSlot, classes }) {
      this.timeSlot = timeSlot;
      if (classes.find((cls) => cls === 'shuttle')) {
        this.toggleShuttlesModal(true);
      } else {
        this.toggleDriversModal(true);
      }
    },
    async removeTimeSlot({ id }, type) {
      if (window && window.confirm('Voulez vous vraiment supprimer cette plage horaire ?')) {
        if (type === 'shuttle') {
          await this.$api.shuttles(this.campusId, SHUTTLE_DATA).deleteShuttle(id);
          const i = this.events.shuttles.data.findIndex((e) => e.id === id);
          this.events.shuttles.data.splice(i, 1);
          this.toggleShuttlesModal(false);
        } else {
          await this.$api.timeSlot(TIMESLOT_DATA, this.campusId).deleteTimeSlot(id);
          const i = this.events.drivers.data.findIndex((e) => e.id === id);
          this.events.drivers.data.splice(i, 1);
          this.toggleDriversModal(false);
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
  @import "~assets/css/head";
  .box {
    .title {
      color: $black;
    }
    aside {
      width: 300px;
    }
    &.driver-box {
      cursor: grab;
      border-radius: $gap;
      padding: $size-small;
      font-weight: bold;
      .config-button {
        color: $dark-gray;
        &:hover {
          color: $gray;
        }
      }
    }
  }
  .create-timeslot {
    border-radius: $gap;
    width: 100%;
    position: relative;
    margin-bottom: .5em;
    padding-left: 2em;
    /deep/ .fa-user-circle {
      position: absolute;
      left: 4px;
      color: $white;
      background: $success;
      padding: 5px;
      box-sizing: initial;
      border-radius: $gap;
      &.shuttle {
        background-color: $primary;
      }
    }
  }

  .switch-planning {
    border-radius: $gap;
    position: relative;
    width: 62px;
    margin-top: 5px;
    padding: 0;
    height: 30px;
    background-color: $gray;
    /deep/ .fa-user-circle {
      position: absolute;
      left: 0;
      color: $white;
      background: $success;
      padding: 7px;
      box-sizing: initial;
      border-radius: $gap;
    }
    /deep/ .fa-car {
      position: absolute;
      right: 0;
      color: $grey;
      padding: 7px;
      box-sizing: initial;
      border-radius: $gap;
    }
  }

  .drivers-expander {
    position: relative;
    margin: $size-small;
    span {
      color: $dark-gray;
      background: $white;
      font-weight: bold;
      z-index: 1;
      position: relative;
      padding-right: 4px;
      font-size: $size-6;
    }
    &:before {
      background: 1px $dark-gray;
      height: 1px;
      width: 100%;
      content: " ";
      display: block;
      top: $size-6;
      right: 0;
      position: absolute;
      z-index: 0;
    }
  }
</style>
