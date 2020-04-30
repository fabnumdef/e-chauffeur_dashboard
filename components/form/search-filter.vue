<template>
  <form
    class="box"
    @submit.prevent="update"
  >
    <input
      v-model="val"
      class="input"
      type="text"
      @input="update"
    >
    <ec-button
      info
      icon-left="search"
      type="submit"
    >
      Chercher
    </ec-button>
  </form>
</template>
<script>
import debounce from 'lodash.debounce';

export default {
  props: {
    value: {
      type: String,
      default: null,
    },
  },
  data() {
    return { val: this.value };
  },
  methods: {
    update: debounce(async function updateSet() {
      this.$emit('update', this.val);
    }, 500),
  },
};
</script>
<style lang="scss" scoped>
  @import "~assets/css/head";
  .box {
    display: inline-flex;
    padding: $size-small;
  }
</style>
