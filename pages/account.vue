<template>
  <form
    class="box"
    @submit.prevent="update"
  >
    <ec-field
      label="Identifiant"
      field-id="email"
      :error-message="getErrorMessage('email')"
    >
      <input
        id="email"
        v-model.trim="user.email"
        type="email"
        disabled
        class="input"
        :class="getErrorClass('email')"
      >
    </ec-field>
    <ec-field
      label="Prénom"
      field-id="firstname"
      :error-message="getErrorMessage('firstname')"
    >
      <input
        id="firstname"
        v-model.trim="user.firstname"
        type="text"
        class="input"
        :class="getErrorClass('firstname')"
      >
    </ec-field>
    <ec-field
      label="Nom"
      field-id="name"
      :error-message="getErrorMessage('lastname')"
    >
      <input
        id="name"
        v-model.trim="user.lastname"
        type="text"
        class="input"
        :class="getErrorClass('lastname')"
      >
    </ec-field>
    <ec-field
      label="Mot de passe"
      field-id="password"
      :error-message="getErrorMessage('password')"
    >
      <ec-password
        id="password"
        v-model="user.password"
      />
    </ec-field>
    <ec-button
      type="submit"
      class="button"
      is-primary
      :loading="loading"
      icon-right="save"
    >
      Sauvegarder
    </ec-button>
  </form>
</template>

<script>
import ecPassword from '~/components/form/password.vue';
import toggleLoadingMixin from '~/helpers/mixins/toggle-loading';
import errorsManagementMixin from '~/helpers/mixins/errors-management';
import titleMixin from '~/helpers/mixins/page-title';

const FIELDS = 'id,email,firstname,lastname';

export default {
  components: {
    ecPassword,
  },
  mixins: [
    titleMixin('Mon compte', 'Modification'),
    toggleLoadingMixin(),
    errorsManagementMixin(),
  ],
  async asyncData({ $api }) {
    const { data: user } = await $api.query('jwt').setMask(FIELDS).user();
    return { user };
  },
  methods: {
    async update() {
      return this.raceToggleLoading(() => this.handleCommonErrorsBehavior(async () => {
        const { data: user } = await this.$api.query('users').setMask(FIELDS).edit(this.user.id, this.user);
        this.user = user;
        this.$toast.success('Votre compte utilisateur a bien été mis à jour.');
      }, 'Une erreur est survenue, votre compte n\'a pas été mis à jour.'));
    },
  },
};
</script>
