<template>
  <form
    class="box"
    @submit.prevent="edit(shuttleFactory, $event)"
  >
    <ec-field
      label="Label"
      field-id="label"
      :error-message="getErrorMessage('label')"
      required
    >
      <input
        id="label"
        v-model.trim="shuttleFactory.label"
        type="text"
        class="input"
        :class="getErrorClass('label')"
      >
    </ec-field>

    <ec-field
      label="Catégorie"
      field-id="category"
      :error-message="getErrorMessage('category')"
    >
      <search-category
        id="category"
        v-model="shuttleFactory.category"
        :class="getErrorClass('category')"
      />
    </ec-field>

    <ec-field
      label="Temps moyen entre chaque arrêt (en minutes)"
      field-id="reachDuration"
      :error-message="getErrorMessage('reachDuration')"
    >
      <input
        id="reachDuration"
        v-model="shuttleFactory.reachDuration"
        class="input"
        type="number"
        :class="getErrorClass('reachDuration')"
      >
    </ec-field>

    <stops-table
      :shuttle-factory="shuttleFactory"
      :selected-stop="selectedStop"
    />

    <ec-field
      label="Ajouter un nouvel arrêt"
      field-id="stop"
      :error-message="getErrorMessage('stops')"
    >
      <search-poi
        v-model="selectedStop"
        placeholder="Sélectionner un lieu"
        :current-campus="campus"
        :class="getErrorClass('stops')"
      />
    </ec-field>

    <button
      class="button is-info"
      type="button"
      :disabled="!selectedStop"
      @click="addStop"
    >
      Ajouter
    </button>

    <ec-field
      label="Commentaires"
      field-id="comments"
      :error-message="getErrorMessage('comments')"
    >
      <textarea
        id="comments"
        v-model.trim="shuttleFactory.comments"
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
import stopsTable from '~/components/crud/stops-table.vue';
import searchCategory from '~/components/form/search-campus-category.vue';
import searchPoi from '~/components/form/search-poi.vue';
import saveButton, { saveButtonHandler } from '~/components/crud/save-button.vue';
import toggleLoading from '~/helpers/mixins/toggle-loading';
import errorsManagementMixin from '~/helpers/mixins/errors-management';
import resetableMixin from '~/helpers/mixins/reset-data';
import titleMixin from '~/helpers/mixins/page-title';

const EDITABLE_FIELDS = ['id', 'label', 'category', 'stops', 'comments', 'reachDuration'];

export default {
  components: {
    stopsTable,
    searchCategory,
    searchPoi,
    saveButton,
  },
  mixins: [
    toggleLoading(),
    titleMixin('Trajet de navette', 'Création'),
    errorsManagementMixin(),
    resetableMixin(function reset() {
      return {
        data: { ...this.shuttleFactory },
      };
    }),
  ],
  props: {
    shuttleFactory: {
      type: Object,
      default: () => ({
        stops: [],
      }),
    },
  },
  data() {
    const { label, id } = this.shuttleFactory;
    this.setTitle(id ? `Trajet de navette #${label}` : 'Trajet de navette', id ? 'Édition' : 'Création');
    return { id, selectedStop: null };
  },
  computed: {
    ...mapGetters({
      campus: 'context/campus',
    }),
  },
  methods: {
    addStop() {
      const alreadyExists = this.shuttleFactory.stops.findIndex(({ label }) => label === this.selectedStop.label) > -1;
      if (
        !alreadyExists
        || (window && window.confirm('Attention, cet arrêt est déjà listé, êtes-vous sûr de vouloir l\'ajouter ?'))
      ) {
        this.shuttleFactory.stops.push(this.selectedStop);
        this.selectedStop = null;
      }
    },
    async edit(shuttleFactory, event) {
      return this.raceToggleLoading(() => this.handleCommonErrorsBehavior(async () => {
        const ApiShuttleFactories = this.$api.query('shuttleFactories').setMask(EDITABLE_FIELDS);
        const formattedShuttleFactory = { ...shuttleFactory, campus: this.campus };
        let data = {};
        if (this.id) {
          ({ data } = (await ApiShuttleFactories.edit(formattedShuttleFactory.id, formattedShuttleFactory)));
        } else {
          ({ data } = (await ApiShuttleFactories.create(formattedShuttleFactory)));
        }
        this.$toast.success('Trajet enregistré avec succès');
        return saveButtonHandler.call(this, event, {
          onNew: () => {
            this.reset();
            return this.$router.push(this.campusLink('shuttle-factories-new'));
          },
          onList: () => this.$router.push(this.campusLink('shuttle-factories')),
          onOther: () => this.$router.push(this.campusLink('shuttle-factories-id-edit', {
            params: data,
          })),
        });
      }));
    },
  },
};
</script>
