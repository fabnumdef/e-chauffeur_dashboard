<template>
  <fragmented-tile
    v-if="ratings"
    title="Appréciations"
  >
    <template
      #TEXT
    >
      <p><strong>{{ total }}</strong> appréciations sur la période</p>
      <article v-if="ux.length > 0">
        <h3>Répartitions des notes UX :</h3>
        <ul>
          <template v-for="([grade, percentage], index) in ux">
            <li
              v-if="percentage > 0"
              :key="index"
            >
              {{ grade }} / 5 : <strong>{{ percentage }}</strong> %
            </li>
          </template>
        </ul>
        <p>Note moyenne : <strong>{{ average(ratings.ux) }}</strong> / 5</p>
      </article>

      <article v-if="recommendation.length > 0">
        <h3>Niveau de recommandation</h3>
        <ul>
          <template v-for="([grade, percentage], index) in recommendation">
            <li
              v-if="percentage > 0"
              :key="index"
            >
              {{ grade }} / 10 : <strong>{{ percentage }}</strong> %
            </li>
          </template>
        </ul>
        <p>Note moyenne : <strong>{{ average(ratings.recommendation) }}</strong> / 10</p>
      </article>
    </template>
    <template
      #PIE
    >
      <h3>Répartitions des notes UX</h3>
      <pie-chart :chart-data="pieUx" />
      <p>Note moyenne :</p>
      <average-chart :average="average(ratings.ux) / 5 * 100" />

      <h3>Niveau de recommandation :</h3>
      <pie-chart :chart-data="pieRecommendation" />
      <p>Note moyenne :</p>
      <average-chart :average="average(ratings.recommendation) / 10 * 100" />
    </template>
  </fragmented-tile>
</template>

<script>
import fragmentedTile from '~/components/dashboard/fragments.vue';
import bgColorsMixin from '~/components/dashboard/mixins/background-colors';
import pieChart from '~/components/charts/pie.vue';
import averageChart from '~/components/charts/average.vue';

const getTotal = (array) => array.reduce((acc, rating) => acc + rating.total, 0);

export default {
  components: {
    fragmentedTile,
    pieChart,
    averageChart,
  },
  mixins: [bgColorsMixin],
  props: {
    ratings: {
      type: Object,
      default: null,
    },
  },
  computed: {
    total() {
      return getTotal(this.ratings.ux);
    },
    ux() {
      return this.ratings.ux.reduce((acc, rating) => [
        ...acc,
        [
          rating.grade,
          Math.round((rating.total / getTotal(this.ratings.ux)) * 100),
        ],

      ], []);
    },
    recommendation() {
      return this.ratings.recommendation.reduce((acc, rating) => [
        ...acc,
        [
          rating.grade,
          Math.round((rating.total / getTotal(this.ratings.recommendation)) * 100),
        ],

      ], []);
    },
    pieUx() {
      return {
        labels: this.ratings.ux.reduce((acc, rating) => (
          rating.total > 0 ? [...acc, rating.grade] : acc
        ), []),
        datasets: [{
          ...this.backgroundColors,
          data: this.ratings.ux.reduce((acc, rating) => (
            rating.total > 0 ? [...acc, rating.total] : acc
          ), []),
        }],
      };
    },
    pieRecommendation() {
      return {
        labels: this.ratings.recommendation.reduce((acc, rating) => (
          rating.total > 0 ? [...acc, rating.grade] : acc
        ), []),
        datasets: [{
          ...this.backgroundColors,
          data: this.ratings.recommendation.reduce((acc, rating) => (
            rating.total > 0 ? [...acc, rating.total] : acc
          ), []),
        }],
      };
    },
  },
  methods: {
    average(array) {
      const total = getTotal(array);
      const totalNotes = array.reduce((t, rating) => t + (rating.grade * rating.total), 0);
      return Math.round((totalNotes / total) * 10) / 10;
    },
  },
};
</script>

<style lang="scss" scoped>
  .content {
    h3, ul, p {
      font-size: .8em;
      margin-top: 1em;
    }
  }

</style>
