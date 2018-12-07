<template>
  <main>
    <header class="with-options">
      <h1 class="title">
        Cars
      </h1>
      <div class="options">
        <NuxtLink
          :to="campusLink('cars-new')"
          class="button is-success"
        >
          <span class="icon is-small">
            <FaIcon :icon="['fas', 'plus']" />
          </span>
          <span>Create</span>
        </NuxtLink>
      </div>
    </header>
    <EcList
      :columns="columns"
      :data="cars"
      :pagination-offset="pagination.offset"
      :pagination-total="pagination.total"
      :pagination-per-page="pagination.limit"
      :action-edit="campusLink('cars-id-edit')"
      @action-remove="deleteCar"
    />
  </main>
</template>

<script>
import ecList from '~/components/crud/list.vue';
import { mapGetters } from 'vuex';

const columns = { id: 'ID', label: 'Label' };

export default {
  watchQuery: ['offset'],
  components: {
    ecList,
  },
  async asyncData({ params, $api }) {
    const { data, pagination } = await $api.cars({ id: params.campus }, Object.keys(columns).join(',')).getCars();
    return {
      cars: data,
      pagination,
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
      const updatedList = await this.CarsAPI.getCars();
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
