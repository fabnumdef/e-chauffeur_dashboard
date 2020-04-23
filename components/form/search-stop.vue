<template>
  <vue-multiselect
    :allow-empty="false"
    deselect-label=""
    placeholder="Selectionner un arret"
    :options="stops"
    :value="value"
    track-by="index"
    label="label"
    :loading="loading"
    @input="onInput"
    @open="onOpen"
  />
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    shuttleFactoryId: {
      type: String,
      default: null,
    },
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      loading: false,
      stops: [],
    };
  },
  computed: {
    ...mapGetters({
      campus: 'context/campus',
    }),
  },
  methods: {
    async onOpen() {
      this.loading = true;
      try {
        const { data: shuttleFactory } = await
        this.$api.shuttleFactories(this.campus.id, 'id,stops').getShuttleFactory(this.shuttleFactoryId);
        this.stops = shuttleFactory.stops.map(
          ({ id, label }, index) => ({ id, index, label: `${index + 1}: ${label}` }),
        );
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
