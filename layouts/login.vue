<template>
  <div class="columns is-gapless">
    <nuxt class="column" />
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
</style>

<style lang="scss">
  @import "~assets/css/head";
  .is-blue-medium {
    background: $blue-medium;
  }
</style>
