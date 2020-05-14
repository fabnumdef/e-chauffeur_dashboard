<template>
  <form
    class="box"
    @submit.prevent="edit(data, $event)"
  >
    <ec-field
      label="Immatriculation"
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
        type="text"
        class="input"
        :class="getErrorClass('label')"
      >
    </ec-field>
    <ec-field
      label="Modèle"
      field-id="model"
      :error-message="getErrorMessage('model')"
    >
      <search-car-models
        v-model="data.model"
        placeholder="Modèle"
        :class="getErrorClass('model')"
      />
    </ec-field>
    <save-button
      :loading="loading"
      :is-new="!id"
      has-alt
    />
  </form>
</template>

<script>
import { mapGetters } from 'vuex';
import searchCarModels from '~/components/form/selects/car-models.vue';
import toggleLoading from '~/helpers/mixins/toggle-loading';
import errorsManagementMixin from '~/helpers/mixins/errors-management';
import resetableMixin from '~/helpers/mixins/reset-data';
import titleMixin from '~/helpers/mixins/page-title';
import saveButton, { saveButtonHandler } from '~/components/crud/save-button.vue';

const EDITABLE_FIELDS = ['id', 'label', 'model'];

export default {
  components: {
    saveButton,
    searchCarModels,
  },
  mixins: [
    toggleLoading(),
    titleMixin('Véhicule', 'Création'),
    errorsManagementMixin(),
    resetableMixin(function reset() {
      return {
        data: {
          location: {
            coordinates: [],
          },
          ...this.car,
        },
      };
    }),
  ],
  props: {
    car: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    const { id } = this.car;
    this.setTitle(id ? `Véhicule #${id}` : 'Véhicule', id ? 'Édition' : 'Création');
    return { id };
  },
  computed: {
    ...mapGetters({
      campus: 'context/campus',
    }),
  },
  methods: {
    async edit(car, event) {
      return this.raceToggleLoading(() => this.handleCommonErrorsBehavior(async () => {
        const ApiCars = this.$api.query('cars').setMask(EDITABLE_FIELDS).setCampus(this.campus.id);
        let data = {};

        if (this.id) {
          ({ data } = (await ApiCars.edit(car.id, { ...car, campus: this.campus })));
        } else {
          ({ data } = (await ApiCars.create({ ...car, campus: this.campus })));
        }
        this.$toast.success('Véhicule enregistré avec succès');
        return saveButtonHandler.call(this, event, {
          onNew: () => {
            this.reset();
            return this.$router.push(this.campusLink('cars-new'));
          },
          onList: () => this.$router.push(this.campusLink('cars')),
          onOther: () => this.$router.push(this.campusLink('cars-id-edit', {
            params: data,
          })),
        });
      }));
    },
  },
};
</script>
