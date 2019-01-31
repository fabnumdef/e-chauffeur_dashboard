<template>
  <div class="columns is-gapless">
    <nuxt class="column" />
    <div class="column is-hidden-mobile is-hidden-tablet-only">
      <img src="/logo.svg" alt="" /> <!-- @todo: replace with lfs picture -->
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      bodyAttrs: {
        class: 'is-blue-medium',
      },
    };
  },
};
</script>

<style lang="scss">
  @import "~assets/css/head";
  .is-blue-medium {
    background: $blue-medium;
  }
</style>
