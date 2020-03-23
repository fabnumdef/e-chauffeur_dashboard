<template>
  <div class="average">
    <div
      :class="averageClass"
      :style="{ width: `${average}%` }"
    />
  </div>
</template>

<script>
export default {
  props: {
    average: {
      type: Number,
      required: true,
    },
  },
  computed: {
    averageClass() {
      if (this.average < 25) {
        return 'low';
      } if (this.average <= 75) {
        return 'medium';
      } if (this.average > 75) {
        return 'high';
      }
      return '';
    },
  },
};
</script>

<style lang="scss" scoped>
    @import '~assets/css/head';

    .average {
        height: 1em;
        width: 100%;
        background-color: $gray;
        div {
            height: 100%;
            background-color: $gray;
            &.low {
                background-color: $danger;
            }
            &.medium {
                background-color: $warning;
            }
            &.high {
                background-color: $success;
            }
        }
    }
</style>
