<template>
  <vue-modal
    :active="modalOpen"
    :with-background="false"
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
        format="YYYY-MM-DD HH:mm"
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
        <search-poi
          v-model="ride.departure"
          v-autofocus="{
            hasBeenFocused: hasBeenFocused,
            focus: focusState.rideDeparture,
            input: ride.departure,
            inputName: 'rideDeparture',
            cb: focusNext
          }"
          :current-campus="currentCampus"
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
          :current-campus="currentCampus"
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
        <input
          id="phone"
          v-model="ride.phone"
          v-autofocus="{
            hasBeenFocused: hasBeenFocused,
            focus: focusState.phone,
            input: ride.phone,
            inputName: 'phone',
            cb: focusNext
          }"
          class="input"
        >
      </ec-field>
    </div>

    <div class="columns">
      <div class="column">
        <div class="control">
          <label class="checkbox">
            <input
              v-model="ride.luggage"
              type="checkbox"
            >
            Présence de bagages.
          </label>
        </div>
      </div>
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
          :campus="campus"
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
          :campus="campus"
          :driver="ride.driver"
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

    <template slot="submit">
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
  </vue-modal>
</template>

<script>
export default {
};
</script>

<style scoped>

</style>
