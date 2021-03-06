<template>
  <div id="history">
    <div
      id="history-container"
      class="columns"
    >
      <div
        id="history-container-filter"
        class="column is-one-fifth"
      >
        <div class="history-title">
          <h1>Historique</h1>
        </div>

        <div class="columns">
          <div class="column">
            <p class="is-size-3 has-text-weight-bold">
              <span class="has-text-info">
                {{ rides.length }}
              </span>
              <span v-if="rides.length > 0">courses</span>
              <span v-else>course</span>
            </p>
          </div>
          <div class="column is-size-4 has-text-weight-bold">
            Filtres
          </div>
          <div class="column">
            <div class="columns is-mobile">
              <div class="column is-narrow has-text-weight-bold">
                Date
              </div>
              <div class="column filter-title-line" />
            </div>
            <client-only>
              <ec-date-picker
                :value="filters.date"
                @dateChange="updateFilterDate"
              />
            </client-only>
          </div>
        </div>
      </div>

      <div
        id="history-container-content"
        class="column"
      >
        <div class="columns  is-mobile history-header">
          <div class="column">
            Date
          </div>
          <div class="column">
            Heure
          </div>
          <div class="column">
            Chauffeur
          </div>
          <div class="column">
            Type de course
          </div>
          <div class="column">
            Statut
          </div>
          <div class="column">
            <button
              class="button is-rounded"
              type="button"
              @click="toggleCsvModal(true)"
            >
              <fa-icon
                :icon="['fas', 'file-export']"
                class="has-text-info"
              />
              Exporter CSV
            </button>
          </div>
        </div>
        <vue-modal
          :active="csvStatus"
          @toggle-modal="toggleCsvModal(false)"
        >
          <template slot="title">
            Télécharger le CSV
          </template>
          <fieldset>
            <ec-field
              label="Délimiteur CSV"
              field-id="delimiter"
            >
              <input
                id="delimiter"
                v-model="csv.delimiter"
                type="text"
                class="input"
              >
            </ec-field>
            <ec-field
              label="Séparateur de champ CSV"
              field-id="separator"
            >
              <input
                id="separator"
                v-model="csv.separator"
                type="text"
                class="input"
              >
            </ec-field>
            <ec-field
              label="Mask de champs"
              field-id="mask"
            >
              <textarea
                id="mask"
                v-model.trim="csv.mask"
                class="textarea"
              />
            </ec-field>
          </fieldset>
          <hr>
          <ul>
            <li
              v-for="(row, i) in downloadLinks"
              :key="i"
            >
              <button
                class="button is-primary"
                @click="row"
              >
                Partie {{ i+1 }}
              </button>
            </li>
          </ul>
          <template slot="submit" />
        </vue-modal>

        <div class="history-container-ride">
          <p
            v-if="rides.length === 0"
            class="has-text-weight-bold"
          >
            Aucunes données à afficher.
          </p>

          <template v-for="(ride,index) in rides">
            <div
              :id="'history-ride-' + index"
              :key="ride.id"
              class="columns is-multiline is-mobile history-ride"
            >
              <div class="column">
                <span
                  class="icon is-small"
                  :class="{'icon-rotate90': show[index]}"
                  @click="showRideDetails(index)"
                >
                  <fa-icon :icon="['fas', 'chevron-right']" />
                </span>
                {{ getFormatDate(ride.start, 'D') }}
              </div>
              <div class="column">
                {{ getFormatDate(ride.start, 'T') }}
              </div>
              <div class="column">
                <template v-if="ride.driver">
                  {{ ride.driver.firstname }} {{ ride.driver.lastname }}
                </template>
              </div>
              <div class="column">
                <template v-if="ride.category">
                  {{ ride.category.label }}
                </template>
              </div>
              <div class="column">
                <span
                  class="status-tag is-medium"
                  :class="getStatusInfos(ride.status, 'class')"
                >
                  {{ getStatusInfos(ride.status, 'text') }}
                </span>
              </div>
              <div class="column" />

              <div
                v-if="show[index]"
                :id="'history-ride-details-' + index"
                class="history-ride-details"
              >
                <div class="columns">
                  <div class="column is-one-quarter">
                    <client-only>
                      <l-map
                        :zoom="13"
                        :center="center"
                      >
                        <l-tile-layer url="//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <l-marker
                          v-for="arDep in [ride.departure, ride.arrival]"
                          :key="arDep.id"
                          :lat-lng="reverseLonLat(arDep.location.coordinates)"
                        >
                          <l-icon>
                            <svg
                              width="40"
                              height="40"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle
                                cx="5"
                                cy="5"
                                r="5"
                                :class="'color'"
                              />
                            </svg>
                          </l-icon>
                        </l-marker>
                      </l-map>
                    </client-only>
                  </div>
                  <div class="column">
                    <div class="columns">
                      <div class="column">
                        <p class="is-size-7">
                          Référence course
                        </p>
                        {{ ride.id }}
                      </div>
                      <div
                        v-if="ride.car"
                        class="column"
                      >
                        <p class="is-size-7">
                          Type de véhicule
                        </p>
                        {{ ride.car.label }}
                      </div>
                      <div class="column">
                        <p class="is-size-7">
                          Temps de la course
                        </p>
                        {{ getIntervalDuration(ride.start, ride.end) }}
                      </div>
                      <div class="column">
                        <p class="is-size-7">
                          Nombre de passagers
                        </p>
                        {{ ride.passengersCount }}
                      </div>
                      <div class="column">
                        <p class="is-size-7">
                          Numéro de téléphone
                        </p>
                        {{ ride.phone }}
                      </div>
                    </div>
                    <div class="columns has-text-left has-text-centered-mobile">
                      <div class="column">
                        <p class="is-size-7">
                          Départ
                        </p>
                        {{ getFormatDate(ride.start, 'hh:mm' ) }} - {{ ride.departure.label }}
                        <p class="is-size-7">
                          Arrivée
                        </p>
                        {{ getFormatDate(ride.end, 'hh:mm' ) }} - {{ ride.arrival.label }}
                      </div>
                      <div class="column is-narrow">
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
import { DateTime, Interval } from 'luxon';
import { mapGetters } from 'vuex';
import {
  CANCELED,
  DELIVERED,
  CANCELED_REQUESTED_CUSTOMER,
  CANCELED_CUSTOMER_MISSING,
  CANCELED_CUSTOMER_OVERLOAD,
  CANCELED_TECHNICAL,
} from '@fabnumdef/e-chauffeur_lib-vue/api/status/states';
import {
  CANCEL,
} from '@fabnumdef/e-chauffeur_lib-vue/api/status/transitions';
import generateCsvLink from '~/helpers/generate-csv-link';
import ecDatePicker from '~/components/datepicker.vue';
import vueModal from '~/components/modals/default.vue';

