<template>
  <main>
    <header>
      <nuxt-link
        :to="{name: 'users-id-edit' }"
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
        Utilisateur <em class="is-size-6">#{{ user.id }}</em>
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
        :opening-hours="user.workingHours"
        :modal-status="modalOpen"
        with-current-time
        @modal-submit="edit(event)"
        @dates-update="updateDates"
        @opening-hours-update="updateWorkingHours"
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
    <form
      class="box"
      @submit.prevent="updateWorkingHours(user.workingHours)"
    >
      <ec-field
        label="Horaires de travail"
        field-id="workingHours"
      >
        <input
          id="workingHours"
          v-model="user.workingHours"
          type="text"
          class="input"
        >
      </ec-field>
      <button
        type="submit"
        class="button is-primary"
      >
        <span class="icon is-small">
          <fa-icon :icon="['fas', 'save']" />
        </span>
        <span>Sauvegarder</span>
      </button>
    </form>
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
    user: {
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
      ].map((l) => (l && l.toJSDate ? l.toJSDate() : null));
    },
  },
  async asyncData({ $api, route } = {}) {
    const { data } = await $api.userEvents({ id: route.params.id }, 'start,end,title').getUserEvents();
    return { events: data };
  },
  methods: {
    async edit(event) {
      const { data } = await this.$api.userEvents({ id: this.$route.params.id }, 'start,end,title').postUserEvent({
        start: event.start,
        end: event.end,
        title: event.title,
      });
      this.toggleModal(false);
      this.events.push(data);
    },
    updateDates([start, end]) {
      this.event.start = start instanceof DateTime ? start : DateTime.fromJSDate(start);
      this.event.end = end instanceof DateTime ? end : DateTime.fromJSDate(end);
    },
    async updateWorkingHours(oh) {
      this.user.workingHours = oh;
      const { data } = (await this.$api.users.patchUser(
        this.user.id,
        this.user,
        'id,email,roles(role,campuses(id,name),workingHours',
      )
      );
      Object.assign(this.user, data);
    },
    toggleModal(newStatus = false) {
      this.modalOpen = newStatus;
    },
  },
};
</script>
