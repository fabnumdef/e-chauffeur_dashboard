<template>
  <div id="history">
    <div id="history-container" class="columns ">
      <div id="history-container-filter" class="column is-one-fifth ">
        <div class="history-title">
          <h1 class="">Historique</h1>
        </div>

        <div class="columns ">
          <div class="column">
            <p class="is-size-3 has-text-weight-bold">
              <span class="has-text-info">{{ rides.data.length }}</span> courses
            </p>
          </div>
        </div>
      </div>
      <div id="history-container-content" class="column ">
        <div class="columns  is-mobile history-header">
          <div class="column">Date</div>
          <div class="column">Heure</div>
          <div class="column">Chauffeur</div>
          <div class="column">Type de course</div>
          <div class="column">Statut</div>
          <div class="column"><a class="button is-rounded">Exporter CSV</a></div>
        </div>

        <div class="history-container-ride">
          <template v-for="(ride,index) in rides.data" >
            <div  v-bind:id="'history-ride-' + index" class="columns is-multiline is-mobile history-ride">
              <div class="column" @click="collapseRideDetails(index)">
                <span class="icon is-small" >
                    <fa-icon :icon="['fas', 'chevron-right']" />
                </span>
                {{  getFormatDate(ride.start, 'D') }}</div>
              <div class="column">{{ getFormatDate(ride.start, 'T') }} </div>
              <div class="column">{{ ride.driver.name }}</div>
              <div class="column">Service</div>
              <div class="column"><span class="tag is-info is-medium">COURSE EFFECTUEE</span></div>
              <div class="column"></div>

              <div v-bind:id="'history-ride-details-' + index" class="history-ride-details d-none">
                <div class="columns w-100">
                  <div class="column is-one-fifth">
                    <ec-map class="is-map" />
                  </div>
                  <div class="column">
                    <div class="columns">
                      <div class="column">
                        <p class="is-size-7">Référence course</p>
                        {{ ride.id }}
                      </div>
                      <div class="column ">
                        <p class="is-size-7">Type de véhicule</p>
                        {{ ride.car.label }}
                      </div>
                      <div class="column ">
                        <p class="is-size-7">Temps de la course</p>
                        {{ getIntervalDuration(ride.start, ride.end) }}
                      </div>
                      <div class="column ">
                        <p class="is-size-7">Distance de la course</p>
                        **
                      </div>
                      <div class="column ">
                        <p class="is-size-7">Nombre de passagers</p>
                        {{ ride.passengersCount }}
                      </div>
                      <div class="column ">
                        <p class="is-size-7">Numéro de téléphone</p>
                        {{ ride.phone }}
                      </div>
                      <div class="column ">
                        <p class="is-size-7">NIA / NID</p>
                        **
                      </div>
                    </div>
                    <div class="columns has-text-left">
                      <div class="column">
                        <p class="is-size-7">Départ</p>
                        HH:MM - Adresse départ
                        <p class="is-size-7">Arrivée</p>
                        HH-MM - Adresse arrivée
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { DateTime } from "luxon";
  import Interval from 'luxon/src/interval';
  import ecMap from '~/components/map.vue';

  export default {
    components: {
      ecMap,
    },

    async asyncData({ $api }) {
      // const { data, pagination } = await $api.campuses.getCampuses('id,name');
      const endDate = DateTime.local().toISO();
      const startDate = DateTime.local().minus({ months: 1 }).toISO();
      const rides = await $api.rides('BSL', '*').getRides(startDate, endDate);

      return {
        rides
      };
    },

    methods: {
      getIntervalDuration: function(startDate, endDate, format = 'hh:mm:ss') {
        return Interval .fromDateTimes(DateTime.fromISO(startDate), DateTime.fromISO(endDate))
                .toDuration()
                .toFormat(format);
      },

      getFormatDate: function(date, format) {
        return DateTime.fromISO(date).toFormat(format);
      },

      collapseRideDetails: function (id) {
        let elHistoRideDetails = document.getElementById('history-ride-details-' + id);
        let elHistoRideIconChevron = document.getElementById('history-ride-' + id).getElementsByClassName('icon')[0];

        if (! elHistoRideDetails.classList.contains('d-none')){
          elHistoRideDetails.classList.add('d-none');
          elHistoRideIconChevron.classList.remove('rotate90');
        } else {
          elHistoRideDetails.classList.remove('d-none');
          elHistoRideIconChevron.classList.add('rotate90');
        }
      }
    }
  }
</script>

<style scope lang="scss" scoped>
  @import "~assets/css/head";

  $heightHeader: 75px;
  $border-color: $grey-lighter;
  $background-color: $grey-light;
  $padding: 10px;
  $margin: 10px;

  #history {
    color: $black;
    margin: 20px;
    background-color: $white;

    .history-title {
      border-bottom: 1px solid $border-color;

      h1 {
        color: $black;
        height: $heightHeader;
        font-size: 2rem;
        font-weight: bold;
      }
    }

    #history-container {
      padding: 20px;

      #history-container-filter {
        padding-top:0;
        padding-right:0;

        div:nth-child(2) { flex-direction: column; }
      }

      #history-container-content {
        padding-left: 0;
      }
    }

    .history-header {
      background-color: $white;
      height: $heightHeader;

      text-align: center;
      font-weight: bold;
    }

    .history-container-ride {
      background-color: $white-ter;
      padding: $padding;
      text-align: center;
      border: 1px solid $border-color;

      .columns:not(:first-child) {
        margin-top: $margin;
      }
    }

    .history-ride {
      background-color: $white;  margin: 1px;
      padding: $padding;
      border: 1px solid $grey-lighter;
      font-weight: bold;

      .column {
        padding: 15px;
      }

      .icon:hover {
        cursor: pointer;
      }
    }

    .history-ride-details {
      display: flex !important;
      background-color: $white;
      margin: { left: 1px; right: 1px; bottom: 1px }
      border-top: 1px solid $grey-lighter;
      flex-wrap: wrap;
      width: 100%;
      font-weight: normal;

      &:first-child {
        width: 100%;
      }

      .is-map {
        height: 170px;
        width: 170px;
      }

      p {
        color: $grey-light;
      }
    }

    .columns:not(:last-child) {
      margin-bottom: 0;
    }

    .d-none {
      display: none !important;
    }

    .rotate90 {
      transform: rotate(90deg);
    }

    .w-100 {
      width: 100% !important;
    }
  }
</style>
