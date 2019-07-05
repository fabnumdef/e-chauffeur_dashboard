<template>
  <vue-multiselect
    :id="id"
    :placeholder="placeholder"
    :options="phoneModels"
    :value="value"
    track-by="id"
    label="label"
    :loading="loading"
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
  async mounted() {
    this.loading = true;
    const { data } = await this.$api.phoneModels.getPhoneModels('id,label');
    this.loading = false;
    this.phoneModels = data;
  },
  methods: {
    updateSet: debounce(async function updateSet(search) {
      this.loading = true;
      const { data } = await this.$api.phoneModels.getPhoneModels('id,label', { search });
      this.loading = false;
      this.phoneModels = data;
    }, 500),
    onInput(data) {
      this.$emit('input', data);
    },
  },
};
</script>
