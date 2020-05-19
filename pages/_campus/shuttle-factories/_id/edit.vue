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

    <div>
      <h3 class="label">
        Liste des arrêts
      </h3>
      <p v-if="!shuttleFactory.stops || shuttleFactory.stops.length === 0">
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
          <div>Temps entre arrêts</div>
          <div>Actions</div>
        </div>
        <div class="body">
          <vue-draggable
            v-model="shuttleFactory.stops"
          >
            <div
              v-for="(stop, index) in shuttleFactory.stops"
              :key="index"
              :class="index % 2 === 0 ? 'row' : 'row-darker'"
            >
              <div
                v-for="({ key }, i) in columnKeys"
                :key="i"
              >
                {{ stop[key] }}
              </div>
              <div>
                <input
                  v-if="index > 0"
                  v-model="stop.reachDuration"
                  type="number"
                  placeholder="Temps en minutes"
                >
                <p v-else>
                  Arrêt de départ
                </p>
              </div>
              <div v-if="$auth.isRegulator($route.params.campus)">
                <ec-button
                  is-dark
                  type="button"
                  icon-left="arrow-down"
                  @click="stopDown(stop)"
                />
                <ec-button
                  is-dark
                  type="button"
                  icon-left="arrow-up"
                  @click="stopUp(stop)"
                />
                <ec-button
                  is-danger
                  type="button"
                  icon-left="trash"
                  @click="deleteStop(index)"
                >
                  Supprimer
                </ec-button>
              </div>
            </div>
          </vue-draggable>
        </div>
      </div>
    </div>

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
      :is-new="!shuttleFactory.id"
      has-alt
    />
  </form>
</template>

<script>
import { mapGetters } from 'vuex';
import searchCategory from '~/components/form/search-campus-category.vue';
import searchPoi from '~/components/form/search-poi.vue';
import saveButton, { saveButtonHandler } from '~/components/crud/save-button.vue';
import toggleLoading from '~/helpers/mixins/toggle-loading';
import errorsManagementMixin from '~/helpers/mixins/errors-management';
import resetableMixin from '~/helpers/mixins/reset-data';
import titleMixin from '~/helpers/mixins/page-title';
import handleStopsTable from '~/components/crud/mixins/handle-stop-selection';

const EDITABLE_FIELDS = ['id', 'label', 'category', 'stops', 'comments'];

export default {
  components: {
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
    handleStopsTable(),
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
    return { selectedStop: null };
  },
  computed: {
    ...mapGetters({
      campus: 'context/campus',
    }),
  },
  methods: {
    async edit(shuttleFactory, event) {
      return this.raceToggleLoading(() => this.handleCommonErrorsBehavior(async () => {
        const ApiShuttleFactories = this.$api.query('shuttleFactories')
          .setCampus(this.campus.id)
          .setMask(EDITABLE_FIELDS);
        const formattedShuttleFactory = { ...shuttleFactory, campus: this.campus };
        let data = {};
        if (this.shuttleFactory.id) {
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
