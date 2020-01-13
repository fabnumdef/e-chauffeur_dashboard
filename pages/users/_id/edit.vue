<template>
  <main>
    <header>
      <h1
        v-if="user.id"
        class="title"
      >
        Utilisateur <em class="is-size-6">#{{ user.id }} : {{ user.email }}</em>
      </h1>
      <h1
        v-else
        class="title"
      >
        Utilisateur
      </h1>
      <h2
        v-if="user.id"
        class="subtitle"
      >
        Modifier
      </h2>
      <h2
        v-else
        class="subtitle"
      >
        Créer
      </h2>
    </header>
    <div class="box">
      <ul>
        <li v-if="gprd">
          Consentement RGPD recueilli le {{ gprd }}
        </li>
        <li v-else>
          Consentement RGPD <strong>non</strong> recueilli.
        </li>
      </ul>
    </div>
    <form
      class="box"
      @submit.prevent="edit(user)"
    >
      <ec-field
        label="Nom (obsolète)"
        field-id="name"
      >
        <input
          id="name"
          :value="user.name"
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
              v-model="user.firstname"
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
              v-model="user.lastname"
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
          v-model="user.email"
          class="input"
        >
      </ec-field>

      <ec-field
        label="Mot de passe"
        field-id="password"
      >
        <ec-password
          id="password"
          v-model="user.password"
        />
      </ec-field>

      <ec-field label="Rôles">
        <role-rules v-model="user.roles" />
      </ec-field>

      <button
        v-if="user.id"
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
import { DateTime } from 'luxon';
import ecField from '~/components/form/field.vue';
import ecPassword from '~/components/form/password.vue';
import roleRules from '~/components/form/role-rules.vue';

export default {
  components: {
    roleRules,
    ecField,
    ecPassword,
  },
  props: {
    user: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    gprd() {
      return this.user && this.user.gprd && DateTime.fromISO(this.user.gprd).toLocaleString(DateTime.DATETIME_MED);
    },
  },
  methods: {
    async edit(user) {
      let data = {};
      try {
        if (user.id) {
          ({ data } = (await this.$api.users.patchUser(
            user.id,
            user,
            'id,name,firstname,lastname,email,roles(role,campuses(id,name)',
            {},
          )));
        } else {
          ({ data } = (await this.$api.users.postUser(
            user,
            'id,name,firstname,lastname,email,roles(role,campuses(id,name)',
            {},
          )));
        }

        this.$router.push({
          name: 'users-id-edit',
          params: { id: data.id },
        });
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
