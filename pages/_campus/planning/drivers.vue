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
      <planning-modal
        :active="isModalOpen"
        :time-slot="timeSlot"
        :drivers="drivers"
        @toggle-modal="toggleModal"
        @edit-time-slot="editTimeSlot(timeSlot)"
        @remove-time-slot="removeTimeSlot(timeSlot)"
      />
      <main class="columns">
        <aside class="column is-one-quarter">
          <button
            class="button create-timeslot is-expanded"
            @click="openCreate({})"
          >
            <fa-icon icon="user-circle" /> Configurer un nouveau créneau
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
              <span>{{ driver.firstname }} {{ driver.lastname }}</span>
              <fa-icon
                v-if="driver.heavyLicence"
                class="bus-icon"
                icon="bus"
              />
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
          @edit-time-slot="editTimeSlot"
          @open-edit="openEdit"
          @open-create="openCreate"
          @view-change="viewChange"
        />
      </main>
    </div>
  </div>
</template>
<script>
import { DateTime } from 'luxon';
import planningModal from '~/components/modals/planning/drivers.vue';
import planningCalendar from '~/components/planning/drivers/calendar.vue';

const DRIVER_DATA = 'id,firstname,lastname,heavyLicence';
const TIMESLOT_DATA = `id,start,end,drivers(${DRIVER_DATA}),recurrence(enabled,frequency)`;
const newTimeSlot = () => ({
  start: null,
  end: null,
  drivers: [],
  cars: null,
  recurrence: { frequency: null, enabled: false },
});
export default {
  components: { planningModal, planningCalendar },
  async asyncData({ $api, params, query }) {
    const offset = parseInt(query.driver_offset, 10) || 0;
    const limit = parseInt(query.driver_limit, 10) || 30;
    const week = query.week ? DateTime.fromISO(query.week) : DateTime.local();
    const after = week.startOf('week').toJSDate();
    const before = week.endOf('week').toJSDate();
    const drivers = await $api.drivers(params.campus, DRIVER_DATA).getDrivers({ offset, limit });
    const events = await $api.timeSlot(TIMESLOT_DATA, params.campus)
      .getDriversTimeSlotsBetween(after, before);
    return {
      timeSlot: newTimeSlot(),
      drivers: {
        data: drivers.data,
        pagination: drivers.pagination,
      },
      events: {
        data: events.data,
        pagination: events.pagination,
      },
      isModalOpen: false,
      campusId: params.campus,
      isGrabbing: false,
    };
  },
  computed: {
    calEvents() {
      return this.events.data.map((event) => {
        const start = DateTime.fromISO(event.start);
        const end = DateTime.fromISO(event.end);
        return {
          start: this.$vuecal().getVueCalFromDatetime(start),
          end: this.$vuecal().getVueCalFromDatetime(end),
          content: {
            ...event,
            start,
            end,
          },
          class: 'slot-event',
        };
      });
    },
  },
  methods: {
    async viewChange({ startDate, endDate }) {
      const { data, pagination } = await this.$api.timeSlot(TIMESLOT_DATA, this.campusId)
        .getDriversTimeSlotsBetween(startDate, endDate);
      this.events = { data, pagination };
    },
    toggleModal(val) {
      this.isModalOpen = typeof val !== 'undefined' ? val : this.modalOpen;
    },
    async editTimeSlot(timeSlot) {
      const api = this.$api.timeSlot(TIMESLOT_DATA, this.campusId);
      if (timeSlot.id) {
        const i = this.events.data.findIndex(({ id }) => id === timeSlot.id);
        const { data } = await api.editTimeSlot(timeSlot.id, timeSlot);
        if (i >= 0) {
          this.events.data.splice(i, 1, data);
        } else {
          this.events.data.push(data);
        }
      } else {
        const { data } = await api.createTimeSlot(timeSlot);
        this.events.data.push(data);
      }
      this.toggleModal(false);
    },
    updateDates([start, end]) {
      this.timeSlot.start = start;
      this.timeSlot.end = end;
    },
    openCreate({
      start = DateTime.fromJSDate(new Date()).startOf('hour').toJSDate(),
      end = DateTime.fromJSDate(new Date()).endOf('hour').toJSDate(),
    }) {
      this.timeSlot = Object.assign(
        newTimeSlot(),
        { start, end },
      );
      this.toggleModal(true);
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
    openEdit({ content: timeSlot }) {
      this.timeSlot = timeSlot;
      this.toggleModal(true);
    },
    async removeTimeSlot({ id }) {
      const api = this.$api.timeSlot(TIMESLOT_DATA, this.campusId);
      if (window && window.confirm('Voulez vous vraiment supprimer cette plage horaire ?')) {
        await api.deleteTimeSlot(id);
        const i = this.events.data.findIndex((e) => e.id === id);
        this.events.data.splice(i, 1);
      }
      this.toggleModal(false);
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
      display: flex;
      justify-content: flex-end;
      align-items: center;
      span {
        margin-right: auto;
      }
      .bus-icon {
        color: $blue-ultra-light;
        margin-right:  1em;
      }
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
    padding-left: 2em;
    width: 100%;
    position: relative;
    /deep/ .fa-user-circle {
      position: absolute;
      left: 4px;
      color: $white;
      background: $success;
      padding: 5px;
      box-sizing: initial;
      border-radius: $gap;
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
