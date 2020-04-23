<template>
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
    shuttleFactory: {
      type: Object,
      default: () => ({}),
    },
    selectedStop: {
      type: Object,
      default: null,
    },
  },
  computed: {
    columnKeys() {
      return [{ key: 'id', label: 'ID' }, { key: 'label', label: 'Label' }];
    },
  },
  methods: {
    stopUp({ id }) {
      const { stops } = this.shuttleFactory;
      const stopIndex = stops.findIndex((stop) => stop.id === id);
      if (stopIndex > 0) {
        const a = stops[stopIndex];
        stops[stopIndex] = stops[stopIndex - 1];
        stops[stopIndex - 1] = a;
        this.shuttleFactory.stops = [...stops];
      }
    },
    stopDown({ id }) {
      const { stops } = this.shuttleFactory;
      const stopIndex = stops.findIndex((stop) => stop.id === id);
      if (stopIndex < stops.length - 1) {
        const a = stops[stopIndex];
        stops[stopIndex] = stops[stopIndex + 1];
        stops[stopIndex + 1] = a;
        this.shuttleFactory.stops = [...stops];
      }
    },
    deleteStop(i) {
      this.shuttleFactory.stops = this.shuttleFactory.stops.filter((_, index) => index !== i);
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
