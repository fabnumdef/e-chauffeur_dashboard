<template>
  <div class="columns is-gapless">
    <nuxt class="column" />
    <div class="column is-hidden-mobile is-hidden-tablet-only background-column" />
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
<style scoped lang="scss">
  @import "~assets/css/head";
  /deep/ .input,
  /deep/ .control .icon,
  /deep/ .control .input:focus ~ .icon {
    color: $text-invert;
    border-color: $text-invert;
  }
  /deep/ ::placeholder {
    color: rgba($white, 0.6);
  }
  .background-column {
    background: url('/background.jpg') center center;
    background-size: cover;
    min-height: 100vh;
  }
</style>

<style lang="scss">
  @import "~assets/css/head";
  .is-blue-medium {
    background: $blue-medium;
  }
</style>
