<template>
  <main>
    <header>
      <h1
        v-if="id"
        class="title"
      >
        Base #{{ id }} : {{ campus.name }}
      </h1>
      <h1
        v-else
        class="title"
      >
        Base
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
        Nouveau
      </h2>
    </header>
    <form
      @submit.prevent="edit(campus)"
    >
      <fieldset class="box">
        <legend class="subtitle">
          Configuration basique
        </legend>
        <ec-field
          label="ID"
          field-id="id"
        >
          <input
            id="id"
            v-model.trim="campus.id"
            :disabled="!!id"
            class="input"
          >
        </ec-field>

        <ec-field
          label="Nom"
          field-id="name"
        >
          <input
            id="name"
            v-model.trim="campus.name"
            class="input"
          >
        </ec-field>
        <div class="columns">
          <div class="column">
            <ec-field
              label="Numéro de téléphone (chauffeurs)"
              field-id="phone-drivers"
            >
              <input
                id="phone-drivers"
                v-model.trim="campus.phone.drivers"
                class="input"
              >
            </ec-field>
          </div>
          <div class="column">
            <ec-field
              label="Numéro de téléphone (public)"
              field-id="phone-everybody"
            >
              <input
                id="phone-everybody"
                v-model.trim="campus.phone.everybody"
                class="input"
              >
            </ec-field>
          </div>
        </div>
        <ec-field
          label="Jours ouvrés"
          field-id="workedDays"
        >
          <weekdays-select
            id="workedDays"
            v-model="campus.workedDays"
          />
        </ec-field>
        <div class="columns">
          <div class="column">
            <ec-field
              label="Heure d'embauche"
              field-id="min-worked-hours"
            >
              <input
                id="min-worked-hours"
                v-model.trim="campus.workedHours.start"
                class="input"
                type="number"
                min="0"
                max="24"
              >
            </ec-field>
          </div>
          <div class="column">
            <ec-field
              label="Heure de débauche"
              field-id="max-worked-hours"
            >
              <input
                id="max-worked-hours"
                v-model.trim="campus.workedHours.end"
                class="input"
                type="number"
                min="0"
                max="24"
              >
            </ec-field>
          </div>
          <div class="column">
            <ec-field
              label="Durée d'une course par défaut"
              field-id="ride-duration"
            >
              <ride-duration
                id="ride-duration"
                v-model="campus.defaultRideDuration"
              />
            </ec-field>
          </div>
        </div>
        <ec-field
          label="Distance à laquelle le soutenu peut réserver une course"
          field-id="reservation-scope"
        >
          <div class="columns">
            <div class="column">
              <vue-multiselect
                v-model="selectScope"
                :options="multiSelectOptions"
                placeholder="Veuillez sélectionner une unité"
                track-by="value"
                label="label"
              />
            </div>
            <div class="column">
              <input
                id="reservation-scope"
                v-model="localReservationScope"
                class="input"
                type="number"
                :disabled="!selectScope"
                :placeholder="!selectScope && 'Veuillez sélectionner une unité'"
              >
            </div>
          </div>
        </ec-field>
        <ec-field
          label="Catégories"
          field-id="categories"
        >
          <search-categories v-model="campus.categories" />
        </ec-field>
        <ec-field
          label="Coordonnées GPS"
          field-id="location"
        >
          <ec-gps-point
            id="location"
            v-model="campus.location"
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
        >
          <input
            id="timezone"
            v-model.trim="campus.timezone"
            class="input"
          >
        </ec-field>
      </fieldset>
      <fieldset class="box">
        <button
          v-if="id"
          type="submit"
          class="button is-primary"
          :class="loading && 'is-loading'"
          :disabled="loading"
        >
          <span class="icon is-small">
            <fa-icon :icon="['fas', 'save']" />
          </span>
          <span>Modifier</span>
        </button>

        <button
          v-else
          type="submit"
          class="button is-primary"
          :class="loading && 'is-loading'"
          :disabled="loading"
        >
          <span class="icon is-small">
            <fa-icon :icon="['fas', 'plus']" />
          </span>
          <span>Créer</span>
        </button>
      </fieldset>
    </form>
  </main>
</template>

<script>
import ecField from '~/components/form/field.vue';
import ecGpsPoint from '~/components/form/gps-point.vue';
import searchCategories from '~/components/form/search-categories.vue';
import weekdaysSelect from '~/components/form/weekdays.vue';
import rideDuration from '~/components/form/ride-duration.vue';

const EDITABLE_FIELDS = 'id,name,location,phone(drivers,everybody),categories(id,label),'
  + 'information,timezone,workedDays,workedHours,defaultRideDuration,defaultReservationScope';
export default {
  components: {
    ecField,
    ecGpsPoint,
    searchCategories,
    weekdaysSelect,
    rideDuration,
  },
  props: {
    campus: {
      type: Object,
      default: () => ({ phone: {}, categories: [], workedHours: { start: 5, end: 23 } }),
    },
  },
  data() {
    return {
      loading: false,
      id: this.campus.id,
      selectScope: {
        label: 'Unité : heure',
        value: 'hour',
      },
      multiSelectOptions: [
        { label: 'Unité : heure', value: 'hour' },
        { label: 'Unité : jour', value: 'day' },
      ],
    };
  },
  computed: {
    localReservationScope: {
      get() {
        if (this.selectScope.value === 'day') {
          return Math.floor(this.campus.defaultReservationScope / 3600 / 24);
        }
        if (this.selectScope.value === 'hour') {
          return Math.floor(this.campus.defaultReservationScope / 3600);
        }
        return null;
      },
      set(value) {
        if (this.selectScope.value === 'day') {
          this.campus.defaultReservationScope = value * 3600 * 24;
        }
        if (this.selectScope.value === 'hour') {
          this.campus.defaultReservationScope = value * 3600;
        }
        return value;
      },
    },
  },
  methods: {
    async edit(campus) {
      let data = {};
      try {
        this.toggleLoading();
        if (this.id) {
          ({ data } = (await this.$api.campuses.patchCampus(campus.id, campus, EDITABLE_FIELDS)));
        } else {
          ({ data } = (await this.$api.campuses.postCampus(campus, EDITABLE_FIELDS)));
        }
        this.$toast.success('Donnée enregistrée avec succès');
        this.$router.push({
          name: 'campuses-id-edit',
          params: { id: data.id },
        });
      } catch {
        this.$toast.error('Une erreur est survenue, merci de vérifier les champs.');
      }
      this.toggleLoading();
    },
    toggleLoading() {
      this.loading = !this.loading;
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
.select select {
  width: 100%;
}
</style>
