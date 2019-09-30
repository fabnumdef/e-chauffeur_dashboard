<template>
  <vue-multiselect
    :id="id"
    :options="categories"
    :value="value"
    multiple
    track-by="id"
    label="label"
    :show-labels="false"
    :loading="loading"
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
      loading: false,
    };
  },
  async mounted() {
    this.loading = true;
    try {
      const { data } = await this.$api.categories('id,label').getCategories();
      this.categories = data;
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
        const { data } = await this.$api.categories('id,label').getCategories(0, 30, { search });
        this.categories = data;
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
