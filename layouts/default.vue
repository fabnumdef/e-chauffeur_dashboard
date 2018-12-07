<template>
  <div class="columns">
    <EcSidemenu class="column is-narrow is-menu" />
    <Nuxt class="column" />
    <EcMap class="column is-map" />
  </div>
</template>
<script>
import ecSidemenu from '~/components/sidemenu.vue';
import ecMap from '~/components/map.vue';

export default {
  components: {
    ecSidemenu,
    ecMap,
  },
};
</script>

<style scoped lang="scss">
  @import "~assets/css/head";

  .is-menu {
    padding-right: 0;
    background: $blue-dark;
    margin-bottom: -$size-small;
  }
  .columns {
    height: 100%;
  }
  .is-map {
    margin-bottom: -$size-small * 2;
  }
</style>
