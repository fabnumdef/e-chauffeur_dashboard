<template>
  <main>
    <header>
      <h1 class="title">
        Appréciations
      </h1>
    </header>
    <ec-list
      :columns="columns"
      :data="ratings"
      :pagination-offset="pagination.offset"
      :pagination-total="pagination.total"
      :pagination-per-page="pagination.limit"
    />
  </main>
</template>

<script>
import ecList from '~/components/crud/list.vue';

const columns = {
  createdAt: 'Timestamp', uxGrade: 'Note UX', recommandationGrade: 'Recommandation', message: 'Message',
};

export default {
  watchQuery: ['offset', 'limit'],
  components: {
    ecList,
  },
  computed: {
    columns() { return columns; },
  },
  async asyncData({ $api, query }) {
    const offset = parseInt(query.offset, 10) || 0;
    const limit = parseInt(query.limit, 10) || 30;
    const { data: ratings, pagination } = await $api.ratings('*').getRatings(offset, limit);
    return {
      ratings,
      pagination,
    };
  },
};
</script>
