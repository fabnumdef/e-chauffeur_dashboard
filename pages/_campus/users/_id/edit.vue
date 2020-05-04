<template>
  <form
    class="box"
    @submit.prevent="edit(data, $event)"
  >
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
        type="text"
        class="input"
        :class="getErrorClass('email')"
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
      label="Permis"
      field-id="licences"
      :error-message="getErrorMessage('licences')"
    >
      <vue-multiselect
        v-model="licences"
        multiple
        :options="['B', 'C', 'D']"
        placeholder="Renseignez la liste des permis"
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
  </form>
</template>


<script>
import { mapGetters } from 'vuex';
import ecPassword from '~/components/form/password.vue';
import toggleLoading from '~/helpers/mixins/toggle-loading';
import errorsManagementMixin from '~/helpers/mixins/errors-management';
import resetableMixin from '~/helpers/mixins/reset-data';
import titleMixin from '~/helpers/mixins/page-title';
import saveButton, { NEXT_ACTION_KEY, NEXT_ACTION_LIST, NEXT_ACTION_NEW } from '~/components/crud/save-button.vue';
import roleRules from '~/components/form/role-only.vue';

export default {
  components: {
    ecPassword,
    roleRules,
    saveButton,
  },
  mixins: [
    toggleLoading(),
    titleMixin('Utilisateur', 'Création'),
    errorsManagementMixin(),
    resetableMixin(function reset() {
      return {
        data: {
          ...this.user,
        },
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
    ...mapGetters({
      campus: 'context/campus',
    }),
    isDriver() {
      return this.user.roles && !!this.user.roles.find(({ role }) => role === 'ROLE_DRIVER');
    },
    licences: {
      get() {
        return this.data.licences.length > 0 ? this.data.licences : ['B'];
      },
      set(licences) {
        this.data.licences = licences;
      },
    },
  },
  methods: {
    async edit(user, { submitter }) {
      return this.raceToggleLoading(() => this.handleCommonErrorsBehavior(async () => {
        const ApiUsers = this.$api.query('users')
          .setMask('id,email,firstname,lastname,roles(role),licences')
          .setCampus(this.campus.id);
        const formattedUser = {
          ...user,
          campus: this.campus,
        };
        let data = {};
        if (this.id) {
          ({ data } = (await ApiUsers.edit(user.id, formattedUser)));
        } else {
          ({ data } = (await ApiUsers.create(formattedUser)));
        }
        this.$toast.success('Chauffeur enregistré avec succès');
        switch (submitter.getAttribute(NEXT_ACTION_KEY)) {
          case NEXT_ACTION_NEW:
            this.reset();

            return this.$router.push(this.$context.buildCampusLink('users-new'));
          case NEXT_ACTION_LIST:
            return this.$router.push(this.$context.buildCampusLink('users'));
          default:
            return this.$router.push(this.$context.buildCampusLink('users-id-edit', {
              params: { id: data.id },
            }));
        }
      }));
    },
  },
};
</script>
