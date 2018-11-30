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
        v-if="!id"
        label="ID"
        field-id="id">
        <input
          id="id"
          v-model="car.id"
          class="input">
      </ec-field>

      <ec-field>
        <search-rights v-model="car.rights" />
      </ec-field>

      <ec-field>
        <search-campuses v-model="car.campuses" />
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

export default {
  components: {
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
  methods: {
    async edit(car) {
      let data = {};
      if (this.id) {
        ({ data } = (await this.$api.cars.patchCar(car.id, car, 'id')));
      } else {
        ({ data } = (await this.$api.cars.postCar(car, 'id')));
      }

      this.$router.push({
        name: 'cars-id-edit',
        params: { id: data.id },
      });
    },
  },
};
</script>
