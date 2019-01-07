<template>
  <vue-multiselect
    :id="id"
    :placeholder="placeholder"
    :options="cars"
    :value="value"
    track-by="id"
    label="label"
    @search-change="updateSet"
    @input="onInput"
  />
</template>
<script>
import debounce from 'lodash.debounce';

export default {
  props: {
    campus: {
      type: String,
      default: null,
    },
    placeholder: {
      type: String,
      default: null,
    },
    id: {
      type: String,
      default: '',
    },
    start: {
      type: Object,
      default: null,
    },
    end: {
      type: Object,
      default: null,
    },
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    cars: [],
  }),
  methods: {
    updateSet: debounce(async function updateSet(search) {
      const { data } = await this.$api.rides(this.campus).getAvailableCars(
        'id,label',
        this.start.toISO(),
        this.end.toISO(),
        { search },
      );
      this.cars = data;
    }, 500),
    onInput(data) {
      this.$emit('input', data);
    },
  },
};
</script>
