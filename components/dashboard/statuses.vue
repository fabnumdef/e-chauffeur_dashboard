<template>
  <fragmented-tile
    v-if="statuses && statuses.length"
    title="Statuts"
  >
    <template #TEXT>
      <ul>
        <li>{{ ridesInProgress.total }}/{{ ridesTotal }} courses en cours ({{ ridesInProgress.percent }}%)</li>
        <li>{{ ridesCanceled.total }}/{{ ridesTotal }} courses annulées ({{ridesCanceled.percent}}%)</li>
        <li>{{ ridesSucceed.total }}/{{ ridesTotal }} courses honorées ({{ridesSucceed.percent}}%)</li>
        <li>{{ ridesFailed.total }}/{{ ridesTotal }} courses non-honorées ({{ridesFailed.percent}}%)</li>
        <li>
          <span>Détail</span>
          <ul>
            <li
              v-for="{total, id} of statuses.slice(0, 3)"
              :key="id"
            >
              {{ id }} (<strong>{{ total }}</strong> course(s))
            </li>
          </ul>
        </li>
      </ul>
    </template>
    <template #PIE>
      <pie-chart :chart-data="pieStatuses" />
    </template>
  </fragmented-tile>
</template>

<script>
import {
  DRAFTED, CREATED, VALIDATED, REJECTED_BOUNDARY, REJECTED_CAPACITY, ACCEPTED, DECLINED, STARTED, WAITING,
  IN_PROGRESS, DELIVERED, CANCELED,
  CANCELED_TECHNICAL, CANCELED_REQUESTED_CUSTOMER, CANCELED_CUSTOMER_OVERLOAD, CANCELED_CUSTOMER_MISSING,
} from '@fabnumdef/e-chauffeur_lib-vue/api/status/states';
import pieChart from '~/components/charts/pie';
import fragmentedTile from '~/components/dashboard/fragments.vue';
import bgColorsMixin from '~/components/dashboard/mixins/background-colors';

const IN_PROGRESS_STATUSES = [DRAFTED, CREATED, VALIDATED, ACCEPTED, STARTED, WAITING, IN_PROGRESS];
const SUCCEED_STATUSES = [DELIVERED];
const CANCELED_STATUSES = [CANCELED, CANCELED_CUSTOMER_MISSING,
  CANCELED_CUSTOMER_OVERLOAD, CANCELED_REQUESTED_CUSTOMER];
const FAILED_STATUSES = [
  REJECTED_BOUNDARY, REJECTED_CAPACITY, DECLINED, CANCELED_TECHNICAL
];
export default {
  components: {
    fragmentedTile,
    pieChart,
  },
  mixins: [bgColorsMixin],
  props: {
    statuses: {
      type: Array,
      default: () => ([]),
    },
  },
  computed: {
    ridesSucceed() {
      const accumulated = this.statuses
        .reduce((acc, { total, id }) => (acc + (SUCCEED_STATUSES.includes(id) ? total : 0)), 0);
      return {
        total: accumulated,
        percent: (accumulated / this.ridesTotal) * 100,
      };
    },
    ridesFailed() {
      const accumulated = this.statuses
        .reduce((acc, { total, id }) => (acc + (FAILED_STATUSES.includes(id) ? total : 0)), 0);
      return {
        total: accumulated,
        percent: (accumulated / this.ridesTotal) * 100,
      };
    },
    ridesCanceled() {
      const accumulated = this.statuses
        .reduce((acc, { total, id }) => (acc + (CANCELED_STATUSES.includes(id) ? total : 0)), 0);
      return {
        total: accumulated,
        percent: (accumulated / this.ridesTotal) * 100,
      };
    },
    ridesInProgress() {
      const accumulated = this.statuses
        .reduce((acc, { total, id }) => (acc + (IN_PROGRESS_STATUSES.includes(id) ? total : 0)), 0);
      return {
        total: accumulated,
        percent: (accumulated / this.ridesTotal) * 100,
      };
    },
    ridesTotal() {
      return this.statuses.reduce((acc, { total }) => (acc + total), 0);
    },
    pieStatuses() {
      return {
        labels: this.statuses.map(({ id }) => id),
        datasets: [{ ...this.backgroundColors, data: this.statuses.map(({ total }) => total) }],
      };
    },
  },
};
</script>
