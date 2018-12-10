<template>
  <main>
    <header class="with-options">
      <h1 class="title">
        CarModels
      </h1>
      <div class="options">
        <nuxt-link
          :to="{name: 'car-models-new'}"
          class="button is-success"
        >
          <span class="icon is-small">
            <fa-icon :icon="['fas', 'plus']" />
          </span>
          <span>Create</span>
        </nuxt-link>
      </div>
    </header>
    <ec-list
      :columns="columns"
      :data="carModels"
      :pagination-offset="pagination.offset"
      :pagination-total="pagination.total"
      :pagination-per-page="pagination.limit"
      action-edit="car-models-id-edit"
      @action-remove="deleteCarModel"
    />
  </main>
</template>

<script>
import ecList from '~/components/crud/list.vue';

const columns = { id: 'ID', label: 'Label' };

function getCarModels() {
  return this.carModels.getCarModels(Object.keys(columns).join(','));
}

export default {
  watchQuery: ['offset'],
  components: {
    ecList,
  },
  async asyncData({ $api }) {
    const { data, pagination } = await getCarModels.call($api);
    return {
      carModels: data,
      pagination,
    };
  },
  computed: {
    columns() { return columns; },
  },
  methods: {
    async deleteCarModel({ id }) {
      await this.$api.carModels.deleteCarModel(id);
      const updatedList = await getCarModels.call(this.$api);
      this.carModels = updatedList.data;
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
