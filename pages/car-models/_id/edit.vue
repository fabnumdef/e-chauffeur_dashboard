<template>
  <main>
    <header>
      <h1
        v-if="id"
        class="title"
      >
        Modèle de véhicule #{{ id }}
      </h1>
      <h1
        v-else
        class="title"
      >
        Modèle de véhicule
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
      @submit.prevent="edit(carModel)"
    >
      <ec-field
        label="ID"
        field-id="id"
      >
        <input
          id="id"
          v-model.trim="carModel.id"
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
          v-model.trim="carModel.label"
          class="input"
        >
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

export default {
  components: {
    ecField,
  },
  props: {
    carModel: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return { id: this.carModel.id };
  },
  methods: {
    async edit(carModel) {
      let data = {};
      if (this.id) {
        ({ data } = (await this.$api.carModels.patchCarModel(this.id, carModel, 'id,label')));
      } else {
        ({ data } = (await this.$api.carModels.postCarModel(carModel, 'id,label')));
      }

      this.$router.push({
        name: 'car-models-id-edit',
        params: { id: data.id },
      });
    },
  },
};
</script>
