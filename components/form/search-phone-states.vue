<template>
  <vue-multiselect
    :id="id"
    :options="states"
    :value="formatValue(value)"
    track-by="id"
    label="name"
    :searchable="false"
    :show-labels="false"
    :placeholder="placeholder"
    @input="onInput"
  />
</template>
<script>

const STATES_OPTIONS = [
  { id: 'new', name: 'Neuf' },
  { id: 'very_good', name: 'Très bon' },
  { id: 'good', name: 'Bon' },
  { id: 'bad', name: 'Mauvais' },
  { id: 'unusable', name: 'Inutilisable' },
];

export default {
  props: {
    id: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      states: STATES_OPTIONS,
    };
  },
  methods: {
    onInput(data) {
      if (data) {
        this.$emit('input', data.id);
      } else {
        this.$emit('input', '');
      }
    },
    formatValue(value) {
      return STATES_OPTIONS.find(state => state.id === value);
    },
  },
};
</script>
