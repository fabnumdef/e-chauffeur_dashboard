<template>
  <form
    @submit.prevent="edit(data, $event)"
  >
    <fieldset class="box">
      <legend class="subtitle">
        Configuration basique
      </legend>
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
        label="Nom"
        field-id="name"
        :error-message="getErrorMessage('name')"
      >
        <input
          id="name"
          v-model.trim="data.name"
          class="input"
          :class="getErrorClass('name')"
        >
      </ec-field>
      <div class="columns">
        <div class="column">
          <ec-field
            label="Numéro de téléphone (chauffeurs)"
            field-id="phone-drivers"
            :error-message="getErrorMessage('phone.drivers')"
          >
            <input
              id="phone-drivers"
              v-model.trim="data.phone.drivers"
              class="input"
              :class="getErrorClass('phone.drivers')"
            >
          </ec-field>
        </div>
        <div class="column">
          <ec-field
            label="Numéro de téléphone (public)"
            field-id="phone-everybody"
            :error-message="getErrorMessage('phone.everybody')"
          >
            <input
              id="phone-everybody"
              v-model.trim="data.phone.everybody"
              class="input"
              :class="getErrorClass('phone.everybody')"
            >
          </ec-field>
        </div>
      </div>
      <ec-field
        label="Jours ouvrés"
        field-id="workedDays"
        :error-message="getErrorMessage('workedDays')"
      >
        <weekdays-select
          id="workedDays"
          v-model="data.workedDays"
          :class="getErrorClass('workedDays')"
        />
      </ec-field>
      <div class="columns">
        <div class="column">
          <ec-field
            label="Heure d'embauche"
            field-id="min-worked-hours"
            :error-message="getErrorMessage('workedHours.start')"
          >
            <input
              id="min-worked-hours"
              v-model.trim="data.workedHours.start"
              class="input"
              type="number"
              min="0"
              max="24"
              :class="getErrorClass('workedHours.start')"
            >
          </ec-field>
        </div>
        <div class="column">
          <ec-field
            label="Heure de débauche"
            field-id="max-worked-hours"
            :error-message="getErrorMessage('workedHours.end')"
          >
            <input
              id="max-worked-hours"
              v-model.trim="data.workedHours.end"
              class="input"
              type="number"
              min="0"
              max="24"
              :class="getErrorClass('workedHours.end')"
            >
          </ec-field>
        </div>
        <div class="column">
          <ec-field
            label="Durée d'une course par défaut"
            field-id="ride-duration"
            :error-message="getErrorMessage('defaultRideDuration')"
          >
            <ride-duration
              id="ride-duration"
              v-model="data.defaultRideDuration"
              :class="getErrorClass('defaultRideDuration')"
            />
          </ec-field>
        </div>
      </div>
      <ec-field
        label="Distance à laquelle le soutenu peut réserver une course"
        field-id="reservation-scope"
        :error-message="getErrorMessage('defaultReservationScope')"
      >
        <reservation-scope
          v-model="data.defaultReservationScope"
          :class="getErrorClass('defaultReservationScope')"
        />
      </ec-field>
      <ec-field
        label="Catégories"
        field-id="categories"
        :error-message="getErrorMessage('categories')"
      >
        <search-categories
          v-model="data.categories"
          :class="getErrorClass('categories')"
        />
      </ec-field>
      <ec-field
        label="Coordonnées GPS"
        field-id="location"
        :error-message="getErrorMessage('location.coordinates')"
      >
        <ec-gps-point
          id="location"
          v-model="data.location"
          :class="getErrorClass('location.coordinates')"
        />
      </ec-field>
    </fieldset>
    <fieldset class="box">
      <legend class="subtitle">
        Configuration avancée
      </legend>
      <p>Ne modifiez cette rubrique uniquement en connaissance de cause.</p>
      <ec-field
        label="Timezone"
        field-id="timezone"
        :error-message="getErrorMessage('timezone')"
      >
        <input
          id="timezone"
          v-model.trim="data.timezone"
          class="input"
          :class="getErrorClass('timezone')"

          placeholder="Laissez vide pour garder la valeur par défaut"
        >
      </ec-field>
    </fieldset>
    <fieldset class="box">
      <save-button
        :loading="loading"
        :is-new="!id"
        has-alt
      />
    </fieldset>
  </form>
</template>

<script>
import ecGpsPoint from '~/components/form/gps-point.vue';
import searchCategories from '~/components/form/selects/categories.vue';
import weekdaysSelect from '~/components/form/weekdays.vue';
import reservationScope from '~/components/form/reservation-scope.vue';
import rideDuration from '~/components/form/ride-duration.vue';
import toggleLoading from '~/helpers/mixins/toggle-loading';
import titleMixin from '~/helpers/mixins/page-title';
import formatCoordinates from '~/helpers/format-coordinates';
import errorsManagementMixin from '~/helpers/mixins/errors-management';
import resetableMixin from '~/helpers/mixins/reset-data';
import saveButton, { NEXT_ACTION_KEY, NEXT_ACTION_LIST, NEXT_ACTION_NEW } from '~/components/crud/save-button.vue';

const EDITABLE_FIELDS = 'id,name,location,phone(drivers,everybody),categories(id,label),'
  + 'information,timezone,workedDays,workedHours,defaultRideDuration,defaultReservationScope';
export default {
  components: {
    ecGpsPoint,
    searchCategories,
    weekdaysSelect,
    rideDuration,
    saveButton,
    reservationScope,
  },
  mixins: [
    toggleLoading(),
    titleMixin('Base', 'Création'),
    errorsManagementMixin(),
    resetableMixin(function reset() {
      return {
        data: {
          phone: {},
          categories: [],
          workedHours: { start: 5, end: 23 },
          ...this.campus,
        },
      };
    }),
  ],
  props: {
    campus: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    const { name, id } = this.campus;
    this.setTitle(id ? `Base #${id}: ${name}` : 'Base', id ? 'Édition' : 'Création');
    return {
      id,
    };
  },
  methods: {
    async edit(campus, { submitter = {} } = {}) {
      return this.raceToggleLoading(() => this.handleCommonErrorsBehavior(async () => {
        const ApiCampuses = this.$api.query('campuses').setMask(EDITABLE_FIELDS);
        const formattedCampus = {
          ...campus,
          location: {
            coordinates: campus.location ? formatCoordinates(campus.location.coordinates) : null,
          },
        };
        let data = {};
        if (this.id) {
          ({ data } = (await ApiCampuses.edit(campus.id, formattedCampus)));
        } else {
          ({ data } = (await ApiCampuses.create(formattedCampus)));
        }
        this.$toast.success('Base enregistrée avec succès');
        switch (submitter.getAttribute(NEXT_ACTION_KEY)) {
          case NEXT_ACTION_NEW:
            this.reset();
            return this.$router.push({
              name: 'campuses-new',
            });
          case NEXT_ACTION_LIST:
            return this.$router.push({
              name: 'campuses',
            });
          default:
            return this.$router.push({
              name: 'campuses-id-edit',
              params: { id: data.id },
            });
        }
      }));
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/css/head";
.box legend.subtitle {
  color: $text;
  background: $white;
  padding: $size-small/2 $size-small;
  margin: 0;
  border-radius: $radius-small;
}
</style>
