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
        label="Date et heure de depart"
        field-id="start"
      >
        <date-time
          lang="fr"
          append-to-body
          input-class="input"
          type="datetime"
          :value="start"
          :minute-step="5"
          :first-day-of-week="1"
          format="Le DD/MM/YYYY à HH:mm"
          @input="updateStart"
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
      <search-shuttle-factory
        id="shuttleFactory"
        v-model="shuttle.shuttleFactory"
        :disabled="shuttle.shuttleFactory.stops.length > 0"
      />
    </div>

    <div class="columns">
      <stops-manager
        v-if="shuttle.shuttleFactory.stops.length > 0"
        :parent-stops="shuttle.shuttleFactory.stops"
        :parent-passengers="shuttle.passengers"
        :capacity="capacity"
        :shuttle-factory-id="shuttle.shuttleFactory.id"
        @update-passengers="updatePassengers"
      />
    </div>

    <div class="columns" />

    <template slot="submit">
      <button
        class="button is-success"
        type="button"
        @click="edit(shuttle)"
      >
        Sauvegarder
      </button>

      <button
        type="button"
        class="button is-danger"
        @click="remove(shuttle)"
      >
        Supprimer
      </button>
    </template>
  </vue-modal>
</template>

<script>
import cloneDeep from 'lodash.clonedeep';

import { DateTime } from 'luxon';
import vueModal from '~/components/modals/default.vue';
import ecField from '~/components/form/field.vue';
import searchShuttleFactory from '~/components/form/search-shuttle-factory.vue';
import searchAvailableDriver from '~/components/form/search-available-driver.vue';
import searchAvailableCar from '~/components/form/search-available-car.vue';
import stopsManager from '~/components/modals/planificator/shuttle/stops-manager.vue';
import stopsHandlerMixin from '~/components/modals/planificator/shuttle/mixins/stops-handler';
import toggleModalMixin from '~/components/modals/planificator/shuttle/mixins/toggle-modal';

const mask = 'id,label,status,start,end,campus,shuttleFactory,stops,comments,driver,car';

export default {
  components: {
    vueModal,
    ecField,
    searchAvailableDriver,
    searchAvailableCar,
    searchShuttleFactory,
    stopsManager,
  },
  mixins: [
    stopsHandlerMixin(),
    toggleModalMixin(),
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
      loading: false,
      ApiShuttle: this.$api.query('shuttles').setMask(mask),
    };
  },
  computed: {
    capacity() {
      if (this.shuttle.car && this.shuttle.car.model && this.shuttle.car.model.capacity) {
        return this.shuttle.car.model.capacity;
      }
      return 0;
    },
    start: {
      get() {
        if (this.shuttle.start) {
          return this.shuttle.start.toJSDate();
        }
        return null;
      },
      set(start) {
        this.start = start instanceof DateTime ? start : DateTime.fromJSDate(start);
      },
    },
  },
  watch: {
    currentShuttle() {
      this.shuttle = cloneDeep(this.currentShuttle);
    },
  },
  methods: {
    updateStart(start) {
      this.start = start instanceof DateTime ? start : DateTime.fromJSDate(start);
    },
    updatePassengers(passengers) {
      this.shuttle.passengers = passengers;
    },
    async edit(data) {
      try {
        const formattedData = {
          ...data,
          campus: this.campus,
        };
        if (formattedData.id) {
          await this.ApiShuttle.edit(formattedData.id, formattedData);
        } else {
          await this.ApiShuttle.create(formattedData);
        }
        this.$toast.success(`La navette a été ${formattedData.id ? 'modifiée' : 'créée'} avec succès`);
      } catch (e) {
        this.$toast.error('Problème à la sauvegarde, veuillez vérifier vos données');
      }
    },
    // Facilitates tests before state machine implementation
    async remove(data) {
      try {
        await this.ApiShuttle.delete(data.id);
        this.$toast.success('La navette a été supprimée avec succès');
      } catch {
        this.$toast.error('Problème à la sauvegarde, veuillez vérifier vos données');
      }
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
