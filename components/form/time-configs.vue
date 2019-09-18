<template>
  <vue-multiselect
    :id="id"
    :options="timeConfigs"
    track-by="id"
    label="label"
    :searchable="false"
    :show-labels="false"
    :allow-empty="false"
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
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    timeConfigs() {
      return [
        {
          id: 'year-month',
          timeScope: 'year',
          timeUnit: 'month',
          label: 'Découpage mensuel par an',
        },
        {
          id: 'week-day',
          timeScope: 'week',
          timeUnit: 'day',
          label: 'Découpage journalier par semaine',
        },
        {
          id: 'day-hour',
          timeScope: 'day',
          timeUnit: 'hour',
          label: 'Découpage horaire par jour',
        },
      ];
    },
    computedValue() {
      return this.timeConfigs
        .find(({ timeScope, timeUnit }) => timeScope === this.value.timeScope && timeUnit === this.value.timeUnit);
    },
  },
  methods: {
    onInput(data) {
      this.$emit('input', data);
    },
  },
};
</script>
