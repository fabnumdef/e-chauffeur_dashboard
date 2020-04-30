<template>
  <vue-multiselect
    :id="id"
    :placeholder="placeholder"
    :options="drivers"
    :value="value"
    track-by="id"
    label="name"
    :custom-label="customLabel"
    :show-labels="false"
    :loading="loading"
    @search-change="updateSet"
    @input="onInput"
    @open="onOpen"
  />
</template>
<script>
import debounce from 'lodash.debounce';

const FIELDS = 'id,name,firstname,lastname';
export default {
  props: {
    campusId: {
      type: String,
      default: null,
    },
    placeholder: {
      type: String,
      default: null,
    },
    id: {
      type: String,
      default: '',
    },
    start: {
      type: Object,
      default: null,
    },
    end: {
      type: Object,
      default: null,
    },
    value: {
      type: Object,
      default: () => ({}),
    },
    onlyShuttle: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    drivers: [],
    loading: false,
    ApiRides: this.$api.query('rides').setCampus(this.campusId).setMask(FIELDS),
  }),
  methods: {
    updateSet: debounce(async function updateSet(search) {
      this.loading = true;
      try {
        let res;
        if (this.onlyShuttle) {
          res = await this.ApiRides.availableDrivers(
            this.start.toISO(),
            this.end.toISO(),
            { params: { search } },
          ).setFilter('licences', 'D').data;
        } else {
          res = await this.ApiRides.availableDrivers(
            this.start.toISO(),
            this.end.toISO(),
          ).data;
        }
        this.drivers = res.data;
      } catch (e) {
        this.$toast.error('Une erreur est survenue lors de la récupération des données.');
      } finally {
        this.loading = false;
      }
    }, 500),
    async onOpen() {
      this.loading = true;
      try {
        let res;
        if (this.onlyShuttle) {
          res = await this.ApiRides
            .availableDrivers(this.start.toISO(), this.end.toISO())
            .setFilter('licences', 'D');
        } else {
          res = await this.ApiRides
            .availableDrivers(this.start.toISO(), this.end.toISO());
        }
        this.drivers = res.data;
      } catch (e) {
        this.$toast.error('Une erreur est survenue lors de la récupération des données.');
      } finally {
        this.loading = false;
      }
    },
    onInput(data) {
      this.$emit('input', data);
    },
    customLabel(driver) {
      if (driver.name) {
        return driver.name;
      }
      return !driver.firstname ? '' : `${driver.firstname} ${driver.lastname}`;
    },
  },
};
</script>
