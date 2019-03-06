<template>
  <main>
    <h1 class="title">
      Supervision des courses
    </h1>
    <div class="box today">
      <date-time
        v-model="today"
        lang="fr"
        append-to-body
        input-class="input"
        format="YYYY-MM-DD"
      >
        <template slot="calendar-icon">
          <fa-icon icon="calendar-alt" />
        </template>
      </date-time>
    </div>
    <vue-calendar
      :events="rides"
      with-current-time
      :schedule-with="drivers"
      :current-date="today"
      without-default-event-style
      :modal-status="modalOpen"
      @modal-submit="edit(ride)"
      @dates-update="updateDates"
      @click-event="onClickEvent"
      @init-event="initRide"
      @time-pace="onTimePace"
      @modal-toggle="toggleModal"
    >
      <template slot="title">
        <template v-if="ride.id">
          Modifier course #{{ ride.id }}
        </template>
        <template v-else>
          Nouvelle course
        </template>
      </template>
      <template
        slot="event-card"
        slot-scope="{ event }"
      >
        <div
          class="event-status"
          :class="eventStatusClass(event)"
        >
          <fa-icon
            v-if="isWaiting(event)"
            icon="comment-dots"
            class="waiting-icon"
          />
          <p>{{ event.departure.label }} <fa-icon icon="arrow-right" /> {{ event.arrival.label }}</p>
        </div>
      </template>
      <template
        slot="col-title"
        slot-scope="{ col }"
      >
        <ride-calendar-head
          :driver="col"
          :ride="getCurrentRide(col.id)"
        />
      </template>
      <template
        slot="modal"
        class="white-background"
      >
        <ec-field
          label="Type de course"
          field-id="departure"
        >
          <search-category v-model="ride.category" />
        </ec-field>
        <ec-field
          label="Dates"
          field-id="dates"
        >
          <date-time
            lang="fr"
            append-to-body
            input-class="input"
            type="datetime"
            range
            :value="range"
            :minute-step="5"
            format="YYYY-MM-DD HH:mm:ss"
            range-separator="->"
            @input="updateDates"
          >
            <template slot="calendar-icon">
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
            <search-poi v-model="ride.departure" />
          </ec-field>

          <ec-field
            class="column"
            label="Arrivée"
            field-id="arrival"
          >
            <search-poi v-model="ride.arrival" />
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
            <input
              id="phone"
              v-model="ride.phone"
              class="input"
            >
          </ec-field>
        </div>

        <div class="columns">
          <ec-field
            v-if="ride.driver && ride.driver.name"
            class="column"
            label="Chauffeur"
            field-id="driver"
          >
            {{ ride.driver.name }}
          </ec-field>
          <ec-field
            class="column"
            label="Véhicule"
            field-id="car"
          >
            <search-available-car
              v-model="ride.car"
              :start="ride.start"
              :end="ride.end"
              :campus="campus"
            />
          </ec-field>
        </div>

        <ec-field
          label="Commentaires"
          field-id="comments"
        >
          <textarea
            id="comments"
            v-model="ride.comments"
            class="textarea"
          />
        </ec-field>
      </template>
      <template slot="modal-submit">
        <button
          v-if="can(ride, VALIDATE)"
          class="button is-success"
          type="button"
          @click="edit(ride, VALIDATED)"
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
          :options="{[REJECTED_BOUNDARY]: 'Refuser (périmètre)', [REJECTED_CAPACITY]: 'Refuser (capacité)'}"
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
    </vue-calendar>
  </main>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import vueCalendar from '~/components/calendar.vue';
import rideCalendarHead from '~/components/ride-calendar-head.vue';
import ecField from '~/components/form/field.vue';
import { DateTime, Interval } from 'luxon';
import searchPoi from '~/components/form/search-poi';
import searchCategory from '~/components/form/search-campus-category';
import searchAvailableCar from '~/components/form/search-available-car';
import bulmaDropdown from '~/components/dropdown.vue';
import Status, {
  DELIVERED, IN_PROGRESS, WAITING, STARTED, ACCEPTED, VALIDATED, VALIDATE, CREATED,
  REJECT_BOUNDARY, REJECT_CAPACITY,
  REJECTED_BOUNDARY, REJECTED_CAPACITY,
  CANCEL_TECHNICAL,
  CANCEL_REQUESTED_CUSTOMER,
  CANCEL_CUSTOMER_OVERLOAD,
  CANCEL_CUSTOMER_MISSING,
  CANCELED_TECHNICAL,
  CANCELED_REQUESTED_CUSTOMER,
  CANCELED_CUSTOMER_OVERLOAD,
  CANCELED_CUSTOMER_MISSING,
} from '~/api/status';

const EDITABLE_FIELDS = [
  'id',
  'start',
  'end',
  'departure(id,label)',
  'arrival(id,label)',
  'car(id,label,model(id,label))',
  'driver(id,name)',
  'phone',
  'status',
  'comments',
  'passengersCount',
  'category(id,label)',
].join(',');

