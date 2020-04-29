<template>
  <vue-multiselect
    :id="id"
    :options="campuses"
    :value="value"
    track-by="id"
    label="name"
    :loading="loading"
    :searchable="false"
    :show-labels="false"
    :placeholder="placeholder"
    @input="onInput"
  />
</template>
<script>

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
    placeholder: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      campuses: [],
      loading: false,
    };
  },
  async mounted() {
    this.loading = true;
    try {
      const { data } = await this.$api.query('campuses').setMask('id,name,location').list();
      this.campuses = data;
    } catch (e) {
      this.$toast.error('Une erreur est survenue lors de la récupération des données.');
    } finally {
      this.loading = false;
    }
  },
  methods: {
    onInput(data) {
      this.$emit('input', data);
    },
  },
};
</script>
