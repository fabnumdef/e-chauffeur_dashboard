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

      <ec-field
        label="Capacité du véhicule"
        field-id="capacity"
      >
        <input
          id="capacity"
          v-model.number="carModel.capacity"
          class="input"
          type="number"
        >
      </ec-field>

      <button
        v-if="id"
        type="submit"
        class="button is-primary"
        :class="{'is-loading': loading}"
        :disabled="loading"
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
        :class="{'is-loading': loading}"
        :disabled="loading"
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
import toggleLoading from '~/helpers/mixins/toggle-loading';

const mask = 'id,label,capacity';

export default {
  mixins: [toggleLoading()],
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
      try {
        this.toggleLoading(true);
        if (this.id) {
          ({ data } = (await this.$api.carModels.patchCarModel(this.id, carModel, mask)));
        } else {
          ({ data } = (await this.$api.carModels.postCarModel(carModel, mask)));
        }

        this.$toast.success('Donnée enregistrée avec succès');
        this.$router.push({
          name: 'car-models-id-edit',
          params: { id: data.id },
        });
      } catch {
        this.$toast.error('Une erreur est survenue, merci de vérifier les champs.');
      }
      this.toggleLoading(false);
    },
  },
};
</script>