export function generateEmptyRide() {
  return {
    start: null,
    end: null,
    phone: null,
    departure: null,
    arrival: null,
    driver: null,
    status: CREATED,
    category: null,
    passengersCount: 1,
  };
}

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
    vueCalendar,
    ecField,
    searchAvailableCar,
    searchCategory,
    rideCalendarHead,
    bulmaDropdown,
  },
  computed: {
    ...mapGetters({ rides: 'realtime/rides', currentCampus: 'context/campus' }),
    ...Object.keys(actions)
      .map(a => ({ [a]: () => actions[a] }))
      .reduce((acc, curr) => Object.assign(acc, curr), {}),
    range() {
      return [
        this.ride.start || null,
        this.ride.end || null,
      ].map(l => (l && l.toJSDate ? l.toJSDate() : null));
    },
  },

  watch: {
    async today(v) {
      const today = DateTime.fromJSDate(v);
      const start = today.startOf('days').toJSDate();
      const end = today.endOf('days').toJSDate();
      const ridesApi = this.$api.rides(this.campus, EDITABLE_FIELDS);
      // todo: Should be able to trigger queries in the same time.
      const { data: drivers } = await ridesApi.getAvailableDrivers(
        'id,name,availabilities(s,e)',
        start,
        end,
      );
      const { data: rides } = await ridesApi.getRides(start, end);
      this.drivers = drivers;
      this.setRides(rides);
    },
  },

  async asyncData({ params, $api, store }) {
    const today = new Date();
    const start = DateTime.local().startOf('days').toJSDate();
    const end = DateTime.local().endOf('days').toJSDate();
    const ridesApi = $api.rides(params.campus, EDITABLE_FIELDS);
    const { data: drivers } = await ridesApi.getAvailableDrivers(
      'id,name,availabilities(s,e)',
      start,
      end,
    );
    const { data: rides } = await ridesApi.getRides(start, end);
    store.commit('realtime/setRides', rides);
    return {
      campus: params.campus,
      drivers,
      today,
      ride: generateEmptyRide(),
      modalOpen: false,
    };
  },
  methods: {
    ...mapMutations({
      pushRide: 'realtime/pushRide',
      setRides: 'realtime/setRides',
    }),

    async edit(r, status) {
      const ride = Object.assign({}, r, status ? { status } : {});

      try {
        if (ride.id) {
          await this.$api.rides(
            this.campus,
            EDITABLE_FIELDS,
          ).patchRide(ride.id, ride);
          this.$toasted.success('La course a bien été mise à jour.');
        } else {
          await this.$api.rides(
            this.campus,
            EDITABLE_FIELDS,
          ).postRide(ride);
          this.$toasted.success('La course a bien été créée.');
        }
        this.toggleModal(false);
      } catch (e) {
        this.$toasted.error(`La course n'a pas été créée ou mise à jour (${e}), merci de vérifiez les champs.`);
      }
    },
    async changeStatus(ride, status) {
      if (!ride.id) {
        this.$toasted.error('Changement de status possible uniquement pour une course sauvegardée');
      }
      try {
        await this.$api.rides(
          this.campus,
          EDITABLE_FIELDS,
        ).mutateRide(ride, status);
        this.$toasted.success('Status modifié.');
        this.toggleModal(false);
      } catch (e) {
        this.$toasted.error(`La course n'a pas été créée ou mise à jour (${e}), merci de vérifiez les champs.`);
      }
    },
    toggleModal(newStatus = false) {
      this.modalOpen = newStatus;
    },

    updateDates([start, end], { id, name } = {}) {
      this.ride.driver = { id, name };
      this.ride.start = start instanceof DateTime ? start : DateTime.fromJSDate(start);
      this.ride.end = end instanceof DateTime ? end : DateTime.fromJSDate(end);
    },

    onClickEvent(ride) {
      this.ride = ride;
      this.toggleModal(true);
    },

    initRide() {
      this.ride = generateEmptyRide();
      if (this.currentCampus.categories.length > 0) {
        [this.ride.category] = this.currentCampus.categories;
      }
    },

    eventStatusClass(event) {
      switch (event.status) {
        case DELIVERED:
          return 'event-status-done';
        case STARTED:
        case WAITING:
          return 'event-status-going';
        case IN_PROGRESS:
          return 'event-status-coming';
        case REJECTED_CAPACITY:
        case REJECTED_BOUNDARY:
        case CANCELED_TECHNICAL:
        case CANCELED_CUSTOMER_MISSING:
        case CANCELED_CUSTOMER_OVERLOAD:
        case CANCELED_REQUESTED_CUSTOMER:
          return 'event-status-wrong';
        case ACCEPTED:
        default:
          return 'event-status-planned';
      }
    },
    isWaiting(event) {
      switch (event.status) {
        case VALIDATED:
        case WAITING:
          return true;
        default:
          return false;
      }
    },
    onTimePace(currentTime) {
      this.currentTime = currentTime;
    },
    getCurrentRide(driverId) {
      const currentTime = DateTime.fromJSDate(this.currentTime);
      return this.rides
        .filter(r => r.driver.id === driverId)
        .find(r => Interval.fromDateTimes(DateTime.fromISO(r.start), DateTime.fromISO(r.end)).contains(currentTime));
    },
    can: ({ status }, action) => {
      const state = new Status(status);
      return state.can(action);
    },
  },
};
</script>

<style scoped lang="scss">
  @import "~assets/css/head";

  /deep/ .day-title {
    height: 120px;
  }
  .today.box {
    padding: $size-small;
    display: inline-block;
    .svg-inline--fa {
      color: $black;
    }
  }
  .event-status {
    width: 100%;
    height: 100%;
    padding: 5px;
    border-radius: 5px;
    font-weight: bold;
    &-done {
      color: $black;
      border: 1px solid $black;
    }
    &-planned {
      background: $dark-gray;
      color: findColorInvert($dark-gray);
    }
    &-going {
      background: $warning;
      color: findColorInvert($warning);
    }
    &-coming {
      background: $primary;
      color: findColorInvert($primary);
    }
    &-wrong {
      background: $white;
      color: $danger;
      border: 1px solid $danger;
    }
  }
  .waiting-icon {
    color: $primary;
    font-size: $size-medium;
    position: absolute;
    right: -$size-small;
    top: -$size-small;
    filter: drop-shadow(1px 1px 5px rgba($light-gray, 0.7));
  }
</style>
