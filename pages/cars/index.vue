<template>
  <main>
    <header class="with-options">
      <h1 class="title">Cars</h1>
      <div class="options">
        <nuxt-link
          :to="{name: 'cars-new'}"
          class="button is-success">
          <span class="icon is-small">
            <fa-icon :icon="['fas', 'plus']" />
          </span>
          <span>Create</span>
        </nuxt-link>
      </div>
    </header>
    <ec-list
      :columns="{ id: 'ID', inherit: 'Héritage' }"
      :data="cars"
      :pagination-offset="pagination.offset"
      :pagination-total="pagination.total"
      :pagination-per-page="pagination.limit"
      action-edit="cars-id-edit"
      @action-remove="deleteCar"
    />

  </main>
</template>

<script>
import ecList from '~/components/crud/list.vue';

export default {
  watchQuery: ['offset'],
  components: {
    ecList,
  },
  async asyncData({ $api }) {
    const { data, pagination } = await $api.cars.getCars('id,email');
    return {
      cars: data,
      pagination,
    };
  },
  methods: {
    async deleteCar({ id }) {
      await this.$api.cars.deleteCar(id);
      const updatedList = await this.$api.cars.getCars('id,email');
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
