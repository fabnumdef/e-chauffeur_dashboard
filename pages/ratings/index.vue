<template>
  <main>
    <header>
      <h1 class="title">
        Appréciations
      </h1>
    </header>
    <ec-list
      :columns="columns"
      :data="ratingsToDisplay"
      :pagination-offset="pagination.offset"
      :pagination-total="pagination.total"
      :pagination-per-page="pagination.limit"
    />
  </main>
</template>

<script>
import ecList from '~/components/crud/list.vue';

const columns = {
  createdAt: 'Timestamp',
  uxGrade: 'Note UX',
  recommandationGrade: 'Recommandation',
  message: 'Message',
  ride: 'Ride',
  campus: 'Campus',
};

export default {
  watchQuery: ['offset', 'limit'],
  components: {
    ecList,
  },
  async asyncData({ $api, query }) {
    const offset = parseInt(query.offset, 10) || 0;
    const limit = parseInt(query.limit, 10) || 30;
    const { data: ratings, pagination } = await $api.ratings('*').getRatings(offset, limit);
    const ratingsToDisplay = ratings.map((rating) => ({
      ...rating,
      ride: rating.ride.id,
      campus: rating.ride.campus.id,
    }));
    return {
      ratingsToDisplay,
      pagination,
    };
  },
  computed: {
    columns() { return columns; },
  },
};
</script>
