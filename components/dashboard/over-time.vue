<template>
  <fragmented-tile
    v-if="data"
    title="Moyenne par période"
    default-fragment="BAR"
  >
    <template
      v-if="data.length"
      #BAR
    >
      <ec-field field-id="config">
        <time-configs
          id="config"
          :value="{timeScope, timeUnit}"
          v-on="$listeners"
        />
      </ec-field>
      <bar-chart :chart-data="barData" />
    </template>
  </fragmented-tile>
</template>

<script>
import fragmentedTile from '~/components/dashboard/fragments.vue';
import ecField from '~/components/form/field.vue';
import timeConfigs from '~/components/form/time-configs.vue';
import barChart from '~/components/charts/bar';

export default {
  components: {
    fragmentedTile,
    ecField,
    timeConfigs,
    barChart,
  },
  props: {
    data: {
      type: Array,
      default: () => ([]),
    },
    timeScope: {
      type: String,
      default: null,
    },
    timeUnit: {
      type: String,
      default: null,
    },
  },
  computed: {
    barData() {
      let labels;
      switch (this.timeUnit) {
        case 'month':
          labels = [
            'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet',
            'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
          ];
          break;
        case 'day':
          labels = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
          break;
        case 'hour':
          labels = Array.from({ length: 24 }).map((_, i) => i);
          break;
        default:
          labels = [];
      }
      return {
        labels,
        datasets: [
          {
            label: 'Minimum',
            backgroundColor: 'rgba(65, 184, 131, .8)',
            data: this.data.map((d) => d.minimum || 0),
          },
          {
            label: 'Moyenne',
            backgroundColor: 'rgba(0, 216, 255, .8)',
            data: this.data.map((d) => d.average || 0),
          },
          {
            label: 'Maximum',
            backgroundColor: 'rgba(228, 102, 81, .8)',
            data: this.data.map((d) => d.maximum || 0),
          },
          {
            label: 'Cumul',
            backgroundColor: 'rgba(0, 0, 0, .8)',
            data: this.data.map((d) => d.total || 0),
          },
        ],
      };
    },
  },
};
</script>
<style lang="scss" scoped>
  /deep/ .multiselect__content-wrapper {
    position: initial;
  }
  /deep/ .multiselect__content {
    position: absolute;
  }
</style>
