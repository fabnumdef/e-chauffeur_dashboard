<template>
  <vue-multiselect
    :id="id"
    :placeholder="placeholder"
    :options="pois"
    :value="value"
    track-by="id"
    label="label"
    :show-labels="false"
    :loading="loading"
    :internal-search="false"
    @search-change="updateSet"
    @input="onInput"
    @open="onOpen"
  >
    <template
      slot="singleLabel"
      slot-scope="{ option }"
    >
      <p class="is-size-7">
        {{ option.id }}
      </p>
      <p>
        {{ option.label }}
      </p>
    </template>
    <template
      slot="option"
      slot-scope="{ option }"
    >
      <p class="is-size-7">
        {{ option.id }}
      </p>
      <p>
        {{ option.label }}
      </p>
    </template>
  </vue-multiselect>
</template>
<script>
import debounce from 'lodash.debounce';

const FIELDS = 'id,label,enabled';
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
    currentCampus: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    pois: [],
    loading: false,
  }),
  methods: {
    updateSet: debounce(async function updateSet(search) {
      this.loading = true;
      try {
        const { data } = await this.$api.pois(this.currentCampus, FIELDS).getPois(0, 1000, search);
        this.pois = data;
      } catch (e) {
        this.$toast.error('Une erreur est survenue lors de la récupération des données.');
      } finally {
        this.loading = false;
      }
    }, 500),
    onInput(data) {
      this.$emit('input', data);
    },
    async onOpen() {
      this.loading = true;
      try {
        const { data } = await this.$api.pois(this.currentCampus, FIELDS).getPois();
        this.pois = data;
      } catch (e) {
        this.$toast.error('Une erreur est survenue lors de la récupération des données.');
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
