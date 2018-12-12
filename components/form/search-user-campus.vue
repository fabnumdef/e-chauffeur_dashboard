<template>
  <vue-multiselect
    :id="id"
    :options="campuses"
    :value="value"
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
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      campuses: [],
    }
  },
  methods: {
    updateSet: debounce(async function updateSet() {
      const { data } = await this.$api.jwt.getCampuses('id,name');
      this.campuses = data;
    }, 500),
    onInput(data) {
      this.$emit('input', data);
    },
  },
};
</script>
