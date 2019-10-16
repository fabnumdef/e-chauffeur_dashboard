<template>
  <vue-multiselect
    :id="id"
    :options="durations"
    :searchable="false"
    :show-labels="false"
    :value="value"
    @input="onInput"
  />
</template>
<script>
export default {
  props: {
    id: {
      type: String,
      default: '',
    },
    value: {
      type: Number,
      default: 30,
    },
  },
  data: () => ({
    durations: [15, 20, 30, 60],
  }),
  methods: {
    onInput(data) {
      this.$emit('input', data);
    },
  },
};
</script>
