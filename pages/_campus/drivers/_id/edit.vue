<template>
  <main>
    <header>
      <nuxt-link
        v-if="driver && driver.id"
        :to="campusLink('drivers-id-calendar')"
        class="button is-primary is-pulled-right"
      >
        <span class="icon is-small">
          <fa-icon :icon="['fas', 'calendar-alt']" />
        </span>
        <span>Calendrier</span>
      </nuxt-link>
      <h1
        v-if="driver && id"
        class="title"
      >
        Chauffeur <em class="is-size-6">#{{ driver.id }} : {{ driver.email }}</em>
      </h1>
      <h1
        v-else
        class="title"
      >
        Chauffeur
      </h1>
      <h2
        v-if="id"
        class="subtitle"
      >
        Modification
      </h2>
      <h2
        v-else
        class="subtitle"
      >
        Création
      </h2>
    </header>
    <form
      class="box"
      @submit.prevent="edit(driver)"
    >
      <ec-field
        label="Nom"
        field-id="name"
      >
        <input
          id="name"
          v-model="driver.name"
          type="text"
          class="input"
        >
      </ec-field>
      <ec-field
        label="Email"
        field-id="email"
      >
        <input
          id="email"
          v-model="driver.email"
          type="text"
          class="input"
        >
      </ec-field>
      <ec-field
        label="Mot de passe"
        field-id="password"
      >
        <input
          id="password"
          v-model="driver.password"
          type="password"
          class="input"
        >
      </ec-field>
      <button
        v-if="id"
        type="submit"
        class="button is-primary"
      >
        <span class="icon is-small">
          <fa-icon :icon="['fas', 'save']" />
        </span>
        <span>Sauvegarder</span>
      </button>

      <button
        v-else
        type="submit"
        class="button is-primary"
      >
        <span class="icon is-small">
          <fa-icon :icon="['fas', 'plus']" />
        </span>
        <span>Créer</span>
      </button>
    </form>
  </main>
</template>

<script>
import { mapGetters } from 'vuex';
import ecField from '~/components/form/field.vue';

const EDITABLE_FIELDS = ['id', 'email', 'password', 'name'];

export default {
  components: {
    ecField,
  },
  props: {
    driver: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return { id: this.driver.id };
  },
  computed: {
    ...mapGetters({
      campus: 'context/campus',
    }),
  },
  methods: {
    async edit(driver) {
      let data = {};
      if (driver.id) {
        ({ data } = (await this.$api
          .drivers(this.campus.id, EDITABLE_FIELDS.join(','))
          .patchDriver(driver.id, driver)));
      } else {
        ({ data } = (await this.$api.drivers(this.campus.id, EDITABLE_FIELDS.join(',')).postDriver(driver)));
      }

      this.$router.push(
        this.$context.buildCampusLink('drivers-id-edit', {
          params: { id: data.id },
        }),
      );
    },
  },
};
</script>
