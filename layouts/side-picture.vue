<template>
  <div class="columns is-gapless">
    <nuxt class="column" />
    <div class="column is-hidden-mobile is-hidden-tablet-only background-column">
      <img src="/hand-app.png" alt="logo-picto-application">
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
<style scoped lang="scss">
  @import "~assets/css/head";
  /deep/ .input,
  /deep/ .control .icon,
  /deep/ .control .input:focus ~ .icon {
    color: $blue-light;
    border-color: $blue-light;
  }
  /deep/ ::placeholder {
    color: rgba($blue-medium, 0.6);
  }
  .column {
    position: relative;
    min-height: 100vh;
  }
  .background-column {
    background-color: $blue-light;
    background-size: cover;
    min-height: 100vh;
    display: flex;
    align-items: center;
    overflow: hidden;
    img {
      transform: rotateY(180deg);
    }
  }
</style>
