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
import saveButton, { saveButtonHandler } from '~/components/crud/save-button.vue';

export default {
  components: {
    saveButton,
  },
  mixins: [
    toggleLoading(),
    titleMixin('Catégorie', 'Création'),
    errorsManagementMixin(),
    resetableMixin(function reset() {
      return {
        data: { ...this.category },
      };
    }),
  ],
  props: {
    category: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    const { label, id } = this.category;
    this.setTitle(id ? `Catégorie #${id}: ${label}` : 'Catégorie', id ? 'Édition' : 'Création');
    return { id };
  },
  methods: {
    async edit(category, event) {
      return this.raceToggleLoading(() => this.handleCommonErrorsBehavior(async () => {
        const ApiCategories = this.$api.query('categories').setMask('id,label');
        let data = {};
        if (this.id) {
          ({ data } = (await ApiCategories.edit(category.id, category)));
        } else {
          ({ data } = (await ApiCategories.create(category)));
        }
        this.$toast.success('Catégorie enregistrée avec succès');
        return saveButtonHandler.call(this, event, {
          baseRoute: 'categories',
          routeParams: data,
        });
      }));
    },

  },
};
</script>
