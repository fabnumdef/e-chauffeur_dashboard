<template>
  <vue-multiselect
    v-bind="$attrs"
    placeholder="Sélectionner un arret"
    :options="formattedStops"
    :value="value"
    track-by="index"
    label="label"
    v-on="$listeners"
  />
</template>

<script>
const SHUTTLE_FACTORIES = 'shuttleFactories';
const MASK = 'id,stops';

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
    isDeparture: {
      type: Boolean,
      default: false,
    },
    departureIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      stops: [],
    };
  },
  computed: {
    formattedStops() {
      return this.isDeparture
        ? this.stops.filter((_, i) => i !== this.stops.length - 1)
        : this.stops.filter((_, i) => i > this.departureIndex && i > 0);
    },
  },
  async mounted() {
    const { data } = await this.$api.query(SHUTTLE_FACTORIES)
      .setCampus(this.$route.params.campus)
      .setMask(MASK)
      .get(this.shuttleFactoryId);

    this.stops = data.stops.map(
      ({ id, label }, index) => ({ id, index, label: `${index + 1}: ${label}` }),
    );
  },
};
</script>
