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
    const { data } = await this.$api.campuses.getCampuses('id,name,location');
    this.loading = false;
    this.campuses = data;
  },
  methods: {
    onInput(data) {
      this.$emit('input', data);
    },
  },
};
</script>
