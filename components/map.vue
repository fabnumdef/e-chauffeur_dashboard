<template>
  <div class="fixed is-hidden-mobile is-hidden-tablet-only">
    <div
      id="detach"
    >
      <nuxt-link
        v-if="!isFullscreen"
        :to="{ name: 'campus-map' }"
        target="_blank"
      >
        <button
          class="button is-primary"
          @click="hideMap"
        >
          <fa-icon icon="external-link-alt" />&nbsp;
          Détacher la carte
        </button>
      </nuxt-link>
    </div>
    <div class="actions">
      <button
        class="button"
        :class="hasPOI ? 'is-success' : 'is-danger'"
        @click="togglePOI()"
      >
        Lieux
      </button>
    </div>
    <div
      id="map-wrap"
      :class="{'fullscreen': isFullscreen}"
    >
      <client-only>
        <l-map
          :zoom="13"
          :center="center"
        >
          <l-tile-layer url="//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <template v-if="hasPOI">
            <l-marker
              v-for="poi in flavoredPois"
              :key="poi.id"
              :lat-lng="poi.position"
            >
              <l-icon
                :icon-size="[12, 12]"
                :icon-anchor="[6, 12]"
                class="icon"
              >
                <fa-icon
                  :icon="['fas', 'map-pin']"
                  class="is-primary"
                  size="1x"
                />
              </l-icon>
              <l-tooltip class="content">
                {{ poi.label }}
              </l-tooltip>
            </l-marker>
          </template>
          <l-marker
            v-for="driver in drivers"
            :key="driver.id"
            :lat-lng="reverse(driver.position.coordinates)"
          >
            <l-icon
              :icon-size="[40,40]"
              :icon-anchor="[20,20]"
            >
              <svg
                width="40"
                height="40"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="20"
                  cy="20"
                  r="20"
                  :class="`ride-status-${getStatus(driver)}`"
                />
                <text
                  :class="`ride-status-${getStatus(driver)}`"
                  class="is-inverted is-uppercase"
                  x="50%"
                  y="50%"
                  text-anchor="middle"
                  dy=".3em"
                >
                  {{ getInitials(driver) }}
                </text>
              </svg>
            </l-icon>
            <l-tooltip class="content">
              <div>{{ driver.name }}</div>
              <div v-if="driver.currentRide">
                {{ driver.currentRide.departure.label }} -> {{ driver.currentRide.arrival.label }}<br>
                {{ driver.currentRide.timeString }}
                <div v-if="driver.currentRide.car">
                  {{ driver.currentRide.car.model.label }} - {{ driver.currentRide.car.id }}
                </div>
              </div>
            </l-tooltip>
          </l-marker>
        </l-map>
      </client-only>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { DateTime, Interval } from 'luxon';
import lGet from 'lodash.get';
import {
  DELIVERED, IN_PROGRESS, WAITING, STARTED, ACCEPTED, VALIDATED,
} from '@fabnumdef/e-chauffeur_lib-vue/api/status/states';

export default {
  props: {
    isFullscreen: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    hasPOI: true,
    pois: [],
  }),
  computed: {
    flavoredPois() {
      return this.pois.map((poi) => ({
        ...poi,
        position: lGet(poi, 'location.coordinates', []).reverse(),
      })).filter((poi) => poi.position.length > 0);
    },
    center() {
      const [lon, lat] = this.campus.location.coordinates;
      return [lat, lon];
    },
    ...mapGetters({
      realTimeDrivers: 'realtime/drivers',
      displacements: 'realtime/todayDisplacements',
      campus: 'context/campus',
    }),
    drivers() {
      return this.realTimeDrivers.reduce((acc, d) => {
        const diffLastPositionDate = DateTime.fromJSDate(new Date()).diff(DateTime.fromISO(d.date));
        if (diffLastPositionDate < 7200 * 1000) {
          acc.push({
            ...d,
            currentRide: this.getCurrentRide(d),
          });
        }
        return acc;
      }, []);
    },
  },
  async mounted() {
    const { data } = await this.$api.query('pois')
      .setMask('label,location(coordinates),id')
      .setCampus(this.campus.id)
      .list()
      .setLimit(1000);
    this.pois = data;
  },
  methods: {
    hideMap() {
      this.$store.dispatch('context/hideMap', true);
    },
    reverse([lon, lat]) {
      return [lat, lon];
    },
    getCurrentRide({ id } = {}) {
      const currentTime = DateTime.local();
      const ride = this.rides
        .filter((r) => r.driver && r.driver.id === id)
        .sort((a, b) => (DateTime.fromISO(a.start) < DateTime.fromISO(b.start) ? -1 : 1))
        .find((r) => (
          Interval.fromDateTimes(DateTime.fromISO(r.start), DateTime.fromISO(r.end)).contains(currentTime)
          || currentTime < DateTime.fromISO(r.start)
        ));
      if (ride) {
        ride.timeString = `${DateTime.fromISO(ride.start).toLocaleString(DateTime.TIME_SIMPLE)} à `
          + `${DateTime.fromISO(ride.end).toLocaleString(DateTime.TIME_SIMPLE)}`;
      }
      return ride;
    },
    getStatus(driver) {
      if (!driver.currentRide || !driver.currentRide.status) {
        return 'available';
      }
      switch (driver.currentRide.status) {
        case WAITING:
          return 'waiting';
        case STARTED:
        case IN_PROGRESS:
          return 'driving';
        case ACCEPTED:
          return 'accepted';
        case VALIDATED:
          return 'planned';
        case DELIVERED:
        default:
          return 'available';
      }
    },
    getInitials({ name = '' }) {
      let initials = '';
      const words = name.split(' ');
      if (words.length > 1) {
        initials = words.map((n) => n[0]).join('');
      } else {
        initials += name[0] || '';
        initials += name[1] || '';
      }
      return initials;
    },
    togglePOI(bool) {
      this.hasPOI = typeof bool === 'undefined' ? !this.hasPOI : bool;
    },
  },
};
</script>

<style scoped lang="scss">
  @import "~assets/css/head";

  .ride-status {
    padding: 0 5px;
    width: 100%;
    font-weight: bold;
    display: inline-block;
    text-transform: uppercase;
    &-available {
      fill: $success;
    }
    &-unavailable {
      fill: $gray;
    }
    &-planned {
      fill: $dark-gray;
    }
    &-accepted {
      fill: #8192A9;
    }
    &-driving {
      fill: $primary;
    }
    &-waiting{
      fill: $warning;
    }
    &-available.is-inverted {
      fill: findColorInvert($success);
    }
    &-unavailable.is-inverted {
      fill: findColorInvert($gray);
    }
    &-planned.is-inverted {
      fill: findColorInvert($dark-gray);
    }
    &-accepted.is-inverted {
      fill: findColorInvert(#8192A9);
    }
    &-driving.is-inverted {
      fill: findColorInvert($primary);
    }
    &-waiting.is-inverted {
      fill: findColorInvert($warning);
    }
  }

  text.is-inverted {
    font-weight: bold;
    font-size: $size-6;
  }

  #map-wrap {
    z-index: 0;
    height: 100vh;
    position: fixed;
    width: 45vw;
  }
  #detach {
    z-index: 10;
    position: fixed;
    right: 0;
    margin-top: 10px;
    margin-right: 10px;
  }
  .actions {
    z-index: 10;
    position: fixed;
    bottom: 0;
    right: 0;
    padding: $size-small;
  }
  #map-wrap.fullscreen {
    width: 100vw;
  }
  .fixed {
    height: 100vh;
  }
</style>
