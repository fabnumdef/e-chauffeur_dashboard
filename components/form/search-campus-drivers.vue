<template>
  <vue-multiselect
    :id="id"
    v-model="driver"
    :options="drivers"
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
    campus: {
      type: Object,
      default: () => ({}),
    },
    value: {
      type: Object,
      default: () => ({}),
    },
    placeholder: {
      type: String,
      default: 'Choisir un chauffeur',
    },
  },
  data() {
    return {
      drivers: [],
      driver: null,
      loading: false,
    };
  },
  watch: {
    async campus() {
      if (this.campus && this.campus.id) {
        this.drivers = await this.getCampusDrivers();
      } else {
        this.drivers = [];
        this.driver = null;
      }
    },
  },
  async mounted() {
    if (this.campus && this.campus.id) {
      this.drivers = await this.getCampusDrivers();
      this.driver = this.value;
    }
  },
  methods: {
    onInput() {
      this.$emit('input', this.driver);
    },
    async getCampusDrivers() {
      this.loading = true;
      const { data } = await this.$api.drivers(this.campus.id, 'id,name,email').getDrivers();
      this.loading = false;
      return data;
    },
  },
};
</script>
