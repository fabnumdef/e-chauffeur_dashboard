<template>
  <vue-multiselect
    :id="id"
    :options="formattedCampuses"
    track-by="id"
    label="label"
    :searchable="false"
    :show-labels="false"
    multiple
    :value="computedValue"
    @input="onInput"
  />
</template>
<script>
export default {
  props: {
    id: {
      type: String,
      default: '',
    },
    value: {
      type: Array,
      default: () => [],
    },
    campuses: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    formattedCampuses() {
      return this.campuses.map(({ id, name }) => ({ id, label: name }));
    },
    computedValue() {
      return this.value.map((n) => this.formattedCampuses.find(({ id }) => id === n));
    },
  },
  methods: {
    onInput(data) {
      this.$emit('input', data.map(({ id }) => id));
    },
  },
};
</script>
