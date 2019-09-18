<template>
  <fragmented-tile
    v-if="drivers"
    title="Chauffeurs les plus solicités"
  >
    <template
      v-if="drivers.length"
      #TEXT
    >
      <ol>
        <li
          v-for="{total, driver, id} of drivers.slice(0, 3)"
          :key="id"
        >
          {{ driver ? (driver.name || `${driver.firstname} ${driver.lastname}`) : 'NC' }}
          (<strong>{{ total }}</strong> course(s))
        </li>
      </ol>
    </template>
    <template
      v-if="drivers.length"
      #PIE
    >
      <pie-chart :chart-data="pieDrivers" />
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
    drivers: {
      type: Array,
      default: () => ([]),
    },
  },
  computed: {
    pieDrivers() {
      return {
        labels: this.drivers.map(
          ({ driver }) => (driver ? (driver.name || `${driver.firstname} ${driver.lastname}`) : 'NC'),
        ),
        datasets: [{ ...this.backgroundColors, data: this.drivers.map(({ total }) => total) }],

      };
    },
  },
};
</script>
