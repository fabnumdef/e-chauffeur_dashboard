<template>
  <fragmented-tile
    v-if="ratings"
    title="Appréciations sur la période"
  >
    <template
      #TEXT
    >
      <ul>
        <li>Total : <strong>{{ ratings.total }}</strong></li>
        <li v-if="ratings.total > 0">
          Note UX : <strong>{{ ratings.ux }} / 5</strong>
        </li>
        <li v-if="ratings.total > 0">
          Recommandation : <strong>{{ ratings.recommandation }} / 10</strong>
        </li>
      </ul>
    </template>
  </fragmented-tile>
</template>

<script>
import fragmentedTile from '~/components/dashboard/fragments.vue';

export default {
  components: {
    fragmentedTile,
  },
  props: {
    ratings: {
      type: Object,
      default: () => null,
    },
  },
};
</script>
