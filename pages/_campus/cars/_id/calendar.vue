<template>
  <main>
    <header>
      <nuxt-link
        :to="campusLink('cars-id-edit', { params: { campus } })"
        class="button is-primary is-pulled-right"
      >
        <span class="icon is-small">
          <fa-icon :icon="['fas', 'edit']" />
        </span>
        <span>Modifier</span>
      </nuxt-link>
      <h1
        class="title"
      >
        Véhicule <em>{{ car.id }}</em>
      </h1>
      <h2
        class="subtitle"
      >
        Calendrier
      </h2>
    </header>
    <div class="box">
      <vue-calendar
        :events="events"
        :modal-status="modalOpen"
        @modal-submit="edit(event)"
        @dates-update="updateDates"
        @modal-toggle="toggleModal"
      >
        <template slot="modal">
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
          <ec-field
            label="Label"
            field-id="label"
          >
            <input
              id="label"
              v-model="event.title"
              type="text"
              class="input"
            >
          </ec-field>
        </template>
      </vue-calendar>
    </div>
  </main>
</template>
<script>
import { DateTime } from 'luxon';
import ecField from '~/components/form/field.vue';
import vueCalendar from '~/components/calendar.vue';

const generateEmptyEvent = () => ({
  title: null,
  start: null,
  end: null,
  interval: null,
});

export default {
  components: {
    ecField,
    vueCalendar,
  },
  props: {
    car: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      event: generateEmptyEvent(),
      modalOpen: false,
    };
  },
  computed: {
    range() {
      return [
        this.event.start || null,
        this.event.end || null,
      ].map(l => (l && l.toJSDate ? l.toJSDate() : null));
    },
  },
  async asyncData({ params, $api, route } = {}) {
    const { data } = await $api.carEvents({ id: route.params.id }, 'start,end,title').getCarEvents();
    return {
      events: data,
      campus: params.campus,
    };
  },
  methods: {
    async edit(event) {
      const { data } = await this.$api.carEvents({ id: this.$route.params.id }, 'start,end,title').postCarEvent({
        start: event.start,
        end: event.end,
        title: event.title,
      });
      this.events.push(data);
      this.toggleModal(false);
    },
    updateDates([start, end]) {
      this.event.start = start instanceof DateTime ? start : DateTime.fromJSDate(start);
      this.event.end = end instanceof DateTime ? end : DateTime.fromJSDate(end);
    },
    toggleModal(newStatus = false) {
      this.modalOpen = newStatus;
    },
  },
};
</script>
