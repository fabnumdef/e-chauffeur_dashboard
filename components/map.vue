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
                  v-if="driver.currentRide && driver.currentRide.car && driver.currentRide.car.model"
                  :class="getStatus(driver)"
                  class="is-inverted is-uppercase"
                  x="50%"
                  y="50%"
                  text-anchor="middle"
                  dy=".3em"
                >
                  {{ getInitials(driver.currentRide) }}
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
  DELIVERED, IN_PROGRESS, WAITING, STARTED, ACCEPTED,
} from '@fabnumdef/e-chauffeur_lib-vue/api/status/states';

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
          return 'is-primary';
        case ACCEPTED:
        case DELIVERED:
        default:
          return 'is-success';
      }
    },
    getInitials(currentRide) {
      let initials = '';
      const words = currentRide.driver.name.split(' ');
      if (words.length > 1) {
        initials = words.map(n => n[0]).join('');
      } else {
        initials += currentRide.driver.name[0] || '';
        initials += currentRide.driver.name[1] || '';
      }
      return initials;
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
