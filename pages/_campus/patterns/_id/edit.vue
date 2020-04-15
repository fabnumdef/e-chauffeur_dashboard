<template>
  <main>
    <header>
      <h1 class="title">
        Modèle de boucle <em v-if="pattern.id">{{ pattern.id }}</em>
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
        required
      >
        <input
          id="reachDuration"
          v-model="pattern.reachDuration"
          class="input"
          type="number"
        >
      </ec-field>

      <h3 class="label">
        Liste des arrêts
      </h3>
      <p v-if="!pattern.stops || pattern.stops.length === 0">
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
            v-model="pattern.stops"
          >
            <div
              v-for="(stop, index) in pattern.stops"
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
import searchCategory from '~/components/form/search-campus-category.vue';
import searchPoi from '~/components/form/search-poi.vue';
import toggleLoading from '~/helpers/mixins/toggle-loading';

const EDITABLE_FIELDS = ['label', 'category', 'stops', 'comments', 'reachDuration'];

export default {
  components: {
    ecField,
    searchCategory,
    searchPoi,
  },
  mixins: [toggleLoading],
  props: {
    pattern: {
      type: Object,
      default: () => ({
        stops: [],
      }),
    },
  },
  data() {
    return {
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
    addStop() {
      const alreadyExists = this.pattern.stops.findIndex(({ label }) => label === this.selectedPoi.label);
      if (
        alreadyExists === -1
        || (
          alreadyExists !== -1
        && window
        && window.confirm
        && window.confirm('Attention, cet arrêt est déjà listé, êtes-vous sûr de vouloir l\'ajouter ?'))
      ) {
        this.pattern.stops.push(this.selectedPoi);
        this.selectedPoi = null;
      }
    },
    stopUp({ id }) {
      const { stops } = this.pattern;
      const stopIndex = stops.findIndex((stop) => stop.id === id);
      if (stopIndex > 0) {
        const a = stops[stopIndex];
        stops[stopIndex] = stops[stopIndex - 1];
        stops[stopIndex - 1] = a;
        this.pattern.stops = [...stops];
      }
    },
    stopDown({ id }) {
      const { stops } = this.pattern;
      const stopIndex = stops.findIndex((stop) => stop.id === id);
      if (stopIndex < stops.length - 1) {
        const a = stops[stopIndex];
        stops[stopIndex] = stops[stopIndex + 1];
        stops[stopIndex + 1] = a;
        this.pattern.stops = [...stops];
      }
    },
    deleteStop(i) {
      this.pattern.stops = this.pattern.stops.filter((_, index) => index !== i);
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
