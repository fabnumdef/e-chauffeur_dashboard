<template>
  <div>
    <div class="box">
      <div class="title columns">
        <div class="column aside is-one-quarter">
          Indisponibilité Véhicules
        </div>
        <div class="column">
          <nuxt-link
            class="button switch-planning"
            :to="campusLink('planning-drivers')"
          >
            <fa-icon icon="user-circle" /> <fa-icon icon="car" />
          </nuxt-link>
        </div>
      </div>
      <planning-modal
        :active="isModalOpen"
        :time-slot="timeSlot"
        :cars="cars"
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
            <fa-icon icon="car" /> Configurer un nouveau créneau
          </button>
          <div class="drivers-expander">
            <span>Véhicules</span>
          </div>
          <ul>
            <li
              v-for="car of cars.data"
              :key="car.id"
              class="box driver-box"
              draggable="true"
              @dragstart="dragstart($event, car)"
              @dragend="dragend"
            >
              {{ car.id }} {{ car.label }} {{ car.model.label }}
              <nuxt-link
                class="config-button is-pulled-right"
                :to="campusLink('cars-id-edit', {params:{id: car.id}})"
              >
                <fa-icon icon="cog" />
              </nuxt-link>
            </li>
          </ul>
        </aside>
        <planning-calendar
          :is-grabbing="isGrabbing"
          :events="calEvents"
          :cars="cars"
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
import planningModal from '~/components/planning/cars/modal.vue';
import planningCalendar from '~/components/planning/cars/calendar.vue';

const CARS_DATA = 'id,label,model(label)';
const TIMESLOT_DATA = `id,start,end,cars(${CARS_DATA})`;
const newTimeSlot = () => ({
  start: null,
  end: null,
  cars: [],
  drivers: null,
});
export default {
  components: { planningModal, planningCalendar },
  async asyncData({ $api, params, query }) {
    // @todo: paginate
    const week = query.week ? DateTime.fromISO(query.week) : DateTime.local();
    const after = week.startOf('week').toJSDate();
    const before = week.endOf('week').toJSDate();
    const offset = parseInt(query.offset, 10) || 0;
    const limit = parseInt(query.limit, 10) || 30;
    const cars = await $api.cars({ id: params.campus }, CARS_DATA).getCars(offset, limit);
    const events = await $api.timeSlot(TIMESLOT_DATA, params.campus)
      .getCarsTimeSlotsBetween(after, before);
    return {
      timeSlot: newTimeSlot(),
      cars: {
        data: cars.data,
        pagination: cars.pagination,
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
        .getCarsTimeSlotsBetween(startDate, endDate);
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
    dragstart(event, car) {
      this.isGrabbing = true;
      event.dataTransfer.setData('application/json', JSON.stringify(car));
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
    /deep/ .fa-car {
      position: absolute;
      left: 4px;
      color: $white;
      background: $orange;
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
      left: 0px;
      color: $grey;
      padding: 7px;
      box-sizing: initial;
      border-radius: $gap;
    }
    /deep/ .fa-car {
      position: absolute;
      background: $orange;
      right: 0px;
      color: $white;
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
