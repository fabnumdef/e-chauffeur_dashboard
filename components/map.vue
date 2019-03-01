<template>
  <div class="fixed is-hidden-mobile is-hidden-tablet-only">
    <div id="map-wrap">
      <no-ssr>
        <l-map
          :zoom="13"
          :center="center"
        >
          <l-tile-layer url="//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <l-marker
            v-for="driver in drivers"
            :key="driver.id"
            :lat-lng="reverse(driver.position.coordinates)"
          >
            <l-icon>
              <svg
                width="40"
                height="40"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="20"
                  cy="20"
                  r="20"
                  :class="getStatus(driver)"
                />
                <text
                  :class="getStatus(driver)"
                  class="is-inverted is-uppercase"
                  x="50%"
                  y="50%"
                  text-anchor="middle"
                  dy=".3em"
                  v-if="driver.currentRide && driver.currentRide.car && driver.currentRide.car.model"
                >
                  {{driver.currentRide.car.model.label.split(" ").map((n)=>n[0]).join('')}}
                </text>
              </svg>
            </l-icon>
          </l-marker>
        </l-map>
      </no-ssr>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { DateTime, Interval } from 'luxon';
import {
  DELIVERED, IN_PROGRESS, WAITING, STARTED, ACCEPTED, DONE,
} from '~/api/status';

export default {
  computed: {
    center() {
      const [lon, lat] = this.campus.location.coordinates;
      return [lat, lon];
    },
    ...mapGetters({
      realTimeDrivers: 'realtime/drivers',
      rides: 'realtime/rides',
      campus: 'context/campus',
    }),
    drivers() {
      return this.realTimeDrivers.map(d => ({
        ...d,
        currentRide: this.getCurrentRide(d),
      }));
    },
  },
  methods: {
    reverse([lon, lat]) {
      return [lat, lon];
    },
    getCurrentRide({ date, id } = {}) {
      const currentTime = DateTime.fromISO(date);
      return this.rides
        .filter(r => r.driver.id === id)
        .find(r => Interval.fromDateTimes(DateTime.fromISO(r.start), DateTime.fromISO(r.end)).contains(currentTime));
    },
    getStatus(driver) {
      if (!driver.currentRide || !driver.currentRide.status) {
        return 'is-success';
      }
      switch (driver.currentRide.status) {
        case STARTED:
        case WAITING:
          return 'is-warning';
        case IN_PROGRESS:
        case DELIVERED:
          return 'is-primary';
        case ACCEPTED:
        case DONE:
        default:
          return 'is-success';
      }
    },
  },
};
</script>

<style scoped lang="scss">
  @import "~assets/css/head";

  @each $name, $pair in $colors {
    $color: nth($pair, 1);
    $color-invert: nth($pair, 2);
    circle.is-#{$name} {
      fill: $color;
    }
    text.is-inverted.is-#{$name} {
      fill: $color-invert;
      font-weight: bold;
      font-size: $size-6;
    }
  }
  #map-wrap {
    z-index: 0;
    height: 100vh;
    position: fixed;
    width: 45vw;
  }
  .fixed {
    height: 100vh;
  }
</style>
