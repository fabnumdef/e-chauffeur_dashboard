<template>
  <VueMultiselect
    :id="id"
    :placeholder="placeholder"
    :options="carModels"
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
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    carModels: [],
  }),
  methods: {
    updateSet: debounce(async function updateSet(search) {
      const { data } = await this.$api.carModels.getCarModels('id,label', { search });
      this.carModels = data;
    }, 500),
    onInput(data) {
      this.$emit('input', data);
    },
  },
};
</script>