const ROWS_PER_QUERY = 1000;

export default {
  components: {
    ecDatePicker,
    vueModal,
  },

  data() {
    return {
      rides: [],
      downloadLinks: [],
      pagination: {},
      csvStatus: false,
      csv: {
        separator: ';',
        delimiter: '"',
        mask: 'id,departure(id,label,location),arrival(id,label,location),car(id,label,model(id,label)),'
          + 'campus(id,phone(drivers,everybody)),status,start,end,phone,driver(id,name),category(id,label),'
          + 'passengersCount,luggage,comments,createdAt,owner(id)',
      },
      filters: {
        date: [
          DateTime.local().minus({ months: 1 }).startOf('day').toJSDate(),
          DateTime.local().endOf('day').toJSDate(),
        ],
      },
      fields: ['id', 'start', 'end', 'phone', 'departure', 'arrival', 'driver', 'passengersCount', 'car',
        'campus', 'status', 'category', 'owner(id)'],
      show: [],
    };
  },

  computed: {
    center() {
      const [lon, lat] = this.campus.location.coordinates;
      return [lat, lon];
    },
    ...mapGetters({
      campus: 'context/campus',
    }),
  },
  watch: {
    async pagination() {
      await this.recalcDownloadLinks();
    },
    'csv.separator': async function csvSeparator() {
      await this.recalcDownloadLinks();
    },
    'csv.delimiter': async function csvSeparator() {
      await this.recalcDownloadLinks();
    },
    'csv.mask': async function csvSeparator() {
      await this.recalcDownloadLinks();
    },
  },

  created() {
    this.getRides();
  },

  methods: {
    async recalcDownloadLinks() {
      const { pagination: { total, limit }, csv } = this;
      this.downloadLinks = Array
        .from({ length: Math.ceil(total / limit) })
        .map((_, i) => async () => {
          const { data } = await this.$api.query('rides')
            .setMask(this.fields.join(','))
            .setCampus(this.campus.id)
            .list(this.filters.date[0], this.filters.date[1])
            .setOffset(ROWS_PER_QUERY * i)
            .setLimit(ROWS_PER_QUERY)
            .toCSV(csv);
          generateCsvLink(data);
        });
    },
    toggleCsvModal(force) {
      this.csvStatus = force || !this.csvStatus;
    },
    async getRides() {
      const { data, pagination } = await this.$api.query('rides')
        .setMask(this.fields.join(','))
        .setCampus(this.campus.id)
        .list(this.filters.date[0], this.filters.date[1])
        .setOffset(0)
        .setLimit(ROWS_PER_QUERY);
      this.rides = data;
      this.pagination = pagination;
      this.show = Array(this.rides.length).fill(false);
    },

    updateFilterDate([from, to]) {
      this.filters.date = [
        DateTime.fromJSDate(from).startOf('day').toJSDate(),
        DateTime.fromJSDate(to).endOf('day').toJSDate(),
      ];
      this.getRides();
    },

    getIntervalDuration(startDate, endDate, format = 'hh:mm:ss') {
      return Interval.fromDateTimes(DateTime.fromISO(startDate), DateTime.fromISO(endDate))
        .toDuration()
        .toFormat(format);
    },

    getFormatDate(date, format) {
      return DateTime.fromISO(date).toFormat(format);
    },

    getStatusInfos: (status, info) => {
      let statusInfos = {};

      switch (status) {
        case CANCEL:
        case CANCELED_TECHNICAL:
        case CANCELED_CUSTOMER_OVERLOAD:
        case CANCELED_CUSTOMER_MISSING:
        case CANCELED_REQUESTED_CUSTOMER:
        case CANCELED:
          statusInfos = { class: 'is-cancel', text: 'Course annulée' };
          break;
        case DELIVERED:
          statusInfos = { class: 'is-done', text: 'Course effectuée' };
          break;
        default:
          statusInfos = { class: 'is-progress', text: 'Course en cours' };
          break;
      }

      return statusInfos[info];
    },

    showRideDetails(i) {
      this.$set(this.show, i, !this.show[i]);
    },

    reverseLonLat([lon, lat]) {
      return [lat, lon];
    },
  },
};
</script>

