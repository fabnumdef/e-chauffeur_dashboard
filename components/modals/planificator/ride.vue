<template>
  <vue-modal
    :active="modalOpen"
    :with-background="false"
    minimizable
    @toggle-modal="toggleModal"
    @submit="edit(ride)"
  >
    <template slot="title">
      <template v-if="ride.id">
        Modifier course #{{ ride.id }}
      </template>
      <template v-else>
        Nouvelle course
      </template>
    </template>

    <div class="columns">
      <div class="column">
        <ec-field
          label="Type de course"
          field-id="departure"
        >
          <search-category v-model="ride.category" />
        </ec-field>
      </div>
      <div class="column">
        <ec-field
          label="Informations"
        >
          <div class="tags has-addons">
            <span class="tag is-dark">Créée par</span>
            <span
              v-if="ride.owner"
              class="tag is-warning"
            >Utilisateur</span>
            <span
              v-else
              class="tag is-info"
            >Régulation</span>
          </div>
        </ec-field>
      </div>
    </div>
    <ec-field
      label="Dates"
      field-id="dates"
    >
      <date-time
        lang="fr"
        input-class="input"
        type="datetime"
        range
        :value="range"
        :minute-step="5"
        format="YYYY-MM-DD HH:mm"
        range-separator="->"
        @input="updateDates"
      >
        <template slot="icon-calendar">
          <fa-icon icon="calendar" />
        </template>
      </date-time>
    </ec-field>

    <div class="columns">
      <ec-field
        class="column"
        label="Départ"
        field-id="departure"
      >
        <search-poi
          v-model="ride.departure"
          v-autofocus="{
            hasBeenFocused: hasBeenFocused,
            focus: focusState.rideDeparture,
            input: ride.departure,
            inputName: 'rideDeparture',
            cb: focusNext
          }"
          :current-campus="campus"
        />
      </ec-field>

      <ec-field
        class="column"
        label="Arrivée"
        field-id="arrival"
      >
        <search-poi
          v-model="ride.arrival"
          v-autofocus="{
            hasBeenFocused: hasBeenFocused,
            focus: focusState.rideArrival,
            input: ride.arrival,
            inputName: 'rideArrival',
            cb: focusNext
          }"
          :current-campus="campus"
        />
      </ec-field>
    </div>

    <div class="columns">
      <ec-field
        label="Nombre de passagers"
        class="column"
        field-id="passengers-count"
      >
        <div class="select">
          <select
            id="passengers-count"
            v-model="ride.passengersCount"
          >
            <option
              v-for="i in 8"
              :key="i"
              :value="i"
            >
              {{ i }}
            </option>
          </select>
        </div>
      </ec-field>

      <ec-field
        label="Téléphone"
        class="column"
        field-id="phone"
      >
        <vue-tel-input
          id="phone"
          v-model="ride.phone"
          v-autofocus="{
            hasBeenFocused: hasBeenFocused,
            focus: focusState.phone,
            input: ride.phone,
            inputName: 'phone',
            cb: focusNext
          }"
          name="phone"
          default-country="FR"
          :disabled-fetching-country="false"
          class="input input-phone"
        />
      </ec-field>
    </div>

    <div class="columns">
      <ec-field
        label="Présence de bagages"
        class="column"
        field-id="passengers-luggage"
      >
        <button
          class="button button-luggage"
          :class="ride.luggage && 'is-primary'"
          type="button"
          @click="toggleLuggage(true)"
        >
          Oui
        </button>
        <button
          class="button button-luggage"
          :class="ride.luggage || 'is-primary'"
          type="button"
          @click="toggleLuggage(false)"
        >
          Non
        </button>
      </ec-field>
    </div>

    <div class="columns">
      <ec-field
        class="column"
        label="Chauffeur"
        field-id="driver"
      >
        <search-available-driver
          v-model="ride.driver"
          :start="ride.start"
          :end="ride.end"
          :campus-id="campus.id"
        />
      </ec-field>
      <ec-field
        class="column only-one-scroll"
        label="Véhicule"
        field-id="car"
      >
        <search-available-car
          v-model="ride.car"
          :start="ride.start"
          :end="ride.end"
          :campus-id="campus.id"
          :driver="ride.driver"
        />
      </ec-field>
    </div>
    <ec-field
      v-if="ride.userComments"
      label="Commentaires client"
      field-id="userComments"
    >
      <p>
        {{ ride.userComments }}
      </p>
      <button
        class="button is-small is-primary"
        type="button"
        @click="copyToComments(ride.userComments)"
      >
        Copier vers les commentaires
      </button>
    </ec-field>
    <ec-field
      field-id="comments"
    >
      <template #label>
        <div class="columns">
          <div class="column">
            Commentaires
          </div>
          <div class="column is-narrow">
            <div class="tags has-addons">
              <span class="tag is-dark"><fa-icon icon="exclamation-triangle" /></span>
              <span class="tag is-danger">Ne pas communiquer d'informations sensibles</span>
            </div>
          </div>
        </div>
      </template>
      <textarea
        id="comments"
        v-model="ride.comments"
        class="textarea"
      />
    </ec-field>

    <template slot="submit">
      <button
        v-if="can(ride, VALIDATE)"
        class="button is-success"
        type="button"
        @click="edit(ride, VALIDATE)"
      >
        Accepter la course
      </button>
      <button
        v-else
        class="button is-success"
        type="button"
        @click="edit(ride)"
      >
        Sauvegarder
      </button>

      <bulma-dropdown
        v-if="can(ride, REJECT_BOUNDARY) || can(ride, REJECT_CAPACITY)"
        class="is-danger"
        :options="{[REJECT_BOUNDARY]: 'Refuser (périmètre)', [REJECT_CAPACITY]: 'Refuser (capacité)'}"
        @click="edit(ride, $event)"
      >
        Refuser la course
      </bulma-dropdown>
      <bulma-dropdown
        v-if="can(ride, CANCEL_TECHNICAL) || can(ride, CANCEL_REQUESTED_CUSTOMER)
          || can(ride, CANCEL_CUSTOMER_OVERLOAD) || can(ride, CANCEL_CUSTOMER_MISSING)"
        class="is-danger"
        :options="{
          [CANCEL_TECHNICAL]: 'Annuler (problème technique)',
          [CANCEL_REQUESTED_CUSTOMER]: 'Annuler (demande utilisateur)',
          [CANCEL_CUSTOMER_OVERLOAD]: 'Annuler (surcharge)',
          [CANCEL_CUSTOMER_MISSING]: 'Annuler (passager absent)',
        }"
        @click="changeStatus(ride, $event)"
      >
        Annuler la course
      </bulma-dropdown>
    </template>
  </vue-modal>
