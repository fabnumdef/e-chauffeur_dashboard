<template>
  <main>
    <header class="with-options">
      <h1 class="title">
        Lieux
      </h1>
      <div class="options">
        <nuxt-link
          :to="{name: 'pois-new'}"
          class="button is-success"
        >
          <span class="icon is-small">
            <fa-icon :icon="['fas', 'plus']" />
          </span>
          <span>Créer</span>
        </nuxt-link>
      </div>
    </header>
    <ec-list
      :columns="columns"
      :data="pois"
      :pagination-offset="pagination.offset"
      :pagination-total="pagination.total"
      :pagination-per-page="pagination.limit"
      action-edit="pois-id-edit"
      @action-remove="deletePoi"
    />
  </main>
</template>

<script>
import ecList from '~/components/crud/list.vue';

const columns = { id: 'ID', label: 'Label' };

function getPois(offset = 0, query = 30) {
  return this.pois.getPois(Object.keys(columns).join(','), offset, query);
}

export default {
  watchQuery: ['offset', 'limit'],
  components: {
    ecList,
  },
  computed: {
    columns() { return columns; },
  },
  async asyncData({ $api, query }) {
    console.log(query);
    const offset = parseInt(query.offset, 10) || 0;
    const limit = parseInt(query.limit, 10) || 30;
    // const { parseInt(offset) = 0, limit = 30 } = query;
    const { data, pagination } = await getPois.call($api, offset, limit);
    return {
      pois: data,
      pagination,
    };
  },
  methods: {
    async deletePoi({ id }) {
      await this.$api.pois.deletePoi(id);
      const updatedList = await getPois.call(this.$api);
      this.pois = updatedList.data;
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
