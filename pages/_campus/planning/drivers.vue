<template>
  <div>
    <div class="box">
      <div class="title">
        Planning
      </div>
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
                {{ option.firstname }} {{ option.lastname }}
              </template>
              <template #tag="{option, search, remove}">
                <span class="multiselect__tag">
                  <span v-if="option.firstname || option.lastname">{{ option.firstname }} {{ option.lastname }}</span>
                  <span v-else>{{ option.id }}</span>
                  <i
                    aria-hidden="true"
                    tabindex="1"
                    class="multiselect__tag-icon"
                    @keypress.enter.prevent="remove(option)"
                    @mousedown.prevent="remove(option)"
                  />
                </span>
                <span class="multiselect-tag" />
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
            class="button create-timeslot is-expanded"
            @click="openCreate()"
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
              <header>
                <span class="hours">
                  {{ content.start.toLocaleString(TIME_SIMPLE) }} - {{ content.end.toLocaleString(TIME_SIMPLE) }}
                </span>
                <span class="is-pulled-right">
                  <fa-icon icon="user-circle" /> {{ content.drivers.length }}({{ drivers.data.length }})
                </span>
              </header>
              <ul class="drivers-list">
                <li
                  v-for="driver of content.drivers"
                  :key="driver.id"
                >
                  <span v-if="driver.firstname || driver.lastname">{{ driver.firstname }} {{ driver.lastname }}</span>
                  <span v-else>{{ driver.id }}</span>
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
const TIMESLOT_DATA = `id,start,end,drivers(${DRIVER_DATA})`;
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
  .box {
    .title {
      color: $black;
    }
    &.driver-box {
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
    padding: $size-small;
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
  /deep/ .vuecal__event {
    background: $success;
    color: $white;
    padding: 8px;
    header {
      text-align: left;
      .hours {
        font-weight: bold;
      }
    }
    .drivers-list {
      font-weight: bold;
    }
  }
</style>
