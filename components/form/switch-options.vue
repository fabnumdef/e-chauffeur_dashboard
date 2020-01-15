<template>
  <div>
    <button
      v-for="(content, key) in options"
      :key="key"
      type="button"
      class="button is-text"
      :class="{'is-active': computedValue === key}"
      @click="changeValue(key)"
    >
      {{ content }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: null,
    },
    options: {
      type: Object,
      default: () => ({}),
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
  methods: {
    changeValue(key) {
      this.computedValue = key;
    },
  },
};
</script>

<style scoped lang="scss">
  @import "~assets/css/head";

  .button {
    color: $dark-gray;
    font-weight: bold;
    margin: 0 5px;
    padding: 0;
    background: none;
    height: auto;
    text-decoration: none;
    &:hover, &.is-active {
      background: none;
      text-decoration: underline;
      color: $primary;
    }
  }
</style>
