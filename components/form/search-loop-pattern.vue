<template>
  <vue-multiselect
    id="id"
    :options="patterns"
    track-by="id"
    label="label"
    :loading="loading"
    placeholder="Selectionner le trajet a effectuer"
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
  async mounted() {
    if (this.campus) {
      this.loading = true;
      try {
        const { data } = await this.$api.patterns(this.campus, 'id,label,stops(*),category,reachDuration')
          .getPatterns();
        this.patterns = data;
      } catch (e) {
        this.$toast.error('Une erreur est survenue lors de la récupération des données.');
      } finally {
        this.loading = false;
      }
    }
  },
  methods: {
    onInput() {

    },
  },
};
</script>

<style scoped>

</style>
