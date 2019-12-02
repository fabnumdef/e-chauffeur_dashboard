<template>
  <main>
    <header id="rating-header">
      <h1 class="title">
        Appréciations
      </h1>
      <button
        class="button is-rounded"
        type="button"
        @click="toggleCsvModal(true)"
      >
        <fa-icon
          :icon="['fas', 'file-export']"
          class="has-text-info"
        />
        Exporter CSV
      </button>
    </header>
    <ec-list
      :columns="columns"
      :data="ratings"
      :pagination-offset="pagination.offset"
      :pagination-total="pagination.total"
      :pagination-per-page="pagination.limit"
    />
    <csv-modal
      :csv-status="displayModal"
      :pagination="pagination"
      :api-call="$api.ratings.getRatings"
      @toggleModal="toggleCsvModal"
      :mask="mask"
    />
  </main>
</template>

<script>
import ecList from '~/components/crud/list';
import csvModal from '~/components/csv-modal';

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
    csvModal,
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
      displayModal: false,
      mask: 'id,uxGrade,recommandationGrade,message,ride(campus),ride,createdAt',
    };
  },
  computed: {
    columns() { return columns; },
  },
  methods: {
    toggleCsvModal(force) {
      this.displayModal = force || !this.displayModal;
    },
  },
};
</script>

<style lang="scss" scoped>
  #rating-header {
    display: flex;
    justify-content: space-between;
  }
</style>
