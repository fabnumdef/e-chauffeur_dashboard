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
    placeholder="Choisir une base"
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
  },
  data() {
    return {
      campuses: [],
      loading: false,
    };
  },
  async mounted() {
    this.loading = true;
    const { data } = await this.$api.jwt.getCampuses('id,name');
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

<style scoped lang="scss">
  @import "~assets/css/head";

</style>
