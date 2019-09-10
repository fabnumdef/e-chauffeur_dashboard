<template>
  <main>
    <header class="with-options">
      <h1 class="title">
        Véhicules
      </h1>
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
import ecList from '~/components/crud/list.vue';

const columns = { id: 'ID', label: 'Label' };

export default {
  watchQuery: ['offset', 'limit'],
  components: {
    ecList,
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
  async asyncData({ params, $api, query }) {
    const offset = parseInt(query.offset, 10) || 0;
    const limit = parseInt(query.limit, 10) || 30;
    const { data, pagination } = await $api
      .cars({ id: params.campus }, Object.keys(columns).join(','))
      .getCars(offset, limit);
    return {
      cars: data,
      pagination,
    };
  },
  methods: {
    async deleteCar({ id }) {
      await this.CarsAPI.deleteCar(id);
      const offset = parseInt(this.$route.query.offset, 10) || 0;
      const limit = parseInt(this.$route.query.limit, 10) || 30;
      console.log(offset, limit);
      const updatedList = await this.CarsAPI.getCars(offset, limit);
      this.cars = updatedList.data;
      this.pagination = updatedList.pagination;
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
