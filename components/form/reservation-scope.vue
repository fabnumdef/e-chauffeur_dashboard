<template>
  <div class="columns">
    <div class="column">
      <vue-multiselect
        v-model="selectScope"
        :options="multiSelectOptions"
        placeholder="Veuillez sélectionner une unité"
        track-by="value"
        label="label"
      />
    </div>
    <div class="column">
      <input
        id="reservation-scope"
        v-model="reservationScope"
        class="input"
        type="number"
        :disabled="!selectScope"
        :placeholder="!selectScope && 'Veuillez sélectionner une unité'"
      >
    </div>
  </div>
</template>
<script>
const DAY = 'day';
const HOUR = 'hour';
export default {
  props: {
    value: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      val: this.value,
      selectScope: {
        label: 'Unité : heure',
        value: HOUR,
      },
    };
  },
  computed: {
    multiSelectOptions() {
      return [
        { label: 'Unité : heure', value: HOUR },
        { label: 'Unité : jour', value: DAY },
      ];
    },
    reservationScope: {
      get() {
        switch (this.selectScope.value) {
          case DAY:
            return Math.floor(this.val / 3600 / 24);
          case HOUR:
            return Math.floor(this.val / 3600);
          default:
            return null;
        }
      },
      set(value) {
        switch (this.selectScope.value) {
          case DAY:
            this.val = value * 3600 * 24;
            break;
          case HOUR:
            this.val = value * 3600;
            break;
          default:
            this.val = value;
            break;
        }
        return this.$emit('input', this.val);
      },
    },
  },

};
</script>
