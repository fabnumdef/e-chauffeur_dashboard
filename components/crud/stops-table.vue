<template>
  <div>
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
  </div>
</template>

<script>
export default {
  props: {
    pattern: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      selectedStop: null,
    };
  },
  computed: {
    columnKeys() {
      return [{ key: 'id', label: 'ID' }, { key: 'label', label: 'Label' }];
    },
  },
  methods: {
    addStop() {
      const alreadyExists = this.pattern.stops.findIndex(({ label }) => label === this.selectedStop.label);
      if (
        alreadyExists === -1
        || (
          alreadyExists !== -1
        && window
        && window.confirm
        && window.confirm('Attention, cet arrêt est déjà listé, êtes-vous sûr de vouloir l\'ajouter ?'))
      ) {
        this.pattern.stops.push(this.selectedStop);
        this.selectedStop = null;
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
