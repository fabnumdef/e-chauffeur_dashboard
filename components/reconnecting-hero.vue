<template>
  <div
    v-if="isReconnecting"
    class="notification reconnecting"
  >
    <div class="container">
      <p>
        Aucune connection avec le serveur (API).
      </p>
      <p>
        Merci de vérifier votre connexion.
      </p>
      <p>
        Si le problème persiste, contactez le service.
      </p>
      <p>
        <fa-icon
          :icon="['fas', 'spinner']"
          :pulse="true"
        />&nbsp;
        Tentative de reconnection en cours
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['isReconnecting']),
  },
};
</script>

<style lang="scss" scoped>
  @import "~assets/css/head";

  .reconnecting {
    padding: $size-small;
    background-color: $red;
    color: $white;
    font-weight: bold;
    font-size: $size-small;
  }

</style>
