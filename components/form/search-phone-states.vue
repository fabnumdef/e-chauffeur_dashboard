<template>
  <vue-multiselect
    :id="id"
    :options="states"
    :value="getObjectValue"
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
  computed: {
    getObjectValue() {
      return STATES_OPTIONS.find(state => state.id === this.value);
    },
  },
  methods: {
    onInput(data) {
      const returnData = (data) ? data.id : '';
      this.$emit('input', returnData);
    },
  },
};
</script>
