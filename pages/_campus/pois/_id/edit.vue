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
          v-model.trim="poi.id"
          :disabled="!!id"
          class="input"
        >
      </ec-field>

      <ec-field
        label="Label"
        field-id="label"
      >
        <input
          id="label"
          v-model.trim="poi.label"
          class="input"
        >
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
              v-model="poi.enabled"
              type="radio"
              :value="true"
            >
          </label>
          <label
            for="status-disabled"
            class="radio"
          >Désactivé
            <input
              id="status-disabled"
              v-model="poi.enabled"
              type="radio"
              :value="false"
            >
          </label>
        </div>
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
import { mapGetters } from 'vuex';
import ecField from '~/components/form/field.vue';
import ecGpsPoint from '~/components/form/gps-point.vue';

export default {
  components: {
    ecField,
    ecGpsPoint,
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
  computed: {
    ...mapGetters({
      campus: 'context/campus',
    }),
    PoisAPI() {
      const { id, name } = this.campus;
      return this.$api.pois({ id, name }, 'id,label,location(coordinates),campus');
    },
  },
  methods: {
    async edit(poi) {
      let data = {};
      try {
        if (this.id) {
          ({ data } = (await this.PoisAPI.patchPoi(this.id, poi)));
        } else {
          ({ data } = (await this.PoisAPI.postPoi(poi)));
        }
        this.$toast.success('Le lieu a bien été mis à jour');
        this.$router.push(this.$context.buildCampusLink('pois-id-edit', {
          params: { id: data.id },
        }));
      } catch (err) {
        this.$toast.error("L'édition du lieu n'a pas fonctionné");
      }
    },
  },
};
</script>
