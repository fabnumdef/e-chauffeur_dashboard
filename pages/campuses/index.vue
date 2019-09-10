<template>
  <main>
    <header class="with-options">
      <h1 class="title">
        Bases
      </h1>
      <div class="options">
        <nuxt-link
          v-if="$auth.isSuperAdmin()"
          :to="{name: 'campuses-new'}"
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
      :columns="{id: 'ID', name: 'Nom'}"
      :data="campuses"
      :pagination-offset="pagination.offset"
      :pagination-total="pagination.total"
      :pagination-per-page="pagination.limit"
    >
      <template #actions="{ row }">
        <nuxt-link
          v-if="$auth.isSuperAdmin()"
          :to="{
            name: 'campuses-id-edit',
            params: { id: row.id },
          }"
          class="button is-primary"
        >
          <span class="icon is-small">
            <fa-icon :icon="['fas', 'edit']" />
          </span>
          <span>Modifier</span>
        </nuxt-link>
        <button
          v-if="$auth.isSuperAdmin()"
          class="button is-danger"
          @click="deleteCampus(row)"
        >
          <span class="icon is-small">
            <fa-icon :icon="['fas', 'trash']" />
          </span>
          <span>Supprimer</span>
        </button>
      </template>
    </ec-list>
  </main>
</template>

<script>
import ecList from '~/components/crud/list.vue';

export default {
  watchQuery: ['offset', 'limit'],
  components: {
    ecList,
  },
  async asyncData({ $api, query }) {
    const offset = parseInt(query.offset, 10) || 0;
    const limit = parseInt(query.limit, 10) || 30;
    const { data, pagination } = await $api.campuses.getCampuses('id,name', {}, offset, limit);
    return {
      campuses: data,
      pagination,
    };
  },
  methods: {
    async deleteCampus({ id }) {
      await this.$api.campuses.deleteCampus(id);
      const offset = parseInt(this.$route.query.offset, 10) || 0;
      const limit = parseInt(this.$route.query.limit, 10) || 30;
      const updatedList = await this.$api.campuses.getCampuses('id,name', {}, offset, limit);
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
