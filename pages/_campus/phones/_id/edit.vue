<template>
  <form
    class="box"
    @submit.prevent="edit(data, $event)"
  >
    <ec-field
      label="S/N"
      field-id="id"
      :error-message="getErrorMessage('id')"
    >
      <input
        id="id"
        v-model.trim="data.id"
        :disabled="!!id"
        type="text"
        class="input"
        :class="getErrorClass('id')"
      >
    </ec-field>
    <ec-field
      label="IMEI"
      field-id="imei"
      :error-message="getErrorMessage('imei')"
    >
      <input
        id="imei"
        v-model.trim="data.imei"
        type="text"
        class="input"
        :class="getErrorClass('imei')"
      >
    </ec-field>
    <ec-field
      label="Modèle"
      field-id="model"
      :error-message="getErrorMessage('model')"
    >
      <ec-search-phone-models
        id="model"
        v-model="data.model"
        :class="getErrorClass('model')"
      />
    </ec-field>
    <ec-field
      label="N° de téléphone"
      field-id="number"
      :error-message="getErrorMessage('number')"
    >
      <input
        id="number"
        v-model.trim="data.number"
        type="tel"
        class="input"
        :class="getErrorClass('number')"
      >
    </ec-field>
    <ec-field
      label="Etat"
      field-id="state"
      :error-message="getErrorMessage('state')"
    >
      <ec-search-phone-states
        id="state"
        v-model="data.state"
        :class="getErrorClass('state')"
      />
    </ec-field>
    <ec-field
      label="Commentaires"
      field-id="comments"
      :error-message="getErrorMessage('comments')"
    >
      <textarea
        id="comments"
        v-model.trim="data.comments"
        class="textarea"
        :class="getErrorClass('comments')"
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
import ecSearchPhoneStates from '~/components/form/selects/phone-states.vue';
import ecSearchPhoneModels from '~/components/form/selects/phone-models.vue';

import toggleLoading from '~/helpers/mixins/toggle-loading';
import errorsManagementMixin from '~/helpers/mixins/errors-management';
import resetableMixin from '~/helpers/mixins/reset-data';
import titleMixin from '~/helpers/mixins/page-title';
import saveButton, { NEXT_ACTION_KEY, NEXT_ACTION_LIST, NEXT_ACTION_NEW } from '~/components/crud/save-button.vue';

const EDITABLE_FIELDS = [
  'id',
  'imei',
  'number',
  'model',
  'campus',
  'state',
  'comments',
];
export default {
  components: {
    saveButton,
    ecSearchPhoneStates,
    ecSearchPhoneModels,
  },
  mixins: [
    toggleLoading(),
    titleMixin('Téléphone', 'Création'),
    errorsManagementMixin(),
    resetableMixin(function reset() {
      return {
        data: {
          location: {
            coordinates: [],
          },
          ...this.phone,
        },
      };
    }),
  ],
  props: {
    phone: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    const { id } = this.phone;
    this.setTitle(id ? `Téléphone #${id}` : 'Téléphone', id ? 'Édition' : 'Création');
    return { id };
  },
  computed: {
    ...mapGetters({
      campus: 'context/campus',
    }),
  },
  methods: {
    async edit(phone, { submitter }) {
      return this.raceToggleLoading(() => this.handleCommonErrorsBehavior(async () => {
        const ApiPhones = this.$api.query('phones').setMask(EDITABLE_FIELDS);
        let data = {};

        if (this.id) {
          ({ data } = (await ApiPhones.edit(phone.id, { ...phone, campus: this.campus })));
        } else {
          ({ data } = (await ApiPhones.create({ ...phone, campus: this.campus })));
        }
        this.$toast.success('Téléphone enregistré avec succès');
        switch (submitter.getAttribute(NEXT_ACTION_KEY)) {
          case NEXT_ACTION_NEW:
            this.reset();
            return this.$router.push(this.$context.buildCampusLink('phones-new'));
          case NEXT_ACTION_LIST:
            return this.$router.push(this.$context.buildCampusLink('phones'));
          default:
            return this.$router.push(this.$context.buildCampusLink('phones-id-edit', {
              params: { id: data.id },
            }));
        }
      }));
    },
  },
};
</script>
