<template>
  <div>
    <div class="box">
      <div class="title">Planning</div>
      <client-only>
        <ec-modal
          :active="isModalOpen"
          :with-background="false"
          @toggle-modal="toggleModal"
          @submit="editTimeSlot(timeSlot)"
        >
          <template
            v-if="timeSlot.id"
            #title
          >
            Edition du slot #{{ timeSlot.id }}
          </template>
          <template
            v-else
            #title
          >
            Créer un nouveau slot
          </template>
          <ec-field label="Dates">
            <date-time
              lang="fr"
              append-to-body
              input-class="input"
              type="datetime"
              range
              :value="range"
              :minute-step="5"
              format="YYYY-MM-DD HH:mm"
              range-separator="->"
              @input="updateDates"
            >
              <template #calendar-icon>
                <fa-icon icon="calendar" />
              </template>
            </date-time>
          </ec-field>
          <ec-field label="Chauffeurs">
            <vue-multiselect
              v-model="timeSlot.drivers"
              :options="drivers.data"
              track-by="id"
              multiple
              label="name"
              :show-labels="false"
            >
              <template #option="{option}">
                {{ option }}{{ option.firstname }} {{ option.lastname }}
              </template>
              <template #tag="{option}">
                {{ option }}{{ option.firstname }} {{ option.lastname }}
              </template>
            </vue-multiselect>
          </ec-field>
          <template
            v-if="timeSlot.id"
            #submit
          >
            <button
              type="submit"
              class="button is-primary"
            >
              Modifier
            </button>
            <button
              type="button"
              class="button is-danger"
              @click="removeTimeSlot(timeSlot)"
            >
              Supprimer
            </button>
          </template>
          <template
            v-else
            #submit
          >
            <button
              type="submit"
              class="button is-success"
            >
              Créer
            </button>
          </template>
        </ec-modal>
      </client-only>
      <main class="columns">
        <aside class="column is-one-quarter">
          <button
            class="button"
            @click="openCreate()"
          >
            Configurer un nouveau créneau
          </button>
          <ul>
            <li
              v-for="driver of drivers.data"
              :key="driver.id"
            >
              {{ driver.firstname }} {{driver.lastname}}
            </li>
          </ul>
        </aside>
        <client-only>
          <vue-cal
            class="column"
            default-view="week"
            hide-view-selector
            :hide-weekdays="[6, 7]"
            locale="fr"
            :disable-views="['years', 'year', 'month', 'day']"
            :events="calEvents"
            @cell-click="openCreate"
            @event-focus="openEdit"
          >
            <template #event-renderer="{ event: {content}, view }">
              {{ content.start.toLocaleString(TIME_SIMPLE) }}
              {{ content.end.toLocaleString(TIME_SIMPLE) }}
              <ul>
                <li
                  v-for="driver of content.drivers"
                  :key="driver.id"
                >
                  {{ driver.id }}
                </li>
              </ul>
            </template>
          </vue-cal>
        </client-only>
      </main>
    </div>
  </div>
</template>
<script>
// @todo : refactor to use our fork
import vueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import 'vue-cal/dist/i18n/fr';
import { DateTime } from 'luxon';
import ecModal from '~/components/modal.vue';
import ecField from '~/components/form/field.vue';

const DRIVER_DATA = 'id,firstname,lastname';
const TIMESLOT_DATA = 'id,start,end,drivers(id,firstname,lastname)';
const newTimeSlot = () => ({
  start: null,
  end: null,
  drivers: [],
});
export default {
  components: { ecModal, ecField, vueCal },
  computed: {
    ...['TIME_SIMPLE']
      .map((f) => ({ [f]: () => DateTime[f] }))
      .reduce((acc, cur) => Object.assign(acc, cur), {}),
    range() {
      return [
        this.timeSlot.start || null,
        this.timeSlot.end || null,
      ];
    },
    calEvents() {
      return this.events.data.map((event) => {
        const start = DateTime.fromISO(event.start);
        const end = DateTime.fromISO(event.end);
        return {
          startDate: start.toJSDate(),
          endDate: end.toJSDate(),
          content: {
            ...event,
            start,
            end,
          },
        };
      });
    },
  },
  async asyncData({ $api, params, query }) {
    // @todo: paginate
    const offset = parseInt(query.driver_offset, 10) || 0;
    const limit = parseInt(query.driver_limit, 10) || 30;
    const week = query.week ? DateTime.fromISO(query.week) : DateTime.local();
    const after = week.startOf('week').toJSDate();
    const before = week.endOf('week').toJSDate();
    const drivers = await $api.drivers(params.campus, DRIVER_DATA).getDrivers(offset, limit);
    const events = await $api.timeSlot(TIMESLOT_DATA, params.campus)
      .getTimeSlotsBetween(after, before);
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
    };
  },
  methods: {
    toggleModal(val) {
      this.isModalOpen = typeof val !== 'undefined' ? val : this.modalOpen;
    },
    async editTimeSlot(timeSlot) {
      const api = this.$api.timeSlot(TIMESLOT_DATA, { id: this.campusId });
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
    openCreate(date = new Date()) {
      const d = DateTime.fromJSDate(date);
      this.timeSlot = Object.assign(
        newTimeSlot(),
        { start: d.startOf('hour').toJSDate(), end: d.endOf('hour').toJSDate() },
      );
      this.toggleModal(true);
    },
    openEdit({ content: timeSlot }) {
      this.timeSlot = timeSlot;
      this.toggleModal(true);
    },
    async removeTimeSlot({ id }) {
      const api = this.$api.timeSlot(TIMESLOT_DATA, { id: this.campusId });
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
  .box .title {
    color: $black;
  }
</style>
