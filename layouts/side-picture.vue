<template>
  <div class="columns is-gapless">
    <nuxt class="column" />
    <div class="column is-hidden-mobile is-hidden-tablet-only background-column">
      <div id="side-picture" />
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
  .background-column {
    position: relative;
    background-color: $blue-light;
    background-size: cover;
    min-height: 100vh;
    #side-picture {
      z-index: 10;
      background-image: url('/hand-app.png');
      background-repeat: no-repeat;
      background-size: cover;
      position: absolute;
      left: 0;
      bottom: 10em;
      width: 100%;
      height: 60%;
      transform: rotateY(180deg);
    }
  }
</style>
