<template>
  <fragmented-tile
    v-if="categories"
    title="Catégories les plus demandées"
  >
    <template
      v-if="categories.length"
      #TEXT
    >
      <ol>
        <li
          v-for="{total, category, id} of categories.slice(0, 3)"
          :key="id"
        >
          {{ category ? category.label : 'NC' }} (<strong>{{ total }}</strong> course(s))
        </li>
      </ol>
    </template>
    <template
      v-if="categories.length"
      #PIE
    >
      <pie-chart :chart-data="pieCategories" />
    </template>
  </fragmented-tile>
</template>

<script>
import pieChart from '~/components/charts/pie.vue';
import fragmentedTile from '~/components/dashboard/fragments.vue';
import bgColorsMixin from '~/components/dashboard/mixins/background-colors';

export default {
  components: {
    fragmentedTile,
    pieChart,
  },
  mixins: [bgColorsMixin],
  props: {
    categories: {
      type: Array,
      default: () => ([]),
    },
  },
  computed: {
    pieCategories() {
      return {
        labels: this.categories.map(({ category }) => (category ? category.label : 'NC')),
        datasets: [{ ...this.backgroundColors, data: this.categories.map(({ total }) => total) }],
      };
    },
  },
};
</script>
