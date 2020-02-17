<template>
  <main>
    <header>
      <div class="columns">
        <div class="column">
          <h1 class="title">
            Chauffeurs
          </h1>
        </div>
        <div class="column is-narrow">
          <nuxt-link
            :to="campusLink('drivers-new')"
            class="button is-success"
          >
            <span class="icon is-small">
              <fa-icon :icon="['fas', 'plus']" />
            </span>
            <span>Nouveau</span>
          </nuxt-link>
        </div>
      </div>
    </header>
    <crud-list
      :columns="columns"
      :data="drivers"
      :pagination-offset="pagination.offset"
      :pagination-total="pagination.total"
      :pagination-per-page="pagination.limit"
    >
      <template
        v-if="$auth.isSuperAdmin() || $auth.isRegulator(campus.id)"
        #actions="{ row }"
      >
        <nuxt-link
          v-if="$auth.isSuperAdmin() || $auth.isRegulator(campus.id)"
          :to="campusLink('drivers-id-edit', {
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
          v-if="$auth.isSuperAdmin() || $auth.isRegulator(campus.id)"
          class="button is-danger"
          @click="deleteDriver(row)"
        >
          <span class="icon is-small">
            <fa-icon :icon="['fas', 'trash']" />
          </span>
          <span>Supprimer</span>
        </button>
      </template>
    </crud-list>
  </main>
</template>

<script>
import { mapGetters } from 'vuex';
import crudList from '~/components/crud/list.vue';

const columns = { id: 'ID', email: 'E-mail' };

export default {
  watchQuery: ['offset', 'limit'],
  components: {
    crudList,
  },
  async asyncData({ params, $api, query }) {
    const offset = parseInt(query.offset, 10) || 0;
    const limit = parseInt(query.limit, 10) || 30;
    const { data, pagination } = await $api.drivers(params.campus, Object.keys(columns).join(','))
      .getDrivers({ offset, limit });
    return {
      drivers: data,
      pagination,
    };
  },
  computed: {
    columns: () => columns,
    ...mapGetters({
      campus: 'context/campus',
    }),
  },
  methods: {
    async deleteDriver({ id }) {
      if (window && window.confirm && window.confirm('Voulez vous vraiment supprimer ce chauffeur ?')) {
        await this.$api.drivers(this.campus.id).deleteDriver(id);
        const offset = parseInt(this.$route.query.offset, 10) || 0;
        const limit = parseInt(this.$route.query.limit, 10) || 30;
        const updatedList = await this.$api.drivers(this.campus.id, Object.keys(columns).join(','))
          .getDrivers({ offset, limit });
        this.drivers = updatedList.data;
        this.pagination = updatedList.pagination;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
header {
  margin-bottom: 1.5rem;
  .button {
    margin-right: 10px;
  }
}
</style>
