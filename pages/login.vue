<template>
  <main>
    <div
      v-if="!isFF"
      class="warning-banner"
    >
      Attention : e-Chauffeur ne fonctionne que sous Firefox
    </div>
    <div class="logo">
      <img
        alt="e-Chauffeur"
        src="/logo_ec_blue.svg"
      >
    </div>
    <form
      class="container"
      @submit.prevent="login(user)"
    >
      <h1 class="title">
        Bienvenue
      </h1>
      <ec-field
        label="Email"
        field-id="email"
        :icon-left="['fas', 'user']"
      >
        <input
          id="email"
          v-model.trim="user.email"
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
          placeholder=""
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
    <div class="logo-container">
      <img
        class="logo"
        src="/logo_dirisi.png"
        alt="DIRISI"
      >
      <span class="logo">
        <img
          src="/logo_ma.png"
          alt="Ministère des armées"
        >
        <img
          src="/start_up_etat.png"
          alt="Start-up d'état"
        >
      </span>
      <img
        class="logo"
        src="/logo_fab_num.png"
        alt="Fabrique numérique"
      >
    </div>
  </main>
</template>

<script>
export default {
  layout: 'side-picture',
  async asyncData() {
    return {
      user: {
        email: null,
        password: null,
      },
      isFF: true,
    };
  },
  mounted() {
    this.isFF = navigator.userAgent.includes('Firefox');
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

  main {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    .logo {
      padding: 50px;
      align-self: start;
    }
    form {
      .title {
        margin: 2em 0;
        color: $primary;
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
      /deep/ .field.login {
        .control {
          width: 100%;
        }
        .button {
          display: block;
          margin-top: 2em;
          padding: 10px 20px;
          height: auto;
          width: 100%;
          background-color: $primary;
          color: white;
          font-weight: bold;
        }
      }
    }
    .logo-container {
      text-align: center;
      margin-bottom: 2em;
      .logo {
        padding: 0;
        margin: 0 2em;
      }
    }
  }

  .container {
    margin: 10px auto;
    width: 100%;
    max-width: 400px;
  }

  .warning-banner {
    background-color: $danger;
    color: $white;
    font-weight: bold;
    text-transform: uppercase;
    text-align: center;
    position: fixed;
    top: 0;
    right: 0;
    width: 100vw;
    padding: .8em;
    z-index: 10;
  }

  @media screen and (max-width: 600px) {
    main {
      padding: 1em;
      .title {
        text-align: center;
      }
    }

  }
</style>
