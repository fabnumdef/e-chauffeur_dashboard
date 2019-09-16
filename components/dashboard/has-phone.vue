<template>
  <fragmented-tile
    v-if="data.true || data.false"
    class="box"
    title="Proportion de numéro de téléphone"
    default-fragment="PIE"
  >
    <template #PIE>
      <pie-chart :chart-data="pieCategories" />
    </template>
  </fragmented-tile>
</template>

<script>
import pieChart from '~/components/charts/pie';
import fragmentedTile from '~/components/dashboard/fragments.vue';
import bgColorsMixin from '~/components/dashboard/mixins/background-colors';

export default {
  components: {
    fragmentedTile,
    pieChart,
  },
  mixins: [bgColorsMixin],
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    pieCategories() {
      return {
        labels: ['Oui', 'Non'],
        datasets: [{ ...this.backgroundColors, data: [this.data.true || 0, this.data.false || 0] }],
      };
    },
  },
};
</script>
