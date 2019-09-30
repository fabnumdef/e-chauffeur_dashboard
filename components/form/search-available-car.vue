<template>
  <vue-multiselect
    :id="id"
    :placeholder="placeholder"
    :options="cars"
    :value="value"
    track-by="id"
    label="label"
    :show-labels="false"
    :loading="loading"
    @input="onInput"
    @open="onOpen"
  >
    <template
      slot="option"
      slot-scope="{ option }"
    >
      <p
        v-if="option.model"
        class="is-size-7"
      >
        {{ option.model.label }}
      </p>
      <p>{{ option.label }} <span class="is-size-7">({{ option.id }})</span></p>
    </template>
  </vue-multiselect>
</template>
<script>

const FIELDS = 'id,label,model(id,label)';
export default {
  props: {
    campus: {
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
    driver: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    cars: [],
    loading: false,
  }),
  watch: {
    async driver() {
      let sort = null;
      if (this.driver && (!this.value || Object.keys(this.value).length === 0)) {
        sort = {
          'last-driver-ride': this.driver.id,
        };
        this.loading = true;
        try {
          const { data } = await this.$api.rides(this.campus).getAvailableCars(
            FIELDS,
            this.start.toISO(),
            this.end.toISO(),
            sort,
          );
          this.$emit('input', data[0]);
        } catch (e) {
          this.$toast.error('Une erreur est survenue lors de la récupération des données.');
        } finally {
          this.loading = false;
        }
      }
    },
  },
  methods: {
    async onOpen() {
      let sort = null;
      if (this.driver) {
        sort = {
          'last-driver-ride': this.driver.id,
        };
      }
      this.loading = true;
      try {
        const { data } = await this.$api.rides(this.campus).getAvailableCars(
          FIELDS,
          this.start.toISO(),
          this.end.toISO(),
          sort,
        );
        this.cars = data;
      } catch (e) {
        this.$toast.error('Une erreur est survenue lors de la récupération des données.');
      } finally {
        this.loading = false;
      }
    },
    onInput(data) {
      this.$emit('input', data);
    },
  },
};
</script>
