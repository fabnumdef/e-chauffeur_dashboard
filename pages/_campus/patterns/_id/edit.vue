<template>
  <main>
    <header>
      <h1 class="title">
        Trajet <em v-if="pattern.id">{{ pattern.id }}</em>
      </h1>
      <h2 class="subtitle">
        {{ pattern.id ? 'Modification' : 'Création' }}
      </h2>
    </header>
    <form
      class="box"
      @submit.prevent="edit(pattern)"
    >
      <ec-field
        label="Label"
        field-id="label"
        required
      >
        <input
          id="label"
          v-model.trim="pattern.label"
          type="text"
          class="input"
        >
      </ec-field>

      <ec-field
        label="Catégorie"
        field-id="category"
      >
        <search-category
          id="category"
          v-model="pattern.category"
        />
      </ec-field>

      <ec-field
        label="Temps moyen entre chaque arrêt (en minutes)"
        field-id="reachDuration"
      >
        <input
          id="reachDuration"
          v-model="pattern.reachDuration"
          class="input"
          type="number"
        >
      </ec-field>

      <stops-table
        :pattern="pattern"
      />

      <ec-field
        label="Ajouter un nouvel arrêt"
        field-id="stop"
      >
        <search-poi
          v-model="selectedStop"
          placeholder="Sélectionner un lieu"
          :current-campus="campus"
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
      >
        <textarea
          id="comments"
          v-model.trim="pattern.comments"
          class="textarea"
        />
      </ec-field>

      <button
        v-if="pattern.id"
        type="submit"
        class="button is-primary"
        :class="{'is-loading': loading}"
        :disabled="loading"
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
        :class="{'is-loading': loading}"
        :disabled="loading"
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
import stopsTable from '~/components/crud/stops-table.vue';
import searchCategory from '~/components/form/search-campus-category.vue';
import searchPoi from '~/components/form/search-poi.vue';
import toggleLoadingMixin from '~/helpers/mixins/toggle-loading';

const EDITABLE_FIELDS = ['label', 'category', 'stops', 'comments', 'reachDuration'];

export default {
  components: {
    stopsTable,
    ecField,
    searchCategory,
    searchPoi,
  },
  mixins: [
    toggleLoadingMixin,
  ],
  props: {
    pattern: {
      type: Object,
      default: () => ({
        stops: [],
      }),
    },
  },
  computed: {
    ...mapGetters({
      campus: 'context/campus',
    }),
    apiCall() {
      const mask = ['id', ...EDITABLE_FIELDS].join(',');
      return this.$api.patterns(this.campus, mask);
    },
  },
  methods: {
    async edit(pattern) {
      let data = {};
      try {
        this.toggleLoading(true);
        if (this.pattern.id) {
          ({ data } = (await this.apiCall.patchPattern(pattern.id, pattern)));
        } else {
          ({ data } = (await this.apiCall.postPattern(pattern)));
        }
        this.$toast.success('Donnée sauvegardée avec succès');
        this.$router.push(this.$context.buildCampusLink('patterns-id-edit', {
          params: { id: data.id },
        }));
      } catch ({ response: { status } }) {
        if (status === 400) {
          this.$toast.error('Erreur de création ou de mise à jour, merci de vérifier tous les champs');
        } else {
          this.$toast.error('Erreur serveur, si le problème persiste, veuillez contacter le service technique');
        }
      }
      this.toggleLoading(false);
    },
  },
};
</script>
