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
                v-if="driver.licences && driver.licences.includes('D')"
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
        <client-only>
          <planning-calendar
            :is-grabbing="isGrabbing"
            :events="calEvents"
            :drivers="drivers"
            @edit-time-slot="editTimeSlot"
            @open-edit="openEdit"
            @open-create="openCreate"
            @view-change="viewChange"
          />
        </client-only>
      </main>
    </div>
  </div>
</template>
<script>
// Disable no-param-reassign on events
/* eslint no-param-reassign: ["error", { "ignorePropertyModificationsFor": ["event"] }] */
import { DateTime } from 'luxon';
import planningModal from '~/components/modals/planning/drivers.vue';
import planningCalendar from '~/components/planning/drivers/calendar.vue';
import commonPlanning, { newTimeSlot } from './common';

const DRIVER_DATA = 'id,firstname,lastname,licences';
const TIMESLOT_DATA = `id,start,end,comments,drivers(${DRIVER_DATA}),recurrence(enabled,frequency)`;
const TYPE = 'drivers';
export default {
  components: { planningModal, planningCalendar },
  mixins: [commonPlanning(TYPE)],

  async asyncData({ $api, params, query }) {
    // @todo: paginate
    const offset = parseInt(query.driver_offset, 10) || 0;
    const limit = parseInt(query.driver_limit, 10) || 30;
    const week = query.week ? DateTime.fromISO(query.week) : DateTime.local();
    const after = week.startOf('week').toJSDate();
    const before = week.endOf('week').toJSDate();

    const drivers = await $api.query('drivers')
      .setCampus(params.campus)
      .setMask(DRIVER_DATA)
      .list()
      .setOffset(offset)
      .setLimit(limit);

    const events = await $api.query('timeSlot')
      .setMask(TIMESLOT_DATA)
      .listDrivers(after, before)
      .setFilter('campus', params.campus);

    return {
      timeSlot: newTimeSlot(TYPE),
      drivers: {
        data: drivers.data,
        pagination: drivers.pagination,
      },
      events: {
        data: events.data,
        pagination: events.pagination,
      },
    };
  },

  methods: {
    async viewChange({ startDate, endDate }) {
      const { data, pagination } = this.$api.query('timeSlot')
        .setMask(TIMESLOT_DATA)
        .listDrivers(startDate, endDate)
        .setFilter('campus', this.campus.id);
      this.events = { data, pagination };
    },
    async editTimeSlot(timeSlot) {
      const api = this.$api.query('timeSlot').setMask(TIMESLOT_DATA);
      if (timeSlot.id) {
        const i = this.events.data.findIndex(({ id }) => id === timeSlot.id);
        const { data } = await api.edit(timeSlot.id, { ...timeSlot, campus: this.campus });
        if (i >= 0) {
          this.events.data.splice(i, 1, data);
        } else {
          this.events.data.push(data);
        }
      } else {
        const { data } = await api.create({ ...timeSlot, campus: this.campus });
        this.events.data.push(data);
      }
      this.toggleModal(false);
    },

    async removeTimeSlot({ id }) {
      const api = this.$api.query('timeSlot').setMask(TIMESLOT_DATA);
      if (window && window.confirm('Voulez vous vraiment supprimer cette plage horaire ?')) {
        await api.delete(id);
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
