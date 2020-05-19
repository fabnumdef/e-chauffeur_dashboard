<template>
  <vue-modal
    :active="active"
    :with-background="false"
    minimizable
    @toggle-modal="toggleModal"
  >
    <template slot="title">
      <template v-if="shuttle.id">
        Modifier navette <strong style="color: inherit">{{ shuttle.label }}</strong>
      </template>
      <template v-else>
        Nouvelle navette
      </template>
    </template>

    <div class="columns">
      <ec-field
        label="Label"
        required
        class="column"
      >
        <input
          v-model="shuttle.label"
          class="input"
          type="text"
          placeholder="Renseigner un titre pour cette navette"
        >
      </ec-field>

      <ec-field
        class="column"
        label="Jour et heure de départ"
        field-id="start"
      >
        <date-time
          v-model="start"
          lang="fr"
          input-class="input"
          type="datetime"
          :minute-step="5"
          format="YYYY-MM-DD HH:mm"
        >
          <template slot="calendar-icon">
            <fa-icon icon="calendar" />
          </template>
        </date-time>
      </ec-field>
    </div>


    <div class="columns">
      <ec-field
        class="column"
        field-id="driver"
        label="Chauffeur"
      >
        <search-available-driver
          v-model="shuttle.driver"
          :start="shuttle.start"
          :end="shuttle.end"
          :campus-id="campus.id"
          only-shuttle
        />
      </ec-field>

      <ec-field
        class="column"
        field-id="car"
        label="Véhicule"
      >
        <search-available-car
          v-model="shuttle.car"
          :start="shuttle.start"
          :end="shuttle.end"
          :campus-id="campus.id"
          :driver="shuttle.driver"
        />
      </ec-field>
    </div>

    <label for="shuttleFactory">Trajet</label>
    <div class="select-shuttle-factory">
      <select-shuttle-factory
        id="shuttleFactory"
        :value="shuttle.shuttleFactory"
        :disabled="shuttle.shuttleFactory.stops.length > 0"
        @input="selectShuttleFactory"
      />
    </div>

    <div class="columns">
      <stops-manager
        v-if="shuttle.shuttleFactory.stops && shuttle.shuttleFactory.stops.length > 0"
        :parent-stops="shuttle.shuttleFactory.stops"
        :parent-passengers="shuttle.passengers"
        :capacity="capacity"
        :shuttle-factory-id="shuttle.shuttleFactory.id"
        @update-passengers="updatePassengers"
      />
    </div>

    <div class="columns" />

    <template slot="submit">
      <ec-button
        is-success
        type="button"
        @click="edit(shuttle)"
      >
        Sauvegarder
      </ec-button>
      <ec-button
        type="button"
        is-danger
        @click="remove(shuttle)"
      >
        Supprimer
      </ec-button>
    </template>
  </vue-modal>
</template>

<script>
import cloneDeep from 'lodash.clonedeep';
import vueModal from '~/components/modals/default.vue';
import selectShuttleFactory from '~/components/form/selects/shuttle-factories.vue';
import searchAvailableDriver from '~/components/form/search-available-driver.vue';
import searchAvailableCar from '~/components/form/search-available-car.vue';
import stopsManager from '~/components/modals/planificator/shuttle/stops-manager.vue';

import stopsHandler from '~/components/modals/planificator/shuttle/mixins/stops-handler';
import passengersHandler from '~/components/modals/planificator/shuttle/mixins/passengers-handler';
import toggleModal from '~/components/modals/planificator/shuttle/mixins/toggle-modal';
import toggleLoading from '~/helpers/mixins/toggle-loading';
import errorsManagement from '~/helpers/mixins/errors-management';

const mask = 'id,label,status,start,end,campus,shuttleFactory,stops,comments,driver,car';

export default {
  components: {
    vueModal,
    searchAvailableDriver,
    searchAvailableCar,
    selectShuttleFactory,
    stopsManager,
  },
  mixins: [
    stopsHandler(),
    toggleModal(),
    toggleLoading(),
    errorsManagement(),
    passengersHandler(),
  ],
  props: {
    active: {
      type: Boolean,
      required: true,
    },
    currentShuttle: {
      type: Object,
      default: () => ({
        shuttleFactory: {
          stops: [],
        },
        passengers: [],
      }),
    },
    campus: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      shuttle: cloneDeep(this.currentShuttle),
    };
  },
  computed: {
    ApiShuttle() {
      return this.$api.query('shuttles').setMask(mask);
    },
  },
  watch: {
    currentShuttle() {
      this.shuttle = cloneDeep(this.currentShuttle);
    },
  },
  methods: {
    async edit(data) {
      const formattedData = {
        ...data,
        campus: this.campus,
      };
      this.toggleLoading(true);
      let ApiCallback = async () => this.ApiShuttle.create(formattedData);
      if (formattedData.id) {
        ApiCallback = async () => this.ApiShuttle.edit(formattedData.id, formattedData);
      }

      await this.handleCommonErrorsBehavior(ApiCallback);
      this.toggleLoading(false);
    },
    // Facilitates tests before state machine implementation
    async remove(data) {
      await this.handleCommonErrorsBehavior(() => this.ApiShuttle.delete(data.id));
    },
  },
};
</script>

<style lang="scss" scoped>
  label {
    font-weight: 700;
  }
  .control {
    .mx-datepicker {
      width: 100%;
    }
  }
  .select-shuttle-factory {
    display: flex;
    align-items: center;
    margin: .5em 0 2em;
    button {
      margin-left: 2em;
    }
  }
</style>