</template>

<script>
import { DateTime } from 'luxon';
import { VueTelInput } from 'vue-tel-input';
import Status from '@fabnumdef/e-chauffeur_lib-vue/api/status';
import {
  VALIDATED, CREATED,
  REJECTED_BOUNDARY, REJECTED_CAPACITY,
} from '@fabnumdef/e-chauffeur_lib-vue/api/status/states';
import {
  VALIDATE,
  REJECT_BOUNDARY, REJECT_CAPACITY,
  CANCEL_TECHNICAL,
  CANCEL_REQUESTED_CUSTOMER,
  CANCEL_CUSTOMER_OVERLOAD,
  CANCEL_CUSTOMER_MISSING,
} from '@fabnumdef/e-chauffeur_lib-vue/api/status/transitions';
import searchPoi from '~/components/form/search-poi.vue';
import searchCategory from '~/components/form/search-campus-category.vue';
import searchAvailableCar from '~/components/form/search-available-car.vue';
import searchAvailableDriver from '~/components/form/search-available-driver.vue';
import bulmaDropdown from '~/components/dropdown.vue';
import vueModal from '~/components/modals/default.vue';

const EDITABLE_FIELDS = [
  'id',
  'start',
  'end',
  'departure(id,label)',
  'arrival(id,label)',
  'car(id,label,model(id,label))',
  'driver(id,name,firstname,lastname)',
  'phone',
  'status',
  'comments',
  'passengersCount',
  'category(id,label)',
  'luggage',
].join(',');

const actions = {
  VALIDATE,
  VALIDATED,
  REJECT_BOUNDARY,
  REJECTED_BOUNDARY,
  REJECT_CAPACITY,
  REJECTED_CAPACITY,
  CANCEL_TECHNICAL,
  CANCEL_REQUESTED_CUSTOMER,
  CANCEL_CUSTOMER_OVERLOAD,
  CANCEL_CUSTOMER_MISSING,
};

