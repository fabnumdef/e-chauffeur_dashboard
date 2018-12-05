<template>
  <main>
    <header>
      <h1
        v-if="id"
        class="title">Car #{{ id }}</h1>
      <h1
        v-else
        class="title">Car</h1>
      <h2
        v-if="id"
        class="subtitle">Edit</h2>
      <h2
        v-else
        class="subtitle">New</h2>
    </header>
    <form @submit.prevent="edit(car)">
      <ec-field
        label="Licence plate"
        field-id="id">
        <input
          id="id"
          :disabled="!!id"
          v-model="car.id"
          class="input">
      </ec-field>
      <ec-field
        label="Label"
        field-id="label">
        <input
          id="label"
          v-model="car.label"
          type="text"
          class="input">
      </ec-field>
      <ec-field
        label="Model"
        field-id="model">
        <search-car-models
          v-model="car.model"
          placeholder="Modèle"/>
      </ec-field>
      <button
        v-if="id"
        type="submit"
        class="button is-primary">
        <span class="icon is-small">
          <fa-icon :icon="['fas', 'save']" />
        </span>
        <span>Save</span>
      </button>

      <button
        v-else
        type="submit"
        class="button is-primary">
        <span class="icon is-small">
          <fa-icon :icon="['fas', 'plus']" />
        </span>
        <span>Create</span>
      </button>
    </form>
  </main>
</template>

<script>
import ecField from '~/components/form/field.vue';
import searchRights from '~/components/form/search-rights.vue';
import searchCampuses from '~/components/form/search-campuses.vue';
import { mapGetters } from 'vuex';
import SearchCarModels from '~/components/form/search-car-models';

const EDITABLE_FIELDS = ['id', 'label', 'model'];

export default {
  components: {
    SearchCarModels,
    ecField,
    searchRights,
    searchCampuses,
  },
  props: {
    car: {
      type: Object,
      default: () => ({}),
    },
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
