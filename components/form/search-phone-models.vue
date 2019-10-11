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
    loading: false,
  }),
  async mounted() {
    this.loading = true;
    try {
      const { data } = await this.$api.phoneModels.getPhoneModels('id,label');
      this.phoneModels = data;
    } catch (e) {
      this.$toast.error('Une erreur est survenue lors de la récupération des données.');
    } finally {
      this.loading = false;
    }
  },
  methods: {
    updateSet: debounce(async function updateSet(search) {
      this.loading = true;
      try {
        const { data } = await this.$api.phoneModels.getPhoneModels('id,label', { search });
        this.phoneModels = data;
      } catch (e) {
        this.$toast.error('Une erreur est survenue lors de la récupération des données.');
      } finally {
        this.loading = false;
      }
    }, 500),
    onInput(data) {
      this.$emit('input', data);
    },
  },
};
</script>
