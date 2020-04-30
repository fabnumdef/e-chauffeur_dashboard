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
    titleMixin('Modèle de téléphone', 'Création'),
    errorsManagementMixin(),
    resetableMixin(function reset() {
      return {
        data: { ...this.phoneModel },
      };
    }),
  ],
  props: {
    phoneModel: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    const { label, id } = this.phoneModel;
    this.setTitle(id ? `Modèle de téléphone #${id}: ${label}` : 'Modèle de téléphone', id ? 'Édition' : 'Création');
    return { id };
  },
  methods: {
    async edit(phoneModel, { submitter }) {
      return this.raceToggleLoading(() => this.handleCommonErrorsBehavior(async () => {
        const ApiPhoneModels = this.$api.query('phoneModels').setMask('id,label');
        let data = {};
        if (this.id) {
          ({ data } = (await ApiPhoneModels.edit(phoneModel.id, phoneModel)));
        } else {
          ({ data } = (await ApiPhoneModels.create(phoneModel)));
        }
        this.$toast.success('Modèle de véhicule enregistrée avec succès');
        switch (submitter.getAttribute(NEXT_ACTION_KEY)) {
          case NEXT_ACTION_NEW:
            this.reset();
            return this.$router.push({
              name: 'phone-models-new',
            });
          case NEXT_ACTION_LIST:
            return this.$router.push({
              name: 'phone-models',
            });
          default:
            return this.$router.push({
              name: 'phone-models-id-edit',
              params: { id: data.id },
            });
        }
      }));
    },
  },
};
</script>
