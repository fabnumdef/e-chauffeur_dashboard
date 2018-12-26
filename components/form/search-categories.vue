<template>
  <vue-multiselect
    :id="id"
    :options="categories"
    :value="value"
    multiple
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
      categories: this.value || [],
    };
  },
  methods: {
    updateSet: debounce(async function updateSet(search) {
      const { data } = await this.$api.categories('id,label').getCategories({ search });
      this.categories = data;
    }, 500),
    onInput(data) {
      this.$emit('input', data);
    },
  },
};
</script>
