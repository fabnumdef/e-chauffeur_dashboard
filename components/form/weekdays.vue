<template>
  <vue-multiselect
    :id="id"
    :options="weekDays"
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
  },
  computed: {
    weekDays() {
      return [
        { id: 1, label: 'Lundi' },
        { id: 2, label: 'Mardi' },
        { id: 3, label: 'Mercredi' },
        { id: 4, label: 'Jeudi' },
        { id: 5, label: 'Vendredi' },
        { id: 6, label: 'Samedi' },
        { id: 7, label: 'Dimanche' },
      ];
    },
    computedValue() {
      return this.value.map((n) => this.weekDays.find(({ id }) => id === n));
    },
  },
  methods: {
    onInput(data) {
      this.$emit('input', data.map(({ id }) => id));
    },
  },
};
</script>