export default {
  components: {
    searchPoi,
    searchAvailableCar,
    searchAvailableDriver,
    searchCategory,
    bulmaDropdown,
    vueModal,
    VueTelInput,
  },

  directives: {
    autofocus: {
      update(el, binding) {
        if (binding.value.focus === 'watch' && binding.value.input === binding.oldValue.input) {
          if (el.tagName.toLowerCase() === 'div') {
            const inputs = el.getElementsByTagName('input');
            if (inputs.length) {
              inputs[inputs.length - 1].focus();
            }
          } else {
            el.focus();
          }
          binding.value.hasBeenFocused(binding.value.inputName);
        } else if (binding.value.focus === 'focused' && binding.value.cb
          && binding.value.input !== binding.oldValue.input) {
          binding.value.cb(binding.value.inputName);
        }
      },
    },
  },

  props: {
    currentRide: {
      type: Object,
      default: () => ({
        start: null,
        end: null,
        phone: null,
        departure: null,
        arrival: null,
        driver: null,
        status: CREATED,
        category: null,
        passengersCount: 1,
        luggage: false,
        comments: '',
      }),
    },
    campus: {
      type: Object,
      default: () => ({}),
    },
    modalOpen: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      ride: { ...this.currentRide },
      focusState: {
        rideDeparture: 'unwatch',
        rideArrival: 'unwatch',
        phone: 'unwatch',
      },
      focusSequence: [
        'rideDeparture',
        'rideArrival',
        'phone',
      ],
      isAutoFocus: false,
    };
  },

  computed: {
    range() {
      return [
        this.ride.start || null,
        this.ride.end || null,
      ].map((l) => (l && l.toJSDate ? l.toJSDate() : null));
    },
    ...Object.keys(actions)
      .map((a) => ({ [a]: () => actions[a] }))
      .reduce((acc, curr) => Object.assign(acc, curr), {}),
  },

  watch: {
    currentRide() {
      this.ride = { ...this.currentRide };
    },
    modalOpen() {
      if (this.modalOpen && this.ride && !this.ride.departure) {
        this.autoFocus('rideDeparture');
      } else {
        this.isAutoFocus = false;
      }
    },
  },

  methods: {
    toggleModal(newStatus = false) {
      if (!newStatus) {
        this.$emit('toggle-modal', newStatus);
      }
    },

    toggleLuggage(value) {
      this.ride.luggage = value;
    },

    focusNext(input) {
      if (this.focusState[input]) {
        this.focusState[input] = 'unwatch';
      }
      if (this.isAutoFocus) {
        this.isAutoFocus = false;
        const idx = this.focusSequence.indexOf(input);
        if (idx !== -1 && idx + 1 !== this.focusSequence.length) {
          this.autoFocus(this.focusSequence[idx + 1]);
        }
      }
    },
    autoFocus(input) {
      if (input && typeof this.focusState[input] !== 'undefined') {
        this.isAutoFocus = true;
        this.focusState[input] = 'watch';
      }
    },
    hasBeenFocused(input) {
      this.focusState[input] = 'focused';
    },

    updateDates([start, end], {
      id, name, firstname, lastname,
    } = {}) {
      this.ride.driver = {
        id, name, firstname, lastname,
      };
      this.ride.start = start instanceof DateTime ? start : DateTime.fromJSDate(start);
      this.ride.end = end instanceof DateTime ? end : DateTime.fromJSDate(end);
    },

    async edit(ride, action) {
      const api = this.$api
        .query('rides')
        .setMask(EDITABLE_FIELDS)
        .setCampus(this.campus.id);
      try {
        if (ride.id) {
          await api.edit(ride.id, { ...ride, campus: this.campus });
          if (action) {
            await api.mutate(ride.id, action);
          }
          this.$toasted.success('La course a bien été mise à jour.');
        } else {
          const { data: newRide } = await api.create({
            ...ride,
            campus: { id: this.$route.params.campus },
          });

          if (action) {
            await api.mutate(newRide.id, action);
          }
          this.$toasted.success('La course a bien été créée.');
        }
        this.toggleModal(false);
      } catch (e) {
        this.$toasted.error(`La course n'a pas été créée ou mise à jour (${e}), merci de vérifiez les champs.`);
      }
    },

    async changeStatus(ride, action) {
      if (!ride.id) {
        this.$toasted.error('Changement de status possible uniquement pour une course sauvegardée');
      }
      try {
        await this.$api.query('rides')
          .setMask(EDITABLE_FIELDS)
          .setCampus(this.campus.id)
          .mutate(ride.id, action);
        this.$toasted.success('Status modifié.');
        this.toggleModal(false);
      } catch (e) {
        this.$toasted.error(`La course n'a pas été créée ou mise à jour (${e}), merci de vérifiez les champs.`);
      }
    },

    can: ({ status }, action) => {
      const state = Status(status);
      return state.can(action);
    },
    copyToComments(content) {
      this.ride.comments = `\
${content}
---
${this.ride.comments || ''}`;
    },
  },
};
</script>

<style lang="scss" scoped>
  button.button-luggage {
      border-radius: 1em;
      width: 5em;
      margin: 1em 0 0;
  }

  .only-one-scroll {
    /deep/ .multiselect__content-wrapper {
      position: initial;
    }
    /deep/ .multiselect__content {
      position: absolute;
    }
  }
  .input-phone /deep/ {
    .select-country-container {
      min-width: 80px;
      width: 80px;
      max-width: 80px;
      flex: 0 0 80px;
    }
    .country-selector {
      .field-input {
        border: none !important;
      }
      .field-country-flag {
        left: 0;
      }
      &.has-value .field-input {
        padding-left: 25px;
      }
      .field-label {
        display: none;
      }
    }

    .field.vue-input-ui .field-input {
      border: none !important;
    }
  }
</style>
