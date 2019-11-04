<template>
  <main>
    <header>
      <h1
        v-if="user && id"
        class="title"
      >
        Chauffeur <em class="is-size-6">#{{ user.id }} : {{ user.email }}</em>
      </h1>
      <h1
        v-else
        class="title"
      >
        Utilisateur
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
          v-model="user.password"
          type="password"
          class="input"
        >
      </ec-field>
      <ec-field label="Rôles">
        <role-rules v-model="user.roles" />
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
import roleRules from '~/components/form/role-only';

const EDITABLE_FIELDS = ['id', 'email', 'password', 'name', 'firstname', 'lastname', 'roles(role)'];

export default {
  components: {
    ecField,
    roleRules,
  },
  props: {
    user: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return { id: this.user.id };
  },
  computed: {
    ...mapGetters({
      campus: 'context/campus',
    }),
  },
  methods: {
    async edit(user) {
      let data = {};
      if (user.id) {
        ({ data } = (await this.$api
          .campusUsers(this.campus.id, EDITABLE_FIELDS.join(','))
          .patchUser(user.id, user)));
      } else {
        ({ data } = (await this.$api.campusUsers(this.campus.id, EDITABLE_FIELDS.join(',')).postUser(user)));
      }

      this.$router.push(
        this.$context.buildCampusLink('users-id-edit', {
          params: { id: data.id },
        }),
      );
    },
  },
};
</script>
