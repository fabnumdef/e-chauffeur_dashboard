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
          <span v-else>Capacité du véhicule non définie</span>
          <span>
            {{ getInterstopDate(interStop.departure.time) }}
            <fa-icon icon="arrow-right" />
            {{ getInterstopDate(interStop.arrival.time) }}
          </span>
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
            <!-- @todo relevant to test on touchable device -->
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
          <vue-tel-input
            id="phone"
            v-model="phone"
            name="phone"
            default-country="FR"
            :disabled-fetching-country="false"
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
            is-departure
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
            :departure-index="departureIndex"
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
import { VueTelInput } from 'vue-tel-input';
import { DateTime } from 'luxon';
import searchStop from '~/components/form/selects/stops.vue';
import displayMixin from '~/components/modals/planificator/shuttle/mixins/display-stops';

export default {
  components: {
    searchStop,
    VueTelInput,
  },
  mixins: [
    displayMixin(),
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
      departure: null,
      arrival: null,
      email: '',
      phone: '',
    };
  },
  computed: {
    departureIndex() {
      return this.stops.findIndex((stop) => this.departure && stop.id === this.departure.id);
    },
  },
  watch: {
    parentStops() {
      this.stops = [...this.parentStops];
    },
    parentPassengers() {
      this.passengers = [...this.parentPassengers];
    },
  },
  methods: {
    getInterstopDate(time) {
      return DateTime.fromISO(time).toLocaleString({ hour: '2-digit', minute: '2-digit', hour12: false });
    },
    deletePassenger(passenger) {
      this.passengers.splice(this.passengers.findIndex(({ email }) => email === passenger.email), 1);
      this.$emit('update-passengers', this.passengers);
    },
    addPassenger() {
      if (this.email && this.departure && this.arrival) {
        const departure = this.stops.find((stop) => stop.id === this.departure.id);
        const arrival = this.stops.find((stop) => stop.id === this.arrival.id);
        if (departure && arrival) {
          const passenger = {
            email: this.email,
            departure: {
              id: departure.id,
              label: departure.label,
            },
            arrival: {
              id: arrival.id,
              label: arrival.label,
            },
          };

          if (this.phone) {
            passenger.phone = this.phone;
          }

          this.passengers.push(passenger);
        }
        this.resetState();
        this.$emit('update-passengers', this.passengers);
      } else {
        this.$toast.error('Veuillez compléter l\'email, l\'arrêt de départ et l\'arrêt d\'arrivée');
      }
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
