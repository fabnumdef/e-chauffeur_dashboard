<template>
  <fragmented-tile
    v-if="statuses"
    title="Statuts"
  >
    <template
      v-if="statuses.length"
      #TEXT
    >
      <ul>
        <li>{{ ridesInProgress.total }}/{{ ridesTotal }} courses en cours ({{ ridesInProgress.percent }}%)</li>
        <li>{{ ridesCanceled.total }}/{{ ridesTotal }} courses annulées ({{ ridesCanceled.percent }}%)</li>
        <li>{{ ridesSucceed.total }}/{{ ridesTotal }} courses honorées ({{ ridesSucceed.percent }}%)</li>
        <li>{{ ridesFailed.total }}/{{ ridesTotal }} courses non-honorées ({{ ridesFailed.percent }}%)</li>
        <li>
          <span>Détail</span>
          <ul>
            <li
              v-for="{total, id} of translatedStatuses.slice(0, 3)"
              :key="id"
            >
              {{ id }} (<strong>{{ total }}</strong> course(s))
            </li>
          </ul>
        </li>
      </ul>
    </template>
    <template
      v-if="translatedStatuses.length"
      #PIE
    >
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
const CANCELED_STATUSES = [
  CANCELED, CANCELED_CUSTOMER_MISSING, CANCELED_CUSTOMER_OVERLOAD, CANCELED_REQUESTED_CUSTOMER,
];
const FAILED_STATUSES = [
  REJECTED_BOUNDARY, REJECTED_CAPACITY, DECLINED, CANCELED_TECHNICAL,
];

function makeRidesComputedFrom(STATUSES) {
  return function genericComputed() {
    const accumulated = this.statuses
      .reduce((acc, { total, id }) => (acc + (STATUSES.includes(id) ? total : 0)), 0);
    return {
      total: accumulated,
      percent: (((accumulated / this.ridesTotal) * 100) || 0).toFixed(2),
    };
  };
}
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
    ridesSucceed: makeRidesComputedFrom(SUCCEED_STATUSES),
    ridesFailed: makeRidesComputedFrom(FAILED_STATUSES),
    ridesCanceled: makeRidesComputedFrom(CANCELED_STATUSES),
    ridesInProgress: makeRidesComputedFrom(IN_PROGRESS_STATUSES),
    translatedStatuses() {
      return this.statuses.map((status) => {
        let id;
        switch (status.id) {
          case DRAFTED:
            id = 'En création';
            break;
          case CREATED:
            id = 'Créée';
            break;
          case VALIDATED:
            id = 'Validée';
            break;
          case REJECTED_BOUNDARY:
            id = 'Refusée - Hors-limite';
            break;
          case REJECTED_CAPACITY:
            id = 'Refusée - Capacité';
            break;
          case ACCEPTED:
            id = 'Acceptée par le chauffeur';
            break;
          case DECLINED:
            id = 'Rejetée par le chauffeur';
            break;
          case STARTED:
            id = 'Commencée';
            break;
          case WAITING:
            id = 'En attente';
            break;
          case IN_PROGRESS:
            id = 'En cours';
            break;
          case DELIVERED:
            id = 'Terminée';
            break;
          case CANCELED:
            id = 'Annulée';
            break;
          case CANCELED_TECHNICAL:
            id = 'Annulée - raisons techniques';
            break;
          case CANCELED_REQUESTED_CUSTOMER:
            id = 'Annulée - initiative du passager';
            break;
          case CANCELED_CUSTOMER_OVERLOAD:
            id = 'Annulée - passager trop chargé';
            break;
          case CANCELED_CUSTOMER_MISSING:
            id = 'Annulée - passager manquant';
            break;
          default:
            id = 'Statut manquant';
            break;
        }
        return {
          ...status,
          id,
        };
      });
    },
    ridesTotal() {
      return this.statuses.reduce((acc, { total }) => (acc + total), 0);
    },
    pieStatuses() {
      return {
        labels: this.translatedStatuses.map(({ id }) => id),
        datasets: [{ ...this.backgroundColors, data: this.translatedStatuses.map(({ total }) => total) }],
      };
    },
  },
};
</script>
