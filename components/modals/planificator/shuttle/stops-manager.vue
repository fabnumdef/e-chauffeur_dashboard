<template>
  <div id="stop-manager">
    <div>
      <template
        v-for="(interStop, index) in interStops"
      >
        <div
          :key="index"
          class="stop-dropdown"
          @click="displayDetails(index)"
        >
          <span>{{ interStop.departure.label }}<fa-icon icon="arrow-right" />{{ interStop.arrival.label }}</span>
          <span
            v-if="capacity"
            :class="passengersCountClass(interStop.passengers)"
          >{{ interStop.passengers.length }}/{{ capacity }}<fa-icon icon="user" /></span>
          <span v-else>Capacité du vehicule non définie</span>
          <fa-icon
            v-if="toDisplay[index]"
            icon="angle-up"
          />
          <fa-icon
            v-else
            icon="angle-down"
          />
        </div>
        <div
          v-if="toDisplay[index] && interStop.passengers.length > 0"
          :key="`stops-details--${index}`"
          class="stop-details"
        >
          <ul class="passengers-list">
            <li
              v-for="(passenger, i) in interStop.passengers"
              :key="`passengers-list--${i}`"
              :class="{ hovered: (hover.stopIndex === index && hover.passengerIndex === i) ? 'hovered' : '' }"
              @mouseenter="setHover(index, i)"
              @mouseleave="setHover(-1, -1)"
            >
              {{
                hover.stopIndex === index && hover.passengerIndex === i
                  ? passenger.phone || passenger.email
                  : passenger.email
              }}
              <fa-icon
                :icon="'times'"
                @click="deletePassenger(passenger)"
              />
            </li>
          </ul>
        </div>
      </template>
    </div>
    <form @submit.prevent="addPassenger">
      <p>Ajouter un passager</p>
      <div class="columns">
        <ec-field
          label="Email"
          field-id="email"
          class="column"
        >
          <input
            v-model="email"
            class="input"
            type="email"
            placeholder="Rentrer l'email du passager"
          >
        </ec-field>

        <ec-field
          label="Téléphone"
          class="column"
          field-id="phone"
        >
          <phone-number-input
            id="phone"
            v-model="phone"
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
          label="Depart"
          field-id="departure"
          class="column"
        >
          <search-stop
            v-model="departure"
            :shuttle-factory-id="shuttleFactoryId"
          />
        </ec-field>

        <ec-field
          label="Arrivee"
          field-id="arrival"
          class="column"
        >
          <search-stop
            v-model="arrival"
            :shuttle-factory-id="shuttleFactoryId"
          />
        </ec-field>
      </div>

      <button
        class="button is-dark"
        type="submit"
      >
        Ajouter
      </button>
    </form>
  </div>
</template>

<script>
import phoneNumberInput from 'vue-phone-number-input';
import ecField from '~/components/form/field.vue';
import searchStop from '~/components/form/search-stop.vue';
import displayMixin from '~/components/modals/planificator/shuttle/mixins/display-stops';
import passengersHandlerMixin from '~/components/modals/planificator/shuttle/mixins/passengers-handler';

export default {
  components: {
    ecField,
    searchStop,
    phoneNumberInput,
  },
  mixins: [
    displayMixin(),
    passengersHandlerMixin(),
  ],
  props: {
    parentStops: {
      type: Array,
      default: () => [],
    },
    parentPassengers: {
      type: Array,
      default: () => [],
    },
    capacity: {
      type: Number,
      default: 0,
    },
    shuttleFactoryId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      stops: [...this.parentStops],
      passengers: [...this.parentPassengers],
    };
  },
  watch: {
    parentStops() {
      this.stops = [...this.parentStops];
    },
    parentPassengers() {
      this.passengers = [...this.parentPassengers];
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '~assets/css/head';

  #stop-manager {
    width: 100%;
    margin: 0 1em;
    svg {
      font-size: .8em;
      margin: 0 .8em;
    }
    .stop-dropdown {
      position: relative;
      background-color: $blue-ultra-light;
      color: $white;
      padding: .6em 1.5em;
      margin-bottom: 1em;
      font-weight: 700;
      cursor: pointer;
      & > svg {
        position: absolute;
        right: 1em;
        top: 1.5em;
      }
      span {
        margin-right: 1em;
      }
    }

    .stop-details {
      border: 1px solid $blue-ultra-light;
      margin: -1em auto 1em;
      padding: .8em 1.5em;
      ul {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 1em;
        li {
          position: relative;
          border: 1px solid $gray;
          padding: .3em .3em .3em 1em;
          font-weight: 700;
          border-radius: 2em;
          min-width: 250px;
          margin: 0 .5em .5em 0;
          text-transform: capitalize;
          &.hovered {
            background-color: $light-gray;
          }
          svg {
            position: absolute;
            right: 1em;
            bottom: .8em;
            cursor: pointer;
            color: $red;
            margin-left: 1em;
          }
        }
      }
    }
    form {
      margin: 1em 0;
      width: 100%;
      p {
        font-weight: 700;
        text-transform: uppercase;
        color: $dark-gray;
      }
      button {
        margin: -1em 0;
        padding: 0 2em;
      }
    }
  }

  .warning {
    color: $orange;
  }
  .error {
    color: $red;
  }
</style>
