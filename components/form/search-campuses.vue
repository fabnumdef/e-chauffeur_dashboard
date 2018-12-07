<template>
  <VueMultiselect
    :id="id"
    :options="campuses"
    :value="value"
    multiple
    track-by="id"
    label="name"
    @search-change="updateSet"
    @input="onInput"
  />
</template>
<script>
import debounce from 'lodash.debounce';

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
  data: () => ({
    campuses: [],
  }),
  methods: {
    updateSet: debounce(async function updateSet(search) {
      const { data } = await this.$api.campuses.getCampuses('id,name', { search });
      this.campuses = data;
    }, 500),
    onInput(data) {
      this.$emit('input', data);
    },
  },
};
</script>
