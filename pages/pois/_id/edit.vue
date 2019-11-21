<template>
  <main>
    <header>
      <h1
        v-if="id"
        class="title"
      >
        Lieu #{{ id }}
      </h1>
      <h1
        v-else
        class="title"
      >
        Lieu
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
      @submit.prevent="edit(poi)"
    >
      <ec-field
        label="ID"
        field-id="id"
      >
        <input
          id="id"
          v-model="poi.id"
          :disabled="!!id"
          class="input"
        >
      </ec-field>
      <ec-field
        label="Campus"
      >
        <search-campus
          v-model="poi.campus"
          class="search-campus"
        />
      </ec-field>

      <ec-field
        id="status"
        label="Statut"
      >
        <div>
          <label
            for="status-enabled"
            class="radio"
          >Activé
            <input
              id="status-enabled"
              type="radio"
              v-model="poi.enabled"
              :value="true"
            >
          </label>
          <label
            for="status-disabled"
            class="radio"
          >Désactivé
            <input
              id="status-disabled"
              type="radio"
              v-model="poi.enabled"
              :value="false"
            >
          </label>
        </div>
      </ec-field>

      <ec-field
        label="Label"
        field-id="label"
      >
        <input
          id="label"
          v-model="poi.label"
          class="input"
        >
      </ec-field>

      <ec-field
        label="Coordonnées GPS"
        field-id="location"
      >
        <ec-gps-point
          id="location"
          v-model="poi.location"
        />
      </ec-field>

      <button
        v-if="id"
        type="submit"
        class="button is-primary"
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
import ecField from '~/components/form/field.vue';
import ecGpsPoint from '~/components/form/gps-point.vue';
import searchCampus from '~/components/form/search-campus.vue';

export default {
  components: {
    ecField,
    ecGpsPoint,
    searchCampus,
  },
  props: {
    poi: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return { id: this.poi.id };
  },
  methods: {
    async edit(poi) {
      let data = {};
      if (this.id) {
        ({ data } = (await this.$api.pois(this.poi.campus, 'id,label,location(coordinates),campus,enabled')
          .patchPoi(this.id, poi)));
      } else {
        ({ data } = (await this.$api.pois(this.poi.campus, 'id,label,location(coordinates),campus,enabled')
          .postPoi(poi)));
      }

      this.$router.push({
        name: 'pois-id-edit',
        params: { id: data.id },
      });
    },
  },
};
</script>
