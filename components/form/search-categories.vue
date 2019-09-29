<template>
  <vue-multiselect
    :id="id"
    :options="categories"
    :value="value"
    multiple
    track-by="id"
    label="label"
    :show-labels="false"
    @search-change="updateSet"
    @input="onInput"
    :loading="loading"
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
      loading: false,
    };
  },
  async mounted() {
    this.loading = true;
    const { data } = await this.$api.categories('id,label').getCategories();
    this.loading = false;
    this.categories = data;
  },
  methods: {
    updateSet: debounce(async function updateSet(search) {
      const { data } = await this.$api.categories('id,label').getCategories(0, 30, { search });
      this.categories = data;
    }, 500),
    onInput(data) {
      this.$emit('input', data);
    },
  },
};
</script>
