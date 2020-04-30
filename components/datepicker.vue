<template>
  <div>
    <date-time
      v-model="value"
      range
      confirm
      :lang="lang"
      :format="format"
      :width="width"
      :range-separator="rangeSeparator"
      :placeholder="placeholder"
      @confirm="emitToParentDate"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      lang: 'fr',
      format: 'DD/MM/YYYY',
      width: '100%',
      rangeSeparator: '-',
      placeholder: 'Toutes',
    };
  },
  methods: {
    emitToParentDate(date) {
      this.$emit('dateChange', date);
    },
  },
};

</script>
