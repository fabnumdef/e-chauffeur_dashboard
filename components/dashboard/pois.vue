<template>
  <fragmented-tile
    v-if="pois"
    :title="title"
  >
    <template
      v-if="pois.length"
      #TEXT
    >
      <ol>
        <li
          v-for="poi of pois.slice(0, 3)"
          :key="poi.id"
        >
          {{ poi[subKey] ? poi[subKey].label : 'NC' }} (<strong>{{ poi.total }}</strong> course(s))
        </li>
      </ol>
    </template>
    <template
      v-if="pois.length"
      #PIE
    >
      <pie-chart :chart-data="piePois" />
    </template>
    <template
      v-if="pois.length"
      #MAP
    >
      <client-only placeholder="Chargement...">
        <l-map
          :zoom="13"
          :center="center"
          class="small-map"
        >
          <l-tile-layer url="//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <l-marker
            v-for="poi in pois"
            :key="poi.id"
            :lat-lng="reverse(poi[subKey].location.coordinates)"
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
                  class="poi-circle"
                />
                <text
                  class="poi-text"
                  x="50%"
                  y="50%"
                  text-anchor="middle"
                  dy=".3em"
                >
                  {{ poi.total }}
                </text>
              </svg>
            </l-icon>
            <l-tooltip class="content">
              <dl>
                <dt>ID</dt>
                <dd>
                  {{ poi.id }}
                </dd>
                <dt>Label</dt>
                <dd>
                  {{ poi[subKey].label }}
                </dd>
              </dl>
            </l-tooltip>
          </l-marker>
        </l-map>
      </client-only>
    </template>
  </fragmented-tile>
</template>

<script>
import pieChart from '~/components/charts/pie.vue';
import fragmentedTile from '~/components/dashboard/fragments.vue';
import bgColorsMixin from '~/components/dashboard/mixins/background-colors';

export default {
  components: {
    fragmentedTile,
    pieChart,
  },
  mixins: [bgColorsMixin],
  props: {
    mapCenter: {
      type: Array,
      required: true,
    },
    subKey: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    pois: {
      type: Array,
      default: () => ([]),
    },
  },
  computed: {
    center() {
      return this.reverse(this.mapCenter);
    },
    piePois() {
      return {
        labels: this.pois.map((poi) => (poi[this.subKey] ? poi[this.subKey].label : 'NC')),
        datasets: [{ ...this.backgroundColors, data: this.pois.map(({ total }) => total) }],
      };
    },
  },
  methods: {
    reverse([lon, lat]) {
      return [lat, lon];
    },
  },
};
</script>
<style scoped lang="scss">
  @import "~assets/css/head";
  .small-map {
    min-height: 300px;
    .poi-circle {
      fill: rgba($primary, 0.8);
    }
    .poi-text {
      fill: $white;
      font-weight: bold;
    }
  }
</style>
