<template>
  <label>
    <input
      v-model="computedValue"
      type="checkbox"
    >
    <span class="yes">Oui</span>
    <span class="no">Non</span>
  </label>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      newValue: this.value,
    };
  },
  computed: {
    computedValue: {
      get() {
        return this.newValue;
      },
      set(v) {
        this.newValue = v;
        this.$emit('input', v);
      },
    },
  },
  watch: {
    value(v) {
      this.newValue = v;
    },
  },
};
</script>

<style scoped lang="scss">
  @import "~assets/css/head";

  input {
    display: none;
    ~ .yes, ~ .no {
      color: $dark-gray;
      font-weight: bold;
      margin: 0 5px;
      &:hover {
        text-decoration: underline;
        color: $primary;
      }
    }
    &:checked ~ .yes, &:not(:checked) ~ .no {
      color: $primary;
      text-decoration: underline;
    }
  }
</style>
