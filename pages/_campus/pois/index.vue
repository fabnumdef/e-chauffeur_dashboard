<template>
  <main>
    <crud-header
      title="Lieux"
      :to-create-new="campusLink('pois-new')"
      :can-create-new="$auth.isAdmin(campus.id) || $auth.isSuperAdmin()"
      :import-csv="$auth.isAdmin(campus.id) || $auth.isSuperAdmin()"
      export-csv
      :mask="mask"
      has-mask
      :pagination="pagination"
      :api-call="$api.pois(campus.id, mask).getPois"
      @importCSV="importCSV"
    />
    <crud-list
      :columns="columns"
      :data="pois"
      :pagination-offset="pagination.offset"
      :pagination-total="pagination.total"
      :pagination-per-page="pagination.limit"
    >
      <template
        v-if="$auth.isSuperAdmin() || $auth.isAdmin(campus.id)"
        #actions="{ row }"
      >
        <nuxt-link
          v-if="$auth.isSuperAdmin() || $auth.isAdmin(campus.id)"
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
          v-if="$auth.isSuperAdmin() || $auth.isAdmin(campus.id)"
          class="button is-danger"
          @click="deletePoi(row)"
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
import crudHeader from '~/components/crud/header.vue';

const columns = { id: 'ID', label: 'Label', enabled: 'Activé' };

export default {
  watchQuery: ['offset', 'limit'],
  components: {
    crudList,
    crudHeader,
  },
  async asyncData({ $api, query, params }) {
    const offset = parseInt(query.offset, 10) || 0;
    const limit = parseInt(query.limit, 10) || 30;
    const { data, pagination } = await $api
      .pois({ id: params.campus }, Object.keys(columns).join(','), { withDisabled: true })
      .getPois({ offset, limit });

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
  data() {
    return {
      mask: 'id,label,location(coordinates),campus(id,name)',
    };
  },
  computed: {
    columns() { return columns; },
    ...mapGetters({
      campus: 'context/campus',
    }),
  },
  methods: {
    async deletePoi({ id }) {
      if (window && window.confirm && window.confirm('Voulez vous vraiment supprimer ce lieu ?')) {
        await this.$api.pois(this.campus).deletePoi(id);
        this.updateList();
      }
    },
    async importCSV({ data, params }) {
      try {
        await this.$api.pois(this.campus).postPois(data, params);
        this.$toast.success('Import réalisé avec succès');
      } catch (err) {
        this.$toast.error("Un problème est survenu pendant l'import");
      }
      this.updateList();
    },
    async updateList() {
      const offset = parseInt(this.$route.query.offset, 10) || 0;
      const limit = parseInt(this.$route.query.limit, 10) || 30;
      const updatedList = await this.$api.pois(this.campus, Object.keys(columns).join(','), { withDisabled: true })
        .getPois(offset, limit);
      this.pois = updatedList.data;
      this.pagination = updatedList.pagination;
    },
  },
};
</script>
