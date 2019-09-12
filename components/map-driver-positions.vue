<template>
  <div
    id="map-wrap"
  >
    <client-only>
      <l-map
        :zoom="13"
        :center="center"
      >
        <l-tile-layer url="//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <l-marker
          v-for="{position, driver, date} in flavoredPositions"
          :key="driver.id"
          :lat-lng="[position.latitude, position.longitude]"
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
                class="is-primary"
              />
              <text
                v-if="driver.firstname || driver.lastname"
                class="is-inverted is-uppercase is-primary"
                x="50%"
                y="50%"
                text-anchor="middle"
                dy=".3em"
              >
                {{ getInitials(driver.firstname, driver.lastname) }}
              </text>
              <text
                v-else
                class="is-inverted is-uppercase"
                x="50%"
                y="50%"
                text-anchor="middle"
                dy=".3em"
              >
                {{ getInitials(...driver.name.split(' ')) }}
              </text>
            </svg>
          </l-icon>
          <l-popup class="content">
            <dl>
              <dt>ID Chauffeur</dt>
              <dd>{{ driver.id }}</dd>
              <dt>Nom</dt>
              <dd v-if="driver.firstname || driver.lastname">
                {{ driver.firstname }} {{ driver.lastname }}
              </dd>
              <dd v-else>
                {{ driver.name }}
              </dd>
              <dt>Date</dt>
              <dd>{{ date }}</dd>
              <dt>Position</dt>
              <dd>
                <dl>
                  <dt>Latitude</dt>
                  <dd>{{ position.latitude }}</dd>
                  <dt>Longitude</dt>
                  <dd>{{ position.longitude }}</dd>
                </dl>
              </dd>
            </dl>
          </l-popup>
          <l-tooltip class="content">
            <dl>
              <dt>Nom</dt>
              <dd v-if="driver.firstname || driver.lastname">
                {{ driver.firstname }} {{ driver.lastname }}
              </dd>
              <dd v-else>
                {{ driver.name }}
              </dd>
              <dt>Date</dt>
              <dd>{{ date }}</dd>
            </dl>
          </l-tooltip>
        </l-marker>
      </l-map>
    </client-only>
  </div>
</template>

<script>
export default {
  props: {
    campus: {
      type: Object,
      default: null,
    },
    positions: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    center() {
      const [lon, lat] = this.campus.location.coordinates;
      return [lat, lon];
    },
    flavoredPositions() {
      return this.positions.map(({ position, driver, date }) => {
        const [longitude, latitude] = position.coordinates;
        return {
          driver,
          date,
          position: {
            latitude,
            longitude,
          },
        };
      });
    },
  },
  methods: {
    getInitials(...fragments) {
      return fragments.map((fragment) => fragment.charAt(0)).join('');
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
    width: 100%;
    height: 450px;
  }
</style>
