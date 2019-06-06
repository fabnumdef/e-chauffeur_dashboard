<template>
  <vue-multiselect
    :id="id"
    :placeholder="placeholder"
    :options="phoneModels"
    :value="value"
    track-by="id"
    label="label"
    :show-labels="false"
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
    phoneModels: [],
  }),
  methods: {
    updateSet: debounce(async function updateSet(search) {
      const { data } = await this.$api.phoneModels.getPhoneModels('id,label', { search });
      this.phoneModels = data;
    }, 500),
    onInput(data) {
      this.$emit('input', data);
    },
  },
};
</script>
