<template>
  <main>
    <header class="with-options">
      <h1 class="title">
        Lieux
      </h1>
      <div class="options">
        <nuxt-link
          :to="campusLink('pois-new')"
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
    >
      <template #actions="{ row }">
        <nuxt-link
          v-if="$auth.isAdmin()"
          :to="campusLink('pois-id-edit', {
            params: { id: row.id },
          })"
          class="button is-primary"
        >
          <span class="icon is-small">
            <fa-icon :icon="['fas', 'edit']" />
          </span>
          <span>Modifier</span>
        </nuxt-link>
        <button
          v-if="$auth.isAdmin()"
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
import { mapGetters } from 'vuex';

const columns = { id: 'ID', label: 'Label' };

export default {
  watchQuery: ['offset', 'limit'],
  components: {
    ecList,
  },
  computed: {
    columns() { return columns; },
    ...mapGetters({
      campus: 'context/campus',
    }),
  },
  async asyncData({ $api, query, params }) {
    const offset = parseInt(query.offset, 10) || 0;
    const limit = parseInt(query.limit, 10) || 30;
    const { data, pagination } = await $api.pois({ id: params.campus }, Object.keys(columns).join(','))
      .getPois(offset, limit);
    return {
      pois: data,
      pagination,
    };
  },
  methods: {
    async deletePoi({ id }) {
      await this.$api.pois().deletePoi(id);
      const offset = parseInt(this.$route.query.offset, 10) || 0;
      const limit = parseInt(this.$route.query.limit, 10) || 30;
      const updatedList = await this.$api.pois(this.campus, Object.keys(columns).join(',')).getPois(offset, limit);
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
