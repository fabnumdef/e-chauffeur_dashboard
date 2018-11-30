<template>
  <main>
    <header class="with-options">
      <h1 class="title">Campuses</h1>
      <div class="options">
        <nuxt-link
          :to="{name: 'campuses-new'}"
          class="button is-success">
          <span class="icon is-small">
            <fa-icon :icon="['fas', 'plus']" />
          </span>
          <span>Create</span>
        </nuxt-link>
      </div>
    </header>
    <ec-list
      :columns="{id: 'ID', name: 'Name'}"
      :data="campuses"
      :pagination-offset="pagination.offset"
      :pagination-total="pagination.total"
      :pagination-per-page="pagination.limit"
      action-edit="campuses-id-edit"
      @action-remove="deleteCampus"
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
    const { data, pagination } = await $api.campuses.getCampuses('id,name');
    return {
      campuses: data,
      pagination,
    };
  },
  methods: {
    async deleteCampus({ id }) {
      await this.$api.campuses.deleteCampus(id);
      const updatedList = await this.$api.campuses.getCampuses('id,name');
      this.campuses = updatedList.data;
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
