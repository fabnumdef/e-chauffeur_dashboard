<template>
  <ec-map
    class="is-map"
    :is-fullscreen="true"
  />
</template>

<script>
import ecMap from '~/components/map.vue';

export default {
  components: {
    ecMap,
  },
};
</script>
