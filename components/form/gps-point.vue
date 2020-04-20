<template>
  <div class="columns">
    <ec-field
      class="column is-size-7"
      label="Longitude"
    >
      <input
        ref="longitude"
        :value="value.coordinates[0]"
        type="number"
        step="any"
        placeholder="Longitude"
        class="input"
        @input="input"
      >
    </ec-field>
    <ec-field
      class="column is-size-7"
      label="Latitude"
    >
      <input
        ref="latitude"
        :value="value.coordinates[1]"
        type="number"
        step="any"
        placeholder="Latitude"
        class="input"
        @input="input"
      >
    </ec-field>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => ({
        coordinates: [null, null],
      }),
    },
  },
  methods: {
    input() {
      this.$emit(
        'input',
        {
          type: 'Point',
          coordinates: ['longitude', 'latitude'].map(
            (k) => this.$refs[k].value || null,
          ),
        },
      );
    },
  },
};
</script>
