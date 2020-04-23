<template>
  <main>
    <header>
      <h1
        class="title"
      >
        Course <em class="is-size-6">#{{ id }}</em>
      </h1>
    </header>
    <section
      class="box"
    >
      <ul>
        <li>Catégorie : <strong>{{ category.label }}</strong></li>
        <li>Départ : <strong>{{ departure.label }}</strong> le <strong>{{ start }}</strong></li>
        <li>Arrivée : <strong>{{ arrival.label }}</strong> le <strong>{{ end }}</strong></li>
        <li>Chauffeur : <strong>{{ driver.firstname }} {{ driver.lastname }}</strong></li>
        <li>Véhicule : <strong>{{ car.id }}</strong></li>
        <li>Statut : <strong>{{ convertStatus(status) }}</strong></li>
        <li>Nombre de passagers : <strong>{{ passengersCount }}</strong></li>
        <li>Présence de bagages : <strong>{{ luggage ? 'Oui' : 'Non' }}</strong></li>
        <li v-if="comments">
          Commentaires : <strong>{{ comments }}</strong>
        </li>
        <li>Date de création : <strong>{{ createdAt }}</strong></li>
      </ul>
    </section>
  </main>
</template>

<script>
import { DateTime } from 'luxon';
import {
  ACCEPTED,
  DELIVERED,
  IN_PROGRESS,
  STARTED,
  VALIDATED,
  WAITING,
} from '@fabnumdef/e-chauffeur_lib-vue/api/status/states';

const mask = [
  'id',
  'start',
  'end',
  'departure(id,label)',
  'arrival(id,label)',
  'car(id,label,model(id,label))',
  'driver(id,name,firstname,lastname)',
  'owner(id)',
  'phone',
  'status',
  'userComments',
  'comments',
  'passengersCount',
  'category(id,label)',
  'luggage',
].join(',');
const formatDate = (ISODate) => DateTime.fromISO(ISODate).toFormat('dd LLL yyyy à HH:mm', { locale: 'fr' });

export default {
  async asyncData({ params, $api }) {
    const { data } = await $api.rides(params.campus, mask).getRide(params.id);
    const ride = {
      ...data,
      start: formatDate(data.start),
      end: formatDate(data.end),
      createdAt: formatDate(data.createdAt),
    };
    return {
      ...ride,
    };
  },
  methods: {
    convertStatus(status) {
      switch (status) {
        case VALIDATED:
        case ACCEPTED:
          return 'Planifié';
        case STARTED:
        case WAITING:
        case IN_PROGRESS:
          return 'En cours';
        case DELIVERED:
          return 'Délivré';
        default:
          return null;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  h1 {
    margin-bottom: .6em;
  }
</style>