<style lang="scss" scoped>
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

        div:nth-child(2) {
          flex-direction: column;
          padding-right: 15px
        }

        .filter-title-line {
          padding-left: 0;

          &:after {
            content:'';
            display:inline-block;
            vertical-align: middle;
            width: 100%;
            height: 1px;
            background: $grey-lighter
          }
        }
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

      svg {
        margin-right: 15px;
      }

    }

    .history-container-ride {
      background-color: $white-ter;
      padding: $padding;
      text-align: center;
      border: 1px solid $border-color;

      .column {
        text-transform: capitalize;
      }
      .columns:not(:first-child) {
        margin-top: $margin;
      }

      circle.color {
        fill: $info;
      }

      .icon.icon-rotate90 {
        transform: rotate(90deg);
      }

      .status-tag {
        width: 100%;
        color: white;
        text-transform: uppercase;
        &.is-done {
          background-color: $success;
        }
        &.is-cancel {
          background-color: $danger;
        }
        &.is-progress {
          background-color: $primary;
        }
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
      display: flex;
      flex-shrink: 1;
      flex-grow: 1;
      background-color: $white;
      margin: { left: 1px; right: 1px; bottom: 1px }
      border-top: 1px solid $grey-lighter;
      flex-wrap: wrap;
      width: 100%;
      font-weight: normal;

      .columns:first-child {
        width: 100%;
        flex-wrap: wrap;
      }

      p {
        color: $grey-light;
      }
    }

    .columns:not(:last-child) {
      margin-bottom: 0;
    }
  }
  /deep/ .modal {
    z-index: 1001; // Max leaflet z-index is 1000
  }
</style>
