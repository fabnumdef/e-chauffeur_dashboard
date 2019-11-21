<template>
  <main>
    <div class="logo">
      <img
        alt="e-Chauffeur"
        src="/logo.svg"
      >
    </div>
    <form
      class="container"
      @submit.prevent="login(user)"
    >
      <ec-field
        label="Email"
        field-id="email"
        :icon-left="['fas', 'user']"
      >
        <input
          id="email"
          v-model="user.email"
          required="required"
          class="input"
          type="email"
          placeholder="john@doe.com"
          autofocus="autofocus"
        >
      </ec-field>

      <ec-field
        label="Mot de passe"
        field-id="password"
        :icon-left="['fas', 'key']"
      >
        <input
          id="password"
          v-model="user.password"
          required="required"
          class="input"
          type="password"
        >
      </ec-field>

      <div class="field login is-grouped">
        <div class="control">
          <button class="button">
            Me connecter
          </button>
        </div>
      </div>
    </form>
  </main>
</template>

<script>
import ecField from '~/components/form/field';

export default {
  layout: 'side-picture',
  components: {
    ecField,
  },
  async asyncData() {
    return {
      user: {
        email: null,
        password: null,
      },
    };
  },
  methods: {
    async login(data) {
      try {
        await this.$auth.login({ data });
        this.$router.push('/');
        this.$toast.success('Bienvenue !');
      } catch ({ response: { status }, message }) {
        switch (status) {
          case 404:
            this.$toast.error('Impossible de se connecter, l\'utilisateur n\'existe pas. '
              + 'Merci de vérifier votre identifiant.\n'
              + 'Si le problème persiste, contactez nous pour confirmer votre identifiant.');
            break;
          case 403:
            this.$toast.error('Impossible de se connecter, le mot de passe est incorrect. '
              + 'Merci de retaper votre mot de passe.\n'
              + 'Si le problème persiste, contactez nous pour réinitialiser votre mot de passe.');
            this.user.password = null;
            break;
          case 401:
            this.$toast.error('Impossible de se connecter, le mot de passe a expiré. '
                + 'Contactez nous pour le réinitialiser.');
            break;
          default:
            this.$toast.error('Une erreur est survenue, merci de vérifier votre email et mot de passe. \n'
            + 'Si le problème persiste, contactez nous pour réinitialiser votre mot de passe.');
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
  @import "~assets/css/head";
  .logo {
    padding: 50px;
    display: block;
  }
  /deep/ .label {
    color: $white;
    text-align: left;
    margin-left: 32px;
    font-weight: normal;
    font-size: $size-6;
  }
  /deep/ .input {
    border: 0;
    border-bottom: 1px solid;
    box-shadow: none;
  }
  .container {
    margin: 10px auto;
    width: 100%;
    max-width: 400px;
  }
  /deep/ .field.login {
    .control {
      width: 100%;
    }
    .button {
      display: block;
      padding: 10px 20px;
      height: auto;
      width: 100%;
      color: $primary;
      font-weight: bold;
    }
  }
</style>
