<template>
  <vue-multiselect
    placeholder="Selectionner un arret"
    :options="pois"
    :value="value"
    track-by="id"
    label="label"
    :loading="loading"
    @input="onInput"
    @open="onOpen"
  />
</template>

<script>
export default {
  props: {
    patternId: {
      type: String,
      required: true,
    },
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      loading: false,
      pois: [],
    };
  },
  methods: {
    async onOpen() {
      this.loading = true;
      try {
        const { data: pattern } = await this.$api.patterns(null, 'id,pois').getPattern(this.patternId);
        this.pois = pattern.pois;
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

<style scoped>

</style>
