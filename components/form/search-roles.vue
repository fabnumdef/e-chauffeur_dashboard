<template>
  <vue-multiselect
    :id="id"
    :options="roles"
    :value="value"
    label="id"
    multiple
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
    roles: [],
  }),
  methods: {
    updateSet: debounce(async function updateSet(search) {
      this.roles = (await this.$api.roles.getRoles('id', { search })).data;
    }, 500),
    onInput(data) {
      this.$emit('input', data);
    },
  },
};
</script>
