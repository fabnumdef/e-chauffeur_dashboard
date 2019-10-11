<template>
  <vue-multiselect
    :id="id"
    :options="campuses"
    :value="value"
    multiple
    track-by="id"
    label="name"
    :loading="loading"
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
      loading: false,
    };
  },
  async mounted() {
    this.loading = true;
    try {
      const { data } = await this.$api.campuses.getCampuses('id,name,location');
      this.campuses = data;
    } catch (e) {
      this.$toast.error('Une erreur est survenue lors de la récupération des données.');
    } finally {
      this.loading = false;
    }
  },
  methods: {
    updateSet: debounce(async function updateSet(search) {
      try {
        const { data } = await this.$api.campuses.getCampuses('id,name,location', { search });
        this.campuses = data;
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
