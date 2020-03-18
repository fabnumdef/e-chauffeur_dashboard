<template>
  <main>
    <crud-header
      title="Lieux"
      :to-create-new="{name: 'pois-new'}"
      import-csv
      export-csv
      :mask="mask"
      has-mask
      :pagination="pagination"
      :api-call="$api.pois(null, mask).getPois"
      @importCSV="importCSV"
    />
    <crud-list
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
    </crud-list>
  </main>
</template>

<script>
import crudList from '~/components/crud/list.vue';
import crudHeader from '~/components/crud/header.vue';

const columns = { id: 'ID', label: 'Label', enabled: 'Activé' };

export default {
  watchQuery: ['offset', 'limit'],
  components: {
    crudList,
    crudHeader,
  },
  async asyncData({ $api, query }) {
    const offset = parseInt(query.offset, 10) || 0;
    const limit = parseInt(query.limit, 10) || 30;
    const { data, pagination } = await $api.pois(null, Object.keys(columns).join(','), { withDisabled: true })
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
  },
  methods: {
    async deletePoi({ id }) {
      await this.$api.pois().deletePoi(id);
      this.updateList();
    },
    async importCSV({ data, params }) {
      try {
        await this.$api.pois().postPois(data, params);
        this.$toast.success('Import réalisé avec succès');
      } catch (err) {
        this.$toast.error("Un problème est survenu pendant l'import");
      }
      this.updateList();
    },
    async updateList() {
      const offset = parseInt(this.$route.query.offset, 10) || 0;
      const limit = parseInt(this.$route.query.limit, 10) || 30;
      const updatedList = await this.$api.pois(null, Object.keys(columns).join(','), { withDisabled: true })
        .getPois({ offset, limit });
      this.pois = updatedList.data;
      this.pagination = updatedList.pagination;
    },
  },
};
</script>
