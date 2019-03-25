<template>
  <vue-multiselect
    :id="id"
    :options="campuses"
    :value="value"
    multiple
    track-by="id"
    label="name"
    :show-labels="false"
    :placeholder="placeholder"
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
    placeholder: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      campuses: this.value || [],
    };
  },
  methods: {
    updateSet: debounce(async function updateSet(search) {
      const { data } = await this.$api.campuses.getCampuses('id,name,location', { search });
      this.campuses = data;
    }, 500),
    onInput(data) {
      this.$emit('input', data);
    },
  },
};
</script>
