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

const FIELDS = 'id,label,model(id,label,capacity)';

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
      if (this.driver && (!this.value || Object.keys(this.value).length === 0)) {
        this.loading = true;
        try {
          const { data } = await this.$api.query('rides')
            .setCampus(this.campusId)
            .setMask(FIELDS)
            .availableCars(
              this.start.toISO(),
              this.end.toISO(),
              {
                params: {
                  sort: {
                    'last-driver-ride': this.driver.id,
                  },
                },
              },
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
      this.loading = true;
      try {
        const { data } = await this.$api.query('rides')
          .setCampus(this.campusId)
          .setMask(FIELDS)
          .availableCars(
            this.start.toISO(),
            this.end.toISO(),
            this.driver ? {
              params: {
                sort: {
                  'last-driver-ride': this.driver.id,
                },
              },
            } : undefined,
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
