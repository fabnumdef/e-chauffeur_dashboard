<template>
  <div>
    <vue-multiselect
      v-bind="$attrs"
      :value="getObjectValue"
      :options="list"
      track-by="id"
      label="name"
      :show-labels="false"
      :loading="loading"
      :searchable="false"
      placeholder="Choisir un état"
      @input="onInput"
    />
  </div>
</template>

<script>
import lazyDataset from '~/components/form/selects/mixins/lazy-dataset';

const STATES_OPTIONS = [
  { id: 'new', name: 'Neuf' },
  { id: 'very_good', name: 'Très bon' },
  { id: 'good', name: 'Bon' },
  { id: 'bad', name: 'Mauvais' },
  { id: 'unusable', name: 'Inutilisable' },
];
export default {
  mixins: [
    lazyDataset(null, {
      listQuery: () => ({ data: STATES_OPTIONS }),
    }),
  ],
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  computed: {
    getObjectValue() {
      return this.list.find((val) => (val.id || val) === this.value);
    },
  },
  methods: {
    onInput(val) {
      this.$emit('input', val ? val.id : null);
    },
  },
};
</script>
