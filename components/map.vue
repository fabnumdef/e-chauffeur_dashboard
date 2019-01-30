<template>
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
                class="is-danger"
              />
              <text class="is-danger is-inverted" x="50%" y="50%" text-anchor="middle" dy=".3em">RZ</text>
            </svg>
          </l-icon>
        </l-marker>
      </l-map>
    </no-ssr>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  methods: {
    reverse([lon, lat]) {
      return [lat, lon];
    },
  },
  computed: {
    center() {
      return [48.843899069900495, 2.276982919626627];
      const [lon, lat] = this.campus.location.coordinates;
      return [lat, lon];
    },
    ...mapGetters({
      drivers: 'realtime/drivers',
      campus: 'context/campus',
    }),
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
  }
</style>
