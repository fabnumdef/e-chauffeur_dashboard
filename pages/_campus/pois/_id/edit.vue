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
      id="status"
      label="Statut"
      :error-message="getErrorMessage('enabled')"
    >
      <div>
        <label
          for="status-enabled"
          class="radio"
        >Activé
          <input
            id="status-enabled"
            v-model="data.enabled"
            type="radio"
            :value="true"
            :class="getErrorClass('enabled')"
          >
        </label>
        <label
          for="status-disabled"
          class="radio"
        >Désactivé
          <input
            id="status-disabled"
            v-model="data.enabled"
            type="radio"
            :value="false"
            :class="getErrorClass('enabled')"
          >
        </label>
      </div>
    </ec-field>

    <ec-field
      label="Coordonnées GPS"
      field-id="location"
      :error-message="getErrorMessage('location')"
    >
      <ec-gps-point
        id="location"
        v-model="data.location"
        :class="getErrorClass('location')"
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
import formatCoordinates from '~/helpers/format-coordinates';

import ecGpsPoint from '~/components/form/gps-point.vue';

import toggleLoading from '~/helpers/mixins/toggle-loading';
import errorsManagementMixin from '~/helpers/mixins/errors-management';
import resetableMixin from '~/helpers/mixins/reset-data';
import titleMixin from '~/helpers/mixins/page-title';
import saveButton, { saveButtonHandler } from '~/components/crud/save-button.vue';

export default {
  components: {
    ecGpsPoint,
    saveButton,
  },
  mixins: [
    toggleLoading(),
    titleMixin('Lieu', 'Création'),
    errorsManagementMixin(),
    resetableMixin(function reset() {
      return {
        data: {
          location: {
            coordinates: [],
          },
          ...this.poi,
        },
      };
    }),
  ],
  props: {
    poi: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    const { id } = this.poi;
    this.setTitle(id ? `Lieu #${id}` : 'Lieu', id ? 'Édition' : 'Création');
    return { id };
  },
  computed: {
    ...mapGetters({
      campus: 'context/campus',
    }),
  },
  methods: {
    async edit(poi, event) {
      return this.raceToggleLoading(() => this.handleCommonErrorsBehavior(async () => {
        const ApiPois = this.$api.query('pois').setMask('id,label,location(coordinates),campus');
        const formattedPoi = {
          ...poi,
          campus: this.campus,
          location: {
            coordinates: formatCoordinates(poi.location.coordinates),
          },
        };
        let data = {};
        if (this.id) {
          ({ data } = (await ApiPois.edit(poi.id, formattedPoi)));
        } else {
          ({ data } = (await ApiPois.create(formattedPoi)));
        }
        this.$toast.success('Lieu enregistré avec succès');
        return saveButtonHandler.call(this, event, {
          onNew: () => {
            this.reset();
            return this.$router.push(this.campusLink('pois-new'));
          },
          onList: () => this.$router.push(this.campusLink('pois')),
          onOther: () => this.$router.push(this.campusLink('pois-id-edit', {
            params: data,
          })),
        });
      }));
    },
  },
};
</script>
