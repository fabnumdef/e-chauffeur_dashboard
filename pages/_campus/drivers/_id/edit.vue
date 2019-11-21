<template>
  <main>
    <header>
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
        label="Nom (obsolète)"
        field-id="name"
      >
        <input
          id="name"
          :value="driver.name"
          class="input"
          disabled
        >
      </ec-field>
      <div class="columns">
        <div class="column">
          <ec-field
            label="Prénom"
            field-id="firstname"
          >
            <input
              id="firstname"
              v-model="driver.firstname"
              class="input"
            >
          </ec-field>
        </div>
        <div class="column">
          <ec-field
            label="Nom de famille"
            field-id="lastname"
          >
            <input
              id="lastname"
              v-model="driver.lastname"
              class="input"
            >
          </ec-field>
        </div>
      </div>
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
        <ec-password
          id="password"
          v-model="driver.password"
        />
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
import ecPassword from '~/components/form/password';

const EDITABLE_FIELDS = ['id', 'email', 'password', 'name'];

export default {
  components: {
    ecField,
    ecPassword,
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
      try {
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
      } catch (e) {
        let message = 'Une erreur est survenue durant la création / édition de l\'utilisateur';
        if (e.response && e.response.data && e.response.data.errors && e.response.data.errors.email
          && e.response.data.whitelistDomains) {
          message += ` :
          ${e.response.data.errors.email.value} devrait se terminer par `
            + `"${e.response.data.whitelistDomains.join(' ou ')}"`;
        }
        this.$toast.error(message);
      }
    },
  },
};
</script>
