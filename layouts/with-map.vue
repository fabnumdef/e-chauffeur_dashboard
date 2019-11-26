<template>
  <div class="columns is-gapless">
    <ec-sidemenu class="column is-narrow is-menu" />
    <nuxt class="column content-col" />
    <ec-map
      v-if="!hideMap"
      class="column is-map"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ecSidemenu from '~/components/sidemenu.vue';
import ecMap from '~/components/map.vue';

export default {
  components: {
    ecSidemenu,
    ecMap,
  },
  computed: {
    ...mapGetters({ hideMap: 'context/hideMap' }),
  },
  head() {
    return {
      bodyAttrs: {
        class: 'has-background',
      },
    };
  },
};
</script>

<style scoped lang="scss">
  @import "~assets/css/head";

  .is-menu {
    padding-right: 0;
    background: $blue-dark;
    margin-bottom: -$size-small;
    min-height: 100vh;
  }
  .column.content-col {
    padding: $size-medium !important;
  }
  .columns {
    height: 100%;
  }
  .is-map {
    margin-bottom: -$size-small * 2;
  }
</style>

<style lang="scss">
  @import "~assets/css/head";
  body.has-background {
    background: $background;
  }
</style>
