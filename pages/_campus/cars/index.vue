<template>
  <main>
    <header class="with-options">
      <h1 class="title">
        Véhicules
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
      <csv-modal
        :csv-status="displayModal"
        :pagination="pagination"
        :api-call="$api.cars(campus.id, mask).getCars"
        :has-mask="true"
        :mask="mask"
        @toggleModal="toggleCsvModal"
        @updateMask="updateMask"
      />
      <div class="options">
        <nuxt-link
          :to="campusLink('cars-new')"
          class="button is-success"
        >
          <span class="icon is-small">
            <fa-icon :icon="['fas', 'plus']" />
          </span>
          <span>Nouveau</span>
        </nuxt-link>
      </div>
    </header>
    <ec-list
      :columns="columns"
      :data="cars"
      :pagination-offset="pagination.offset"
      :pagination-total="pagination.total"
      :pagination-per-page="pagination.limit"
      :action-edit="campusLink('cars-id-edit')"
      action-remove-confirm="Voulez vous vraiment supprimer ce véhicule ?"
      @action-remove="deleteCar"
    />
  </main>
</template>

<script>
import { mapGetters } from 'vuex';
import ecList from '~/components/crud/list';
import csvModal from '~/components/csv-modal';

const columns = { id: 'ID', label: 'Label' };

export default {
  watchQuery: ['offset', 'limit'],
  components: {
    ecList,
    csvModal,
  },
  async asyncData({ params, $api, query }) {
    const offset = parseInt(query.offset, 10) || 0;
    const limit = parseInt(query.limit, 10) || 30;
    const { data, pagination } = await $api
      .cars({ id: params.campus }, Object.keys(columns).join(','))
      .getCars({ offset, limit });
    return {
      cars: data,
      pagination,
    };
  },
  data() {
    return {
      displayModal: false,
      mask: 'id,label,model(label),campus(name)',
    };
  },
  computed: {
    columns: () => columns,
    ...mapGetters({
      campus: 'context/campus',
    }),
    CarsAPI() {
      return this.$api.cars(this.campus, Object.keys(columns).join(','));
    },
  },
  methods: {
    async deleteCar({ id }) {
      await this.CarsAPI.deleteCar(id);
      const offset = parseInt(this.$route.query.offset, 10) || 0;
      const limit = parseInt(this.$route.query.limit, 10) || 30;
      const updatedList = await this.CarsAPI.getCars({ offset, limit });
      this.cars = updatedList.data;
      this.pagination = updatedList.pagination;
    },
    toggleCsvModal(force) {
      this.displayModal = force || !this.displayModal;
    },
    updateMask(mask) {
      this.mask = mask;
    },
  },
};
</script>

<style lang="scss" scoped>
  .with-options {
    display: flex;
    .title {
      flex-grow: 1;
    }
    .options {
      padding: 0 10px 10px;
      float: right;
    }
  }
</style>
