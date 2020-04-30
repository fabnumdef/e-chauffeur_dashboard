<template>
  <div>
    <label
      v-for="(data, key) of stdChoices"
      :key="key"
      :class="{radio: expanded && !multiple}"
    >
      <input
        :value="key"
        :name="uniqueName"
        type="radio"
        :checked="value === key"
        @input="updateValue"
      >
      {{ data }}
    </label>
  </div>
</template>
<script>
export default {
  props: {
    // @todo: implement not-expanded (should be a list)
    expanded: {
      type: Boolean,
      default: false,
    },
    // @todo: implement multiple (should be checkbox while expanded / multiple select while not expanded)
    multiple: {
      type: Boolean,
      default: false,
    },
    choices: {
      type: [Array, Object],
      default: () => [],
    },
    value: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
  },
  computed: {
    stdChoices() {
      if (!Array.isArray(this.choices)) {
        return this.choices;
      }
      return this.choices.reduce((acc, val) => Object.assign(acc, ({ [val]: val })), {});
    },
    uniqueName() {
      // _uid come from vueJS API
      // eslint-disable-next-line no-underscore-dangle
      return this.name || `choice${this._uid}`;
    },
  },
  methods: {
    updateValue({ target }) {
      this.$emit('input', target.value);
    },
  },
};
</script>
