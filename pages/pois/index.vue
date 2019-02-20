<template>
  <main>
    <header class="with-options">
      <h1 class="title">
        Pois
      </h1>
      <div class="options">
        <nuxt-link
          :to="{name: 'pois-new'}"
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

function getPois() {
  return this.pois.getPois(Object.keys(columns).join(','));
}

export default {
  watchQuery: ['offset'],
  components: {
    ecList,
  },
  computed: {
    columns() { return columns; },
  },
  async asyncData({ $api }) {
    const { data, pagination } = await getPois.call($api);
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
