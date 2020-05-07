<script>
import { Bar, mixins } from 'vue-chartjs';

const { reactiveProp } = mixins;

export default {
  extends: Bar,
  mixins: [reactiveProp],
  // Here, we use props from [vue-chartjs documentation](https://github.com/apertureless/vue-chartjs#mixins-module),
  // eslint-disable-next-line vue/require-prop-types
  props: ['chartData', 'options'],
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
};
</script>

<style scoped>
  canvas {
    max-width: 100%;
  }
</style>
