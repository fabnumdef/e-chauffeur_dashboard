<template>
  <div class="columns is-gapless">
    <ec-sidemenu class="column is-narrow is-menu" />
    <main class="column content-col">
      <header v-if="meta.title">
        <h1 class="title">
          {{ meta.title }}
        </h1>
        <h2
          v-if="meta.subtitle"
          class="subtitle"
        >
          {{ meta.subtitle }}
        </h2>
      </header>
      <nuxt />
    </main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ecSidemenu from '~/components/sidemenu.vue';

export default {
  components: {
    ecSidemenu,
  },
  computed: {
    ...mapGetters({ meta: 'context/meta' }),
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
