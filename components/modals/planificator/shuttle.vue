<template>
  <vue-modal
    :active="active"
    :with-background="false"
    minimizable
    @toggle-modal="toggleModal"
  >
    <template slot="title">
      <template v-if="shuttle.label">
        Modifier navette <strong style="color: inherit">{{ shuttle.label }}</strong>
      </template>
      <template v-else>
        Nouvelle navette
      </template>
    </template>


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
        />
      </ec-field>

      <ec-field
        class="column"
        field-id="car"
        label="Vehicule"
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

    <div class="columns">
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
          :value="shuttle.start"
          :minute-step="5"
          :first-day-of-week="1"
          format="Le DD/MM/YYYY à HH:mm"
        >
          <template slot="calendar-icon">
            <fa-icon icon="calendar" />
          </template>
        </date-time>
      </ec-field>

      <ec-field
        label="Téléphone"
        class="column"
        field-id="phone"
      >
        <phone-number-input
          id="phone"
          v-model="shuttle.phone"
          default-country-code="FR"
          :preferred-countries="['FR', 'BE', 'DE']"
          :translations="{
            countrySelectorLabel: 'Prefix',
            countrySelectorError: 'Choisir un pays',
            phoneNumberLabel: '',
            example: 'Exemple :'
          }"
          color="transparent"
          valid-color="transparent"
          class="input input-phone"
        />
      </ec-field>
    </div>

    <div class="columns">
      <ec-field
        class="column"
        field-id="departure"
        label="Depart"
      >
        <vue-multiselect
          v-model="departure"
          placeholder="Selectionner un arret"
          :options="stops"
          track-by="id"
          label="label"
        />
      </ec-field>

      <ec-field
        class="column"
        field-id="departure"
        label="Arrivee"
      >
        <vue-multiselect
          v-model="arrival"
          placeholder="Selectionner un arret"
          :options="stops"
          track-by="id"
          label="label"
        />
      </ec-field>
    </div>

    <div class="columns">
      <stops-manager
        :parent-stops="shuttle.stops"
        :capacity="capacity"
      />
    </div>

    <template slot="submit">
      <button
        class="button is-success"
        :class="loading ? 'is-loading' : ''"
        type="button"
        @click="edit(shuttle)"
      >
        Sauvegarder
      </button>
    </template>
  </vue-modal>
</template>

<script>
import phoneNumberInput from 'vue-phone-number-input';
import cloneDeep from 'lodash.clonedeep';

import vueModal from '~/components/modals/default.vue';
import ecField from '~/components/form/field.vue';
import searchAvailableDriver from '~/components/form/search-available-driver.vue';
import searchAvailableCar from '~/components/form/search-available-car.vue';
import stopsManager from '~/components/modals/planificator/shuttle/stops-manager.vue';
import stopsHandlerMixin from '~/components/modals/planificator/shuttle/mixins/stops-handler';
import toggleModalMixin from '~/components/modals/planificator/shuttle/mixins/toggle-modal';

export default {
  components: {
    vueModal,
    ecField,
    searchAvailableDriver,
    searchAvailableCar,
    phoneNumberInput,
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
        stops: [],
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
    };
  },
  computed: {
    capacity() {
      if (this.shuttle.car && this.shuttle.car.model && this.shuttle.car.model.capacity) {
        return this.shuttle.car.model.capacity;
      }
      return 0;
    },
  },
  watch: {
    currentShuttle() {
      this.shuttle = cloneDeep(this.currentShuttle);
    },
  },
  methods: {
    async edit(data) {
      this.loading = true;
      try {
        // @todo websockets to trigger to pushShuttle in events
        // @todo fix mask
        await this.$api.shuttles(null, '*').patchShuttle(data.id, data);
      } catch (e) {
        this.$toast.error('Probleme a la sauvegarde, veuillez verifier vos donnes');
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
