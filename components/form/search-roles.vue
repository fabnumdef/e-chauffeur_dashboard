<template>
  <vue-multiselect
    :id="id"
    :options="roles"
    :value="value"
    track-by="id"
    label="id"
    multiple
    :show-labels="false"
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
  data() {
    return {
      roles: this.value || [],
    };
  },
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
