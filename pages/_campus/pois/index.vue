<template>
  <main>
    <ec-header
      title="Lieux"
      :to-create-new="campusLink('pois-new')"
      @uploadCSV="uploadCSV"
    />
    <ec-list
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
    </ec-list>
  </main>
</template>

<script>
import { mapGetters } from 'vuex';
import ecList from '~/components/crud/list.vue';
import ecHeader from '~/components/crud/header.vue';

const columns = { id: 'ID', label: 'Label', enabled: 'Activé' };

export default {
  watchQuery: ['offset', 'limit'],
  components: {
    ecList,
    ecHeader,
  },
  async asyncData({ $api, query, params }) {
    const offset = parseInt(query.offset, 10) || 0;
    const limit = parseInt(query.limit, 10) || 30;
    const { data, pagination } = await $api.pois(
      { id: params.campus },
      Object.keys(columns).join(','),
      { withDisabled: true },
    ).getPois(offset, limit);

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
    ...mapGetters({
      campus: 'context/campus',
    }),
  },
  methods: {
    async deletePoi({ id }) {
      if (window && window.confirm && window.confirm('Voulez vous vraiment supprimer ce lieu ?')) {
        await this.$api.pois(this.campus).deletePoi(id);
        const offset = parseInt(this.$route.query.offset, 10) || 0;
        const limit = parseInt(this.$route.query.limit, 10) || 30;
        const updatedList = await this.$api.pois(this.campus, Object.keys(columns).join(','), { withDisabled: true })
          .getPois(offset, limit);
        this.pois = updatedList.data;
        this.pagination = updatedList.pagination;
      }
    },
    async uploadCSV(data) {
      try {
        await this.$api.pois(this.campus).postPois(data);
        this.$toast.success('Import réalisé avec succès');
      } catch (err) {
        this.$toast.error("Un problème est survenu pendant l'import");
      }
    },
  },
};
</script>
