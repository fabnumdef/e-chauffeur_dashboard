<template>
  <div id="stop-manager">
    <template
      v-for="(stop, index) in stops"
    >
      <div
        v-if="nextStop(index)"
        :key="index"
        class="stop-dropdown"
        @click="displayDetails(index)"
      >
        <span>{{ stop.label }}<fa-icon icon="arrow-right" />{{ nextStop(index).label }}</span>
        <span v-if="capacity">{{ stop.passengers.length }}/{{ capacity }}<fa-icon icon="user" /></span>
        <span v-else>Capacite du vehicule non definie</span>
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
        v-if="toDisplay[index]"
        :key="`stops-details--${index}`"
        class="stop-details"
      >
        <ul class="passengers-list">
          <li
            v-for="(passenger, i) in stop.passengers"
            :key="`passengers-list--${i}`"
          >
            {{ passenger.email }}
            <fa-icon :icon="'user'" />
          </li>
        </ul>
        <div class="add-passenger">
          <button
            class="button is-dark is-small"
            @click="displayAddFields.splice(index, 1, !displayAddFields[index])"
          >
            {{ displayAddFields[index] ? 'Annuler l\'ajout' : 'Ajouter un passager' }}
          </button>
          <form
            v-if="displayAddFields[index]"
            @submit.prevent="addPassenger(index, newPassenger)"
          >
            <label for="email">Email :</label>
            <input
              id="email"
              v-model="newPassenger[index]"
              class="input"
              type="email"
              placeholder="Entrer l'email du passager"
            >
            <button
              class="button is-success is-small"
              type="submit"
            >
              Ajouter
            </button>
          </form>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    parentStops: {
      type: Array,
      default: () => [],
    },
    capacity: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      stops: [...this.parentStops],
      toDisplay: this.parentStops.map(() => false),
      displayAddFields: this.parentStops.map(() => false),
      newPassenger: this.parentStops.map(() => ''),
    };
  },
  watch: {
    parentStops() {
      this.stops = [...this.parentStops];
    },
  },
  methods: {
    displayDetails(index) {
      this.toDisplay.splice(index, 1, !this.toDisplay[index]);
    },
    nextStop(index) {
      if (index === this.stops.length - 1) {
        return null;
      }
      return this.stops[index + 1];
    },
    async addPassenger(index, emails) {
      const email = emails[index];
      const stop = this.stops[index];
      if (stop.passengers) {
        stop.passengers.push({ email });
      } else {
        stop.passengers = [{ email }];
      }
      this.stops.splice(index, 1, stop);
      this.$emit('updateStops', this.stops);
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
      padding: .8em 1.5em;
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
          border: 1px solid $gray;
          padding: .3em .3em .3em 1em;
          font-weight: 700;
          border-radius: 2em;
          width: fit-content;
          margin: 0 .5em .5em 0;
          text-transform: capitalize;
          svg {
            color: $blue-ultra-light;
            margin-left: 1em;
          }
        }
      }
      .add-passenger {
        display: flex;
        align-items: center;
        form {
          padding: 0 1em;
          display: flex;
          align-items: center;
          width: 100%;
          label, input {
            margin-right: 1em;
          }
          label {
            width: 80px;
            font-weight: 700;
          }
          .input {
            padding: 0;
          }
        }
      }
    }
  }
</style>
