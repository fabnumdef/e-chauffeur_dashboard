<template>
  <div class="columns is-gapless">
    <ec-sidemenu class="column is-narrow is-menu" />
    <nuxt class="column content-col" />
  </div>
</template>

<script>
import ecSidemenu from '~/components/sidemenu.vue';

export default {
  components: {
    ecSidemenu,
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
