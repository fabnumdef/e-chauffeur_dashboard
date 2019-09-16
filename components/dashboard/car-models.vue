<template>
  <fragmented-tile
    v-if="models && models.length"
    class="box"
    title="Modèles de véhicules les plus utilisés"
  >
    <template #TEXT>
      <ol>
        <li
          v-for="{total, model, id} of models.slice(0, 3)"
          :key="id"
        >
          {{ model ? model.label : 'NC' }} (<strong>{{ total }}</strong> course(s))
        </li>
      </ol>
    </template>
    <template #PIE>
      <pie-chart :chart-data="pieModels" />
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
    models: {
      type: Array,
      default: () => ([]),
    },
  },
  computed: {
    pieModels() {
      return {
        labels: this.models.map(({ model }) => (model ? model.label : 'NC')),
        datasets: [{ ...this.backgroundColors, data: this.models.map(({ total }) => total) }],
      };
    },
  },
};
</script>
