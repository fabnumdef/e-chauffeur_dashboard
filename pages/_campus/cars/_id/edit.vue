<template>
  <main>
    <header>
      <nuxt-link
        v-if="id"
        :to="campusLink('cars-id-calendar', { params: { campus } })"
        class="button is-primary is-pulled-right"
      >
        <span class="icon is-small">
          <fa-icon :icon="['fas', 'calendar-alt']" />
        </span>
        <span>Calendrier</span>
      </nuxt-link>
      <h1
        v-if="id"
        class="title"
      >
        Véhicule <em>{{ id }}</em>
      </h1>
      <h1
        v-else
        class="title"
      >
        Véhicule
      </h1>
      <h2
        v-if="id"
        class="subtitle"
      >
        Modification
      </h2>
      <h2
        v-else
        class="subtitle"
      >
        Création
      </h2>
    </header>
    <form
      class="box"
      @submit.prevent="edit(car)"
    >
      <ec-field
        label="Immatriculation"
        field-id="id"
      >
        <input
          id="id"
          v-model="car.id"
          :disabled="!!id"
          class="input"
        >
      </ec-field>
      <ec-field
        label="Label"
        field-id="label"
      >
        <input
          id="label"
          v-model="car.label"
          type="text"
          class="input"
        >
      </ec-field>
      <ec-field
        label="Modèle"
        field-id="model"
      >
        <search-car-models
          v-model="car.model"
          placeholder="Modèle"
        />
      </ec-field>
      <button
        v-if="id"
        type="submit"
        class="button is-primary"
      >
        <span class="icon is-small">
          <fa-icon :icon="['fas', 'save']" />
        </span>
        <span>Sauvegarder</span>
      </button>

      <button
        v-else
        type="submit"
        class="button is-primary"
      >
        <span class="icon is-small">
          <fa-icon :icon="['fas', 'plus']" />
        </span>
        <span>Créer</span>
      </button>
    </form>
  </main>
</template>

<script>
import ecField from '~/components/form/field.vue';
import { mapGetters } from 'vuex';
import SearchCarModels from '~/components/form/search-car-models';

const EDITABLE_FIELDS = ['id', 'label', 'model'];

export default {
  components: {
    SearchCarModels,
    ecField,
  },
  props: {
    car: {
      type: Object,
      default: () => ({}),
    },
  },
  asyncData({ params }) {
    return { campus: params.campus };
  },
  data() {
    return { id: this.car.id };
  },
  computed: {
    ...mapGetters({
      campus: 'context/campus',
    }),
    CarsAPI() {
      return this.$api.cars(this.campus, EDITABLE_FIELDS.join(','));
    },
  },
  methods: {
    async edit(car) {
      let data = {};
      if (this.id) {
        ({ data } = (await this.CarsAPI.patchCar(car.id, car)));
      } else {
        ({ data } = (await this.CarsAPI.postCar(car)));
      }

      this.$router.push(this.$context.buildCampusLink('cars-id-edit', {
        params: { id: data.id },
      }));
    },
  },
};
</script>
