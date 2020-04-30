<template>
  <form
    class="box"
    @submit.prevent="edit(data, $event)"
  >
    <ec-field
      label="ID"
      field-id="id"
      :error-message="getErrorMessage('id')"
    >
      <input
        id="id"
        v-model.trim="data.id"
        :disabled="!!id"
        class="input"
        :class="getErrorClass('id')"
      >
    </ec-field>

    <ec-field
      label="Label"
      field-id="label"
      :error-message="getErrorMessage('label')"
    >
      <input
        id="label"
        v-model.trim="data.label"
        class="input"
        :class="getErrorClass('label')"
      >
    </ec-field>

    <ec-field
      label="Capacité du véhicule"
      field-id="capacity"
      :error-message="getErrorMessage('capacity')"
    >
      <input
        id="capacity"
        v-model.number="data.capacity"
        class="input"
        type="number"
        :class="getErrorClass('capacity')"
      >
    </ec-field>

    <save-button
      :loading="loading"
      :is-new="!id"
      has-alt
    />
  </form>
</template>

<script>
import toggleLoading from '~/helpers/mixins/toggle-loading';
import errorsManagementMixin from '~/helpers/mixins/errors-management';
import resetableMixin from '~/helpers/mixins/reset-data';
import titleMixin from '~/helpers/mixins/page-title';
import saveButton, { NEXT_ACTION_KEY, NEXT_ACTION_LIST, NEXT_ACTION_NEW } from '~/components/crud/save-button.vue';

export default {
  components: {
    saveButton,
  },
  mixins: [
    toggleLoading(),
    titleMixin('Modèle de véhicule', 'Création'),
    errorsManagementMixin(),
    resetableMixin(function reset() {
      return {
        data: { ...this.carModel },
      };
    }),
  ],
  props: {
    carModel: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    const { label, id } = this.carModel;
    this.setTitle(id ? `Modèle de véhicule #${id}: ${label}` : 'Modèle de véhicule', id ? 'Édition' : 'Création');
    return { id };
  },
  methods: {
    async edit(carModel, { submitter }) {
      return this.raceToggleLoading(() => this.handleCommonErrorsBehavior(async () => {
        const ApiCarModels = this.$api.query('carModels').setMask('id,label,capacity');
        let data = {};
        if (this.id) {
          ({ data } = (await ApiCarModels.edit(carModel.id, carModel)));
        } else {
          ({ data } = (await ApiCarModels.create(carModel)));
        }
        this.$toast.success('Modèle de véhicule enregistrée avec succès');
        switch (submitter.getAttribute(NEXT_ACTION_KEY)) {
          case NEXT_ACTION_NEW:
            this.reset();
            return this.$router.push({
              name: 'car-models-new',
            });
          case NEXT_ACTION_LIST:
            return this.$router.push({
              name: 'car-models',
            });
          default:
            return this.$router.push({
              name: 'car-models-id-edit',
              params: { id: data.id },
            });
        }
      }));
    },
  },
};
</script>
