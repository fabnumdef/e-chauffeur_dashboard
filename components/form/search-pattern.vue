<template>
  <vue-multiselect
    :value="value"
    :options="patterns"
    track-by="id"
    label="label"
    placeholder="Selectionner le trajet a effectuer"
    :loading="loading"
    :disabled="disabled"
    :allow-empty="false"
    deselect-label=""
    :show-labels="false"
    @open="open"
    @input="onInput"
  />
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      patterns: [],
    };
  },
  computed: {
    ...mapGetters({
      campus: 'context/campus',
    }),
  },

  methods: {
    onInput(value) {
      this.$emit('input', value);
    },
    async open() {
      if (this.campus.id) {
        this.loading = true;
        try {
          const { data } = await this.$api.patterns(this.campus.id, 'id,label,stops(id,label)').getPatterns();
          this.patterns = data;
        } catch (e) {
          this.$toast.error('Une erreur est survenue lors de la récupération des données.');
        } finally {
          this.loading = false;
        }
      }
    },
  },
};
</script>

<style scoped>

</style>
