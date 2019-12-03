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
    >
      <template
        v-if="$auth.isSuperAdmin()"
        #actions="{ row }"
      >
        <nuxt-link
          v-if="$auth.isSuperAdmin()"
          :to="{
            name: 'pois-id-edit',
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
          @click="deletePoi(row)"
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

const columns = { id: 'ID', label: 'Label', enabled: 'Activé' };

export default {
  watchQuery: ['offset', 'limit'],
  components: {
    ecList,
  },
  async asyncData({ $api, query }) {
    const offset = parseInt(query.offset, 10) || 0;
    const limit = parseInt(query.limit, 10) || 30;
    const { data, pagination } = await $api.pois(null, Object.keys(columns).join(','), { withDisabled: true })
      .getPois(offset, limit);

    const pois = data.map((poi) => ({
      ...poi,
      enabled: (poi.enabled === false)
        ? 'fas:times-circle:error'
        : 'fas:check-circle:success',
    }));
    return {
      pois,
      pagination,
    };
  },
  computed: {
    columns() { return columns; },
  },
  methods: {
    async deletePoi({ id }) {
      await this.$api.pois().deletePoi(id);
      const offset = parseInt(this.$route.query.offset, 10) || 0;
      const limit = parseInt(this.$route.query.limit, 10) || 30;
      const updatedList = await this.$api.pois(null, Object.keys(columns).join(','), { withDisabled: true })
        .getPois(offset, limit);
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
