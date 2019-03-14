<template>
  <div>
    <date-picker
      v-model="value"
      range
      confirm
      :lang="lang"
      :format="format"
      :width="width"
      :range-separator="rangeSeparator"
      :first-day-of-week="1"
      :placeholder="placeholder"
      @confirm="emitToParentDate"
    />
  </div>
</template>

<script>
import DatePicker from 'vue2-datepicker';

export default {
  components: { DatePicker },
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
