<template>
  <vue-multiselect
    :id="id"
    :placeholder="placeholder"
    :options="drivers"
    :value="value"
    track-by="id"
    label="name"
    :show-labels="false"
    @search-change="updateSet"
    @input="onInput"
    @open="onOpen"
  />
</template>
<script>
import debounce from 'lodash.debounce';

const FIELDS = 'id,name';
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
    drivers: [],
  }),
  methods: {
    updateSet: debounce(async function updateSet(search) {
      const { data } = await this.$api.rides(this.campus).getAvailableDrivers(
        FIELDS,
        this.start.toISO(),
        this.end.toISO(),
        { search },
      );
      this.drivers = data;
    }, 500),
    async onOpen() {
      const { data } = await this.$api.rides(this.campus).getAvailableDrivers(
        FIELDS,
        this.start.toISO(),
        this.end.toISO(),
      );
      this.drivers = data;
    },
    onInput(data) {
      this.$emit('input', data);
    },
  },
};
</script>
