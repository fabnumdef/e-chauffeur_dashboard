<template>
  <form @submit="createRide">
    <ec-field>
      <select
        v-model="ride.category"
        class="select">
        <option value="std">Standard</option>
        <option value="opex">OPEX</option>
        <option value="fret">Fret</option>
        <option value="health">Santé</option>
      </select>
    </ec-field>
    <ec-field>
      <fa-icon
        icon="map-marker-alt" />
      <search-pois
        v-model="ride.from"
        placeholder="Départ"/>
    </ec-field>
    <ec-field>
      <fa-icon
        icon="flag" />
      <search-pois
        v-model="ride.to"
        placeholder="Arrivée"/>
    </ec-field>
    <ec-field>
      <select
        v-model="ride.passengers"
        class="select">
        <option
          v-for="i in 8"
          :key="i"
          :value="i">{{ i }}</option>
      </select>
    </ec-field>
  </form>
</template>
<script>
import searchPois from '~/components/form/search-pois.vue';
import ecField from '~/components/form/field.vue';

export default {
  asyncData: () => ({
    ride: {
      category: null,
      from: null,
      to: null,
      passengers: 0,
    },
  }),
  components: {
    searchPois,
    ecField,
  },
  methods: {
    createRide() {

    },
  },
};
</script>
