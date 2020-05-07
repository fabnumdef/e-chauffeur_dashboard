<template>
  <form
    @submit.prevent="edit(data, $event)"
  >
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
    <div class="box">
      <div class="columns">
        <div class="column">
          <ec-field
            label="Prénom"
            field-id="firstname"
            :error-message="getErrorMessage('firstname')"
          >
            <input
              id="firstname"
              v-model.trim="data.firstname"
              class="input"
              :class="getErrorClass('firstname')"
              autocomplete="off"
            >
          </ec-field>
        </div>
        <div class="column">
          <ec-field
            label="Nom de famille"
            field-id="lastname"
            :error-message="getErrorMessage('lastname')"
          >
            <input
              id="lastname"
              v-model.trim="data.lastname"
              class="input"
              :class="getErrorClass('lastname')"
              autocomplete="off"
            >
          </ec-field>
        </div>
      </div>
      <ec-field
        label="Email"
        field-id="email"
        :error-message="getErrorMessage('email')"
      >
        <input
          id="email"
          v-model.trim="data.email"
          class="input"
          :class="getErrorClass('email')"
          autocomplete="off"
        >
      </ec-field>

      <ec-field
        label="Mot de passe"
        field-id="password"
        :error-message="getErrorMessage('password')"
      >
        <ec-password
          id="password"
          v-model="data.password"
          :class="getErrorClass('password')"
        />
      </ec-field>

      <ec-field
        label="Rôles"
        :error-message="getErrorMessage('roles')"
      >
        <role-rules
          v-model="data.roles"
          :class="getErrorClass('roles')"
        />
      </ec-field>

      <save-button
        :loading="loading"
        :is-new="!id"
        has-alt
      />
    </div>
  </form>
</template>


<script>
import { DateTime } from 'luxon';
import ecPassword from '~/components/form/password.vue';
import roleRules from '~/components/form/role-rules.vue';
import toggleLoading from '~/helpers/mixins/toggle-loading';
import errorsManagementMixin from '~/helpers/mixins/errors-management';
import resetableMixin from '~/helpers/mixins/reset-data';
import titleMixin from '~/helpers/mixins/page-title';
import saveButton, { saveButtonHandler } from '~/components/crud/save-button.vue';

export default {
  components: {
    saveButton,
    ecPassword,
    roleRules,
  },
  mixins: [
    toggleLoading(),
    titleMixin('Utilisateur', 'Création'),
    errorsManagementMixin(),
    resetableMixin(function reset() {
      return {
        data: { ...this.user },
      };
    }),
  ],
  props: {
    user: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    const { id } = this.user;
    this.setTitle(id ? `Utilisateur #${id}` : 'Utilisateur', id ? 'Édition' : 'Création');
    return { id };
  },
  computed: {
    gprd() {
      return this.user && this.user.gprd && DateTime.fromISO(this.user.gprd).toLocaleString(DateTime.DATETIME_MED);
    },
  },
  methods: {
    async edit(user, event) {
      return this.raceToggleLoading(() => this.handleCommonErrorsBehavior(async () => {
        const ApiUsers = this.$api.query('users').setMask('id,firstname,lastname,email,roles(role,campuses(id,name))');
        let data = {};
        if (this.id) {
          ({ data } = (await ApiUsers.edit(user.id, user)));
        } else {
          ({ data } = (await ApiUsers.create(user)));
        }
        this.$toast.success('Utilisateur enregistrée avec succès');
        return saveButtonHandler.call(this, event, {
          baseRoute: 'users',
          routeParams: data,
        });
      }));
    },
  },
};
</script>
