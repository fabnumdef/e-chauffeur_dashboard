<template>
  <main>
    <crud-header
      title="Appréciations"
      export-csv
      :mask="mask"
      :pagination="pagination"
      :api-call="$api.users.getUsers"
    />
    <crud-list
      :columns="columns"
      :data="ratings"
      :pagination-offset="pagination.offset"
      :pagination-total="pagination.total"
      :pagination-per-page="pagination.limit"
    />
  </main>
</template>

<script>
import crudList from '~/components/crud/list.vue';
import crudHeader from '~/components/crud/header.vue';

const columns = {
  createdAt: 'Date',
  uxGrade: 'Note UX',
  recommandationGrade: 'Recommandation',
  message: 'Message',
  ride: 'ID de la course',
  campus: 'Base',
};

export default {
  watchQuery: ['offset', 'limit'],
  components: {
    crudList,
    crudHeader,
  },
  async asyncData({ $api, query }) {
    const offset = parseInt(query.offset, 10) || 0;
    const limit = parseInt(query.limit, 10) || 30;
    const { data, pagination } = await $api.ratings.getRatings(
      'id,uxGrade,recommandationGrade,message,ride(campus),createdAt,ride',
      { offset, limit },
    );
    const ratings = data.map((rating) => ({
      ...rating,
      ride: rating.ride.id,
      campus: rating.ride.campus.id,
    }));
    return {
      ratings,
      pagination,
    };
  },
  data() {
    return {
      mask: 'id,uxGrade,recommandationGrade,message,ride(campus),ride,createdAt',
    };
  },
  computed: {
    columns() { return columns; },
  },
};
</script>

<style lang="scss" scoped>
  #rating-header {
    display: flex;
    justify-content: space-between;
  }
</style>
