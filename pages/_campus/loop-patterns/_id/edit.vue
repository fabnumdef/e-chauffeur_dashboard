<template>
  <main>
    <header>
      <h1 class="title">
        Modèle de boucle <em v-if="id">{{ id }}</em>
      </h1>
      <h2 class="subtitle">
        {{ id ? 'Modification' : 'Création' }}
      </h2>
    </header>
    <form
      class="box"
      @submit.prevent="edit(loopPattern)"
    >
      <ec-field
        label="Label"
        field-id="label"
        required
      >
        <input
          id="label"
          v-model.trim="loopPattern.label"
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
          v-model="loopPattern.category"
        />
      </ec-field>

      <ec-field
        label="Temps moyen entre chaque arrêt (en minutes)"
        field-id="reachDuration"
        required
      >
        <input
          id="reachDuration"
          v-model="loopPattern.reachDuration"
          class="input"
          type="number"
        >
      </ec-field>

      <h3 class="label">
        Liste des arrêts
      </h3>
      <p v-if="!loopPattern.stops || loopPattern.stops.length === 0">
        Pas d'arrêts paramétrés
      </p>
      <div
        v-else
        class="stop-table"
      >
        <div class="header">
          <div
            v-for="({ label }, index) in columnKeys"
            :key="index"
          >
            {{ label }}
          </div>
          <div>Actions</div>
        </div>
        <div class="body">
          <vue-draggable
            v-model="formattedStops"
          >
            <div
              v-for="(stop, index) in formattedStops"
              :key="index"
              :class="index % 2 === 0 ? 'row' : 'row-darker'"
            >
              <div
                v-for="({ key }, i) in columnKeys"
                :key="i"
              >
                {{ stop[key] }}
              </div>
              <div v-if="$auth.isSuperAdmin() || $auth.isRegulator(campus.id)">
                <button
                  class="button is-dark"
                  type="button"
                  @click="stopDown(stop)"
                >
                  <span class="icon is-small">
                    <fa-icon :icon="['fas', 'arrow-down']" />
                  </span>
                </button>
                <button
                  class="button is-dark"
                  type="button"
                  @click="stopUp(stop)"
                >
                  <span class="icon is-small">
                    <fa-icon :icon="['fas', 'arrow-up']" />
                  </span>
                </button>
                <button
                  class="button is-danger"
                  type="button"
                  @click="deleteStop(index)"
                >
                  <span class="icon is-small">
                    <fa-icon :icon="['fas', 'trash']" />
                  </span>
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          </vue-draggable>
        </div>
      </div>

      <ec-field
        label="Ajouter un nouvel arrêt"
        field-id="stop"
      >
        <search-poi
          v-model="selectedPoi"
          placeholder="Sélectionner un lieu"
          :current-campus="campus"
        />
      </ec-field>

      <button
        class="button is-info"
        type="button"
        :disabled="!selectedPoi"
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
          v-model.trim="loopPattern.comments"
          class="textarea"
        />
      </ec-field>

      <button
        v-if="id"
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
import searchCategory from '~/components/form/search-campus-category.vue';
import searchPoi from '~/components/form/search-poi.vue';
import toggleLoading from '~/helpers/mixins/toggle-loading';

const EDITABLE_FIELDS = ['label', 'category', 'stops', 'comments'];

export default {
  components: {
    ecField,
    searchCategory,
    searchPoi,
  },
  mixins: [toggleLoading],
  props: {
    loopPattern: {
      type: Object,
      default: () => ({
        stops: [],
      }),
    },
  },
  data() {
    return {
      id: this.loopPattern.id,
      selectedPoi: null,
    };
  },
  computed: {
    ...mapGetters({
      campus: 'context/campus',
    }),
    columnKeys() {
      return [{ key: 'id', label: 'ID' }, { key: 'label', label: 'Label' }];
    },
    loopPatternsAPI() {
      const mask = ['id', ...EDITABLE_FIELDS].join(',');
      return this.$api.loopPatterns(this.campus, mask);
    },
    formattedStops: {
      get() {
        return this.loopPattern.stops.map((stop) => ({ ...stop.poi }));
      },
      set(formattedStops) {
        this.loopPattern.stops = formattedStops.map((stop) => this.loopPattern.stops.find((s) => s.poi.id === stop.id));
      },
    },
  },
  methods: {
    async edit(loopPattern) {
      let data = {};
      try {
        this.toggleLoading(true);
        if (this.id) {
          ({ data } = (await this.loopPatternsAPI.patchLoopPattern(loopPattern.id, loopPattern)));
        } else {
          ({ data } = (await this.loopPatternsAPI.postLoopPattern(loopPattern)));
        }
        this.$toast.success('Donnée sauvegardée avec succès');
        this.$router.push(this.$context.buildCampusLink('loop-patterns-id-edit', {
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
    addStop() {
      const alreadyExists = this.loopPattern.stops.findIndex(({ poi }) => poi.label === this.selectedPoi.label);
      if (
        alreadyExists === -1
        || (
          alreadyExists !== -1
        && window
        && window.confirm
        && window.confirm('Attention, cet arrêt est déjà listé, êtes-vous sûr de vouloir l\'ajouter ?'))
      ) {
        this.loopPattern.stops.push({ poi: this.selectedPoi });
        this.selectedPoi = null;
      }
    },
    stopUp({ id }) {
      const { stops } = this.loopPattern;
      const stopIndex = stops.findIndex(({ poi }) => poi.id === id);
      if (stopIndex > 0) {
        const a = stops[stopIndex];
        stops[stopIndex] = stops[stopIndex - 1];
        stops[stopIndex - 1] = a;
        this.loopPattern.stops = [...stops];
      }
    },
    stopDown({ id }) {
      const { stops } = this.loopPattern;
      const stopIndex = stops.findIndex(({ poi }) => poi.id === id);
      if (stopIndex < stops.length - 1) {
        const a = stops[stopIndex];
        stops[stopIndex] = stops[stopIndex + 1];
        stops[stopIndex + 1] = a;
        this.loopPattern.stops = [...stops];
      }
    },
    deleteStop(i) {
      this.loopPattern.stops = this.loopPattern.stops.filter((_, index) => index !== i);
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '~assets/css/head';

  h3 {
    font-weight: bold;
  }
  .actions {
    text-align: center;
    width: 200px;
  }
  .stop-table {
    .header {
      display: flex;
      div {
        width: 100%;
        padding: .8em;
        border: 1px solid $gray;
        font-weight: 700;
      }
    }
    .body {
      .row-darker {
        background-color: $light-gray;
      }
      .row, .row-darker {
        display: flex;
        &:hover {
          background-color: $gray;
        }
        div {
          padding: .6em 1em;
          width: 100%;
          border: 1px solid $gray;
        }
      }
    }
  }
</style>
