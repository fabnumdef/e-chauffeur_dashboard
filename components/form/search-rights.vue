<template>
  <vue-multiselect
    :id="id"
    :options="rights"
    :value="value"
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
    rights: [],
  }),
  methods: {
    updateSet: debounce(async function updateSet(search) {
      this.rights = (await this.$api.roles.getRights(search)).data;
    }, 500),
    onInput(data) {
      this.$emit('input', data);
    },
  },
};
</script>
