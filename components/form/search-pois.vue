<template>
  <VueMultiselect
    :id="id"
    :placeholder="placeholder"
    :options="pois"
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
    placeholder: {
      type: String,
      default: null,
    },
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
    pois: [],
  }),
  methods: {
    updateSet: debounce(async function updateSet(search) {
      const { data } = await this.$api.pois.getPois('id,label', { search });
      this.pois = data;
    }, 500),
    onInput(data) {
      this.$emit('input', data);
    },
  },
};
</script>
