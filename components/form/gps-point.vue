<template>
  <div>
    <div class="field has-addons">
      <p class="control">
        <input
          ref="longitude"
          :value="value.coordinates[0]"
          type="number"
          placeholder="Longitude"
          class="input"
          @input="input"
        >
      </p>
      <p class="control">
        <input
          ref="latitude"
          :value="value.coordinates[1]"
          type="number"
          placeholder="Latitude"
          class="input"
          @input="input"
        >
      </p>
    </div>
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
            k => this.$refs[k].value || null,
          ),
        },
      );
    },
  },
};
</script>
